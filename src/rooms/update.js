import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import getRoomId from "./repository/getRoomId";
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

  if (name === oldRoom.Item.name && picture === oldRoom.Item.picture) {
    throw new Error("No registry modification found");
  }

  const roomsWithSameName = await this._roomRepository.getRoomsByName(userId, oldRoom.Item.placeId, formatedRoomName, oldRoom.Item.roomId);

  if (roomsWithSameName.length > 0) {
    throw new Error("Name is already in use.");
  }

  const updateItem = {
    ...oldRoom.Item,
    name: formatedRoomName,
    picture,
    updatedAt: moment().utc().format()
  }
  

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: userId,
      roomId: roomId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return params.Item;
})