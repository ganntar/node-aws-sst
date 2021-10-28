import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getPlaceId from "./repository/getPlaceId";
import getPlaceByName from "./repository/getPlaceByName";
import moment from "moment";
import validatePlace from "./validator/general";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const placeId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const oldPlace = await getPlaceId(userId, placeId);

  if (!oldPlace) {
    throw new Error("Item not found.");
  }

  const placeName = data.name.toLowerCase();
  const placesWithSameName = await getPlaceByName( userId, placeName );

  if ( placesWithSameName && placesWithSameName.length > 0 ){
    if (placesWithSameName.length === 1 && placesWithSameName[0].placeId !== placeId) {
      return { statusCode: 409, error: "PlaceNameAlreadyRegistered", message: `The name ${placeName} is already registered` };
    }
  }

  const updateItem = {
    ...oldPlace,
    ...data,
    name: placeName,
    updatedAt: moment().utc().format()
  };

  const validated = validatePlace(updateItem);

  if (validated.message) {
    return validated;
  }

  const params = {
    TableName: process.env.PLACE_TABLE,
    Key: {
      userId,
      placeId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return params.Item;
});