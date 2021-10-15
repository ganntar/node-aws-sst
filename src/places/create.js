import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const main = handler(async (event) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
      placeId: uuidv4(), // Parsed from request body
      name: data.placeName,
      devices: data.devices || [],
      picture: data.picture,
      status: data.status,
      typePeople: data.typePeople,
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
    },
  };

  await dynamoDb.put(params);
  
  return params.Item;
});