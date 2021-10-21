import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import getPlaceByName from "./repository/getPlaceByName";
import validatePlace from "./validator/general";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const placeName = data.name.toLowerCase();
  const placeId = uuidv4();
  const placesWithSameName = await getPlaceByName( userId, placeName );
  
  if ( placesWithSameName && placesWithSameName.length > 0 ){
    if (placesWithSameName.length === 1 && placesWithSameName[0].placeId !== placeId) {
      return { statusCode: 409, error: "PlaceNameAlreadyRegistered", message: `The name ${placeName} is already registered` };
    }
  }

  const place = {
    userId: userId,
    placeId: placeId,
    name: placeName,
    devices: data.devices || [],
    picture: data.picture,
    status: data.status,
    typePeople: data.typePeople,
    createdAt: moment().utc().format(),
    updatedAt: moment().utc().format(),
  }

  const validated = validatePlace(place);

  if (validated.message) {
    return validated;
  }
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: place
  };

  await dynamoDb.put(params);
  
  return params.Item;
});