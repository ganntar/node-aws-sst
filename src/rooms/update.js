import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getRoomId from "./repository/getRoomId";
import getRoomsByName from "./repository/getRoomsByName";
import moment from "moment";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const roomId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const oldRoom = await getRoomId(userId, roomId);

  const { name, picture } = data;

  const formatedRoomName = name.toLowerCase();

  if (!oldRoom) {
    throw new Error("Item not found.");
  }

  if (!name) {
    throw new Error("Name is required!");
  }

  if (name.length > 30 || name.length === 0) {
    throw new Error("The name must contain a maximum of 30 characters.");
  }

  if (name === oldRoom.name && picture === oldRoom.picture) {
    throw new Error("No registry modification found");
  }

  const roomsWithSameName = await getRoomsByName(userId, formatedRoomName);

  if (roomsWithSameName.length > 0) {
    throw new Error("Name is already in use.");
  }
  
  const updateItem = {
    ...oldRoom,
    name: formatedRoomName,
    picture,
    updatedAt: moment().utc().format()
  }

  const params = {
    TableName: process.env.ROOM_TABLE,
    Key: {
      userId: userId,
      roomId: roomId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return params;
})