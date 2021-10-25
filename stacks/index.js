import PlaceStorageStack from "./storages/PlaceStorageStack";
import RoomStorageStack from "./storages/RoomStorageStack";
import PlaceStack from "./PlaceStack";
import RoomStack from "./RoomStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  const placeStorageStack = new PlaceStorageStack(app, "placeStorage");

  const placeStack = new PlaceStack(app, "placesApi", {
    table: placeStorageStack.placeTable,
  });

  const roomStorageStack = new RoomStorageStack(app, "roomStorage");

  const roomStack = new RoomStack(app, "roomsApi", {
    table: roomStorageStack.roomTable,
  });
  
  new AuthStack(app, "auth", {
    place: placeStack.api,
    room: roomStack.api,
  });
}