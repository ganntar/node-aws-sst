import StorageStack from "./StorageStack";
import ApiStack from "./ApiStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  const storageStack = new StorageStack(app, "storage");

  const apiStack = new ApiStack(app, "Api", {
    placeTable: storageStack.placeTable,
    roomTable: storageStack.roomTable,
    deviceTable: storageStack.deviceTable,
    registrationTable: storageStack.registrationTable,
  });
  
  new AuthStack(app, "auth", {
    api: apiStack.api,
    place: apiStack.api,
    room: apiStack.api,
    registration: apiStack.api
  });
}