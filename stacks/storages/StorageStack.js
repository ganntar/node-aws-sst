import * as sst from "@serverless-stack/resources";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export default class StorageStack extends sst.Stack {
  placeTable;
  roomTable;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.placeTable = new sst.Table(this, 'PlacesTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      fields: {
        userId: sst.TableFieldType.STRING,
        placeId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "placeId" },
      globalIndexes: {
        userIdIndex: { partitionKey: "userId" },
      },
    });

    this.roomTable = new sst.Table(this, 'RoomsTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      fields: {
        roomId: sst.TableFieldType.STRING,
        userId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "roomId" },
    });
  }
}