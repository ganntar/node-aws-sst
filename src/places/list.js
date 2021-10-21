import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const KeyConditionExpression = "userId = :uid";
  const FilterExpression = "#places_status <> :sts";

  const ExpressionAttributeNames = {
    "#places_status": "status",
  };

  const ExpressionAttributeValues = {
    ":uid": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    ":sts": "deleted",
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: "userIdIndex",
    KeyConditionExpression,
    FilterExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  };

  const result = await dynamoDb.query(params);

  if (!result.Items) {
    throw new Error("Items not found.");
  }

  return result.Items;
});