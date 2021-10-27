import dynamoDb from "../../util/dynamodb";

export default async function getRoomsFromPlace(userId,placeId) {
  const keyConditionExpression = "userId = :uid";
  const filterExpression = "#rooms_status <> :sts AND #placeId = :placeId";

  const expressionAttributeNames = {
    "#rooms_status": "status",
    "#placeId": "placeId"
  };

  const expressionAttributeValues = {
    ":placeId": placeId,
    ":uid": userId,
    ":sts": "deleted",
  };

  const params = {
    TableName: process.env.ROOM_TABLE,
    FilterExpression: filterExpression,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
  };

  const result = await dynamoDb.query(params);

  return result;
}