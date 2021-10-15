import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
      placeId: data.placeId, // Parsed from request body
      placeName: data.placeName,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);
  
  return params.Item;
});