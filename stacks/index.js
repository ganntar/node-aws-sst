import StorageStack from "./StorageStack";
import PlaceStack from "./PlaceStack";
import RoomStack from "./RoomStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  const storageStack = new StorageStack(app, "storage");

  const placeStack = new PlaceStack(app, "placesApi", {
    table: storageStack.placeTable,
    roomTable: storageStack.roomTable,
  });

  const roomStack = new RoomStack(app, "roomsApi", {
    table: storageStack.roomTable,
  });
  
  new AuthStack(app, "auth", {
    place: placeStack.api,
    room: roomStack.api,
  });
}