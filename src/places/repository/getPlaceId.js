import dynamoDb from "../../util/dynamodb";

export default async function getPlaceId(userId, placeId) {
  const filterExpression = "status <> :sts";
  const expressionAttributeValues = {
    ":sts": "deleted",
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    Key: {
      placeId: placeId,
      userId: userId,
    },
  };
  
  const result = await dynamoDb.get(params);

  return result.Item;
}