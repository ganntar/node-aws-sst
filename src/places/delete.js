import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import moment from "moment";
import getPlaceId from "./repository/getPlaceId";
import putRoomFromPlaceId from "./repository/putRoomFromPlaceId";

export const main = handler(async (event) => {
  const placeId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const place = await getPlaceId(userId, placeId);

  const updatedAt = moment().utc().format();

  const updateItem = {
    ...place,
    status: 'deleted',
    updatedAt
  };

  const placeParams = {
    TableName: process.env.PLACE_TABLE,
    Key: {
      userId,
      placeId,
    },
    Item: updateItem
  };
  
  await dynamoDb.put(placeParams);

  return await putRoomFromPlaceId(userId, placeId);
});