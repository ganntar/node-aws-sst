import dynamoDb from "../../util/dynamodb";


export const getDevicesAccess = (userId, placeId) => {
  const KeyConditionExpression = 'userId = :userId'
  let FilterExpression = '#placeId = :placeId'
  const ExpressionAttributeNames = {
    '#placeId': 'placeId',
  }

  const ExpressionAttributeValues = {
    ':userId': userId,
    ':placeId': placeId,
  }

  const params = {
    TableName: process.env.DEVICE_ACCESS_TBL,
    KeyConditionExpression,
    ExpressionAttributeValues,
    FilterExpression,
    ExpressionAttributeNames,
  }

  const result = await dynamoDb.query(params);

  if (!result.Items) {
    throw new Error("Items not found.");
  }

  return result.Items;
}
