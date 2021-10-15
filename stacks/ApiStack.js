import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  // Public reference to the API
  api;



  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    // Create the API
    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      cors: true,
      routes: {
        "POST   /places": "src/places/create.main",
        "GET    /places/{id}": "src/places/get.main",
        "GET    /places": "src/places/list.main",
        "PUT    /places/{id}": "src/places/update.main",
        "DELETE /places/{id}": "src/places/delete.main",
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