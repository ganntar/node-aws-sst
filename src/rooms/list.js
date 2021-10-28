import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const KeyConditionExpression = "userId = :uid";

  const {placeId, filters} = event.queryStringParameters;


  let FilterExpression = "#rooms_status <> :sts AND #placeId = :placeId";
  const ExpressionAttributeNames = {
  "#rooms_status": "status",
  "#placeId": "placeId"
  };

  const ExpressionAttributeValues = {
  ":uid":  event.requestContext.authorizer.iam.cognitoIdentity.identityId,
  ":sts": "deleted",
  ":placeId": placeId
  };

  if (filters) {
    //const { name } = filters;
      FilterExpression += " AND #room_name = :room_name";
      ExpressionAttributeNames["#room_name"] = "name";
      ExpressionAttributeValues[":room_name"] = filters.toLowerCase();
  }

  const params = {
    TableName: process.env.ROOM_TABLE,
    KeyConditionExpression,
    FilterExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  };

  console.log(params)

  const result = await dynamoDb.query(params);

  if (!result.Items) {
    throw new Error("Items not found.");
  }

  return result.Items;
});