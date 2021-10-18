import StorageStack from "./StorageStack";
import PlaceStack from "./PlaceStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  const storageStack = new StorageStack(app, "storage");

  const placeStack = new PlaceStack(app, "api", {
    table: storageStack.placeTable,
  });

  new AuthStack(app, "auth", {
    api: placeStack.api
  });
}