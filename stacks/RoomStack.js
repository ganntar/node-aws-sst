import * as sst from "@serverless-stack/resources";

export default class RoomStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    this.api = new sst.Api(this, "roomApi", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: { TABLE_NAME: table.tableName },
      },
      cors: true,
      routes: {
        "POST   /rooms": "src/rooms/create.main",
        "GET    /rooms/{id}": "src/rooms/get.main",
        "GET    /rooms/list/{placeid}": "src/rooms/list.main",
        // "PUT    /places/{id}": "src/places/update.main",
        // "DELETE /places/{id}": "src/places/delete.main",
      },
    });

    // Allow the API to access the table
    this.api.attachPermissions([table]);

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}