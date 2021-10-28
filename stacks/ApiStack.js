import * as sst from "@serverless-stack/resources";

export default class PlaceStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { placeTable, roomTable } = props;

    this.api = new sst.Api(this, "api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: { 
          PLACE_TABLE: placeTable.tableName, 
          ROOM_TABLE: roomTable.tableName },
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

    // Allow the API to access the table
    this.api.attachPermissions([placeTable]);

    this.api.attachPermissions([roomTable]);

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}