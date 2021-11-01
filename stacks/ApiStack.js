import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { placeTable, roomTable, deviceTable } = props;
    this.api = new sst.Api(this, "api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: { 
          PLACE_TABLE: placeTable.tableName, 
          ROOM_TABLE: roomTable.tableName,
          DEVICE_TABLE: deviceTable.tableName},
      },
      cors: true,
    });

    //PLACES ROUTES
    this.api.addRoutes(this, {
      "POST   /places": "src/places/create.main",
      "GET    /places/{id}": "src/places/get.main",
      "GET    /places": "src/places/list.main",
      "PUT    /places/{id}": "src/places/update.main",
      "DELETE /places/{id}": "src/places/delete.main",
    });

    //ROOMS ROUTES
    this.api.addRoutes(this, {
      "POST   /rooms": "src/rooms/create.main",
      "GET    /rooms/{id}": "src/rooms/get.main",
      "GET    /rooms": "src/rooms/list.main",
      "PUT    /rooms/{id}": "src/rooms/update.main",
      "DELETE /rooms/{id}": "src/rooms/delete.main",
      "PUT    /rooms/{roomId}/assign/{placeId}": "src/rooms/assign.main"
    });

    //DEVICES ROUTES
    this.api.addRoutes(this, {
      "POST   /devices": "src/devices/create.main",
      // "GET    /devices/{id}": "src/devices/get.main",
      // "GET    /devices": "src/devices/list.main",
      // "PUT    /devices/{id}": "src/devices/update.main",
      // "DELETE /devices/{id}": "src/devices/delete.main",
    });

    // Allow the API to access the table
    this.api.attachPermissions([placeTable]);

    this.api.attachPermissions([roomTable]);

    this.api.attachPermissions([deviceTable]);

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}