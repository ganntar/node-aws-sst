import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getRoomsByName from './repository/getRoomsByName';

import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const roomId = uuidv4();
  const { name, picture } = data;
  const placeId = data.placeId ? data.placeId : "none";
  const status = "";
  const formatedRoomName = name.toLowerCase();

  const roomsWithSameName = await getRoomsByName(userId, formatedRoomName);

  if (name.length > 30 || name.length === 0) {
    throw new Error("The name must contain a maximum of 30 characters.");
  }

  if (roomsWithSameName.length > 0) {
    throw new Error("Name is already in use");
  }

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        name: formatedRoomName,
        picture,
        placeId,
        userId,
        roomId,
        status,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format(),
      },
    };

    await dynamoDb.put(params);
    
    return params.Item;


});
