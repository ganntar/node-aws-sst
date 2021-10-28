import dynamoDb from "../../util/dynamodb";

export default async function getRoomsByName(userId, roomName) {
  const keyConditionExpression = "userId = :uid";
  const filterExpression = "#room_status <> :sts AND #room_name = :nam";

  const expressionAttributeNames = {
    "#room_status": "status",
    "#room_name": "name"
  };

  const expressionAttributeValues = {
    ":uid": userId,
    ":sts": "deleted",
    ":nam": roomName
  };

  const params = {
    TableName: process.env.ROOM_TABLE,
    KeyConditionExpression: keyConditionExpression,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    Key: { userId: userId }
  };

  const result = await dynamoDb.query(params);

  return result.Items;
}