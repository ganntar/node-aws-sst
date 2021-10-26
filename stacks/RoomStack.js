import * as sst from "@serverless-stack/resources";

export default class RoomStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    this.api = new sst.Api(this, "roomsApi", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: { TABLE_NAME: table.tableName },
      },
      cors: true,
      routes: {
        "POST   /rooms": "src/rooms/create.main",
        "GET    /rooms/{id}": "src/rooms/get.main",
        "GET    /rooms/list/{placeid}": "src/rooms/list.main",
        "PUT    /rooms/{id}": "src/rooms/update.main",
        "DELETE /rooms/{id}": "src/rooms/delete.main",
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