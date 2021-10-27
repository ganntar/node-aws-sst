import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import moment from "moment";
import getRoomId from "./repository/getRoomId";

export const main = handler(async (event) => {
  const roomId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const room = await getRoomId(userId, roomId);

  const updateItem = {
    ...room,
    status: 'deleted',
    updatedAt: moment().utc().format()
  };


  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: userId,
      roomId: roomId,
    },
    Item: updateItem
  };



  await dynamoDb.put(params);

  return { status: true };
});