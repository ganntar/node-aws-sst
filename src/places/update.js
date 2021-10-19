import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getPlaceId from "./repository/getPlaceId";
import getPlaceByName from "./repository/getPlaceByName";
import moment from "moment";

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
      return { error: "PlaceNameAlreadyRegistered", message: `The name ${placeName} is already registered` };
    }
  }

  const updateItem = {
    ...oldPlace,
    ...data,
    updatedAt: moment().utc().format()
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: userId,
      placeId: placeId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return { status: true };
});