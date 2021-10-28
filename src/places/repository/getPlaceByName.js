import dynamoDb from "../../util/dynamodb";


export default async function getPlaceByName(userId, placeName) {
  const keyConditionExpression = "userId = :uid";
  const filterExpression = "#place_status <> :sts AND #place_name = :nam";

  const expressionAttributeNames = {
    "#place_status": "status",
    "#place_name": "name"
  };

  const expressionAttributeValues = {
    ":uid": userId,
    ":sts": "deleted",
    ":nam": placeName
  };

  const params = {
    TableName: process.env.PLACE_TABLE,
    IndexName: "userIdIndex",
    KeyConditionExpression: keyConditionExpression,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    Key: { userId: userId }
  };

  const result = await dynamoDb.query(params);

  return result.Items;
}
