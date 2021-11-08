import dynamoDb from "../../util/dynamodb";

exports.findByDevice = async (deviceId) => {
  const keyConditionExpression = "deviceId = :dvcid";
  const filterExpression = "#place_status <> :sts";
  const expressionAttributeValues = {
    ":sts": "deleted",
    ":dvcid": deviceId,
  };

  const expressionAttributeNames = {
    "#place_status": "status",
  };

  const params = {
    TableName: process.env.REGISTRATION_TABLE,
    IndexName: "deviceIdIndex",
    KeyConditionExpression: keyConditionExpression,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    Key: { deviceId }
  };

  const result = await dynamoDb.query(params);

  if (!result.Items[0]) {
    return { statusCode: 400, message: 'Item not found' };
  }

  return result.Items[0];
};