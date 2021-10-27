import dynamoDb from "../../util/dynamodb";
import moment from "moment";
import getRoomsFromPlace from "./getRoomsFromPlace";

export default async function putRoomFromPlaceId(userId, placeId) {
  const updatedAt = moment().utc().format();

  const rooms = await getRoomsFromPlace(userId, placeId);

  for (let index = 0; index < rooms.Items.length; index++) {
    const room = rooms.Items[index];
    const roomId = room.roomId

    const roomsParams = {
      TableName: process.env.ROOM_TABLE,
      Key: {
        userId,
        roomId,
      },
      Item: {
        ...room,
        placeId: "none",
        status: "deleted",
        updatedAt
      }
    };
  
    await dynamoDb.put(roomsParams);
  }

  return { status: true };
}