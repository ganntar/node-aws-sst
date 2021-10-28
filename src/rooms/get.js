import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const roomId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

    const params = {
      TableName: process.env.ROOM_TABLE,
      Key: {
        roomId: roomId,
        userId: userId,
      },
    };

    const result = await dynamoDb.get(params);

    if (!result.Item) {
      return { statusCode: 400, message: 'Item not found' };
    }

    return result.Item;
});
