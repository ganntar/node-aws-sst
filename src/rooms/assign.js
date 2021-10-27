import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getRoomId from "./repository/getRoomId";
import moment from "moment";

export const main = handler(async (event) => {
  const roomId = event.pathParameters.roomId
  const placeId = event.pathParameters.placeId
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const oldRoom = await getRoomId(userId, roomId);

  
  const updateItem = {
    ...oldRoom,
    placeId: placeId,
    updatedAt: moment().utc().format()
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: userId,
      roomId: roomId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return params;
})