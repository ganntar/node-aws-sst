import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import getPlaceByName from "./repository/getPlaceByName";
import validatePlace from "./validator/general";

export const main = handler(async (event) => {
  const { name, devices, picture, status, typePeople } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const placeName = name.toLowerCase();
  const placeId = uuidv4();
  const placesWithSameName = await getPlaceByName( userId, placeName );
  
  if ( placesWithSameName && placesWithSameName.length > 0 ){
    if (placesWithSameName.length === 1 && placesWithSameName[0].placeId !== placeId) {
      return { statusCode: 409, error: "PlaceNameAlreadyRegistered", message: `The name ${placeName} is already registered` };
    }
  }

  const momentAt = moment().utc().format()

  const place = {
    userId,
    placeId,
    name: placeName,
    devices: devices || [],
    picture,
    status,
    typePeople,
    createdAt: momentAt,
    updatedAt: momentAt,
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