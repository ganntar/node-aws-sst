import * as sst from "@serverless-stack/resources";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export default class StorageStack extends sst.Stack {
  // Public reference to the table
  table;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.table = new sst.Table(this, 'PlaceTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      fields: {
        userId: sst.TableFieldType.STRING,
        placeId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "placeId" },
    });
  }
}