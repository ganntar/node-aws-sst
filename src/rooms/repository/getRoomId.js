import dynamoDb from "../../util/dynamodb";

export default async function getRoomId(userId, roomId) {
  const filterExpression = "status <> :sts";
  const expressionAttributeValues = {
    ":sts": "deleted",
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    Key: {
      placeId: roomId,
      userId: userId,
    },
  };
  
  const result = await dynamoDb.get(params);

  if (!result.Item) {
    return { statusCode: 400, message: 'Item not found' };
  }

  return result.Item;
}