import * as sst from "@serverless-stack/resources";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export default class RoomStorageStack extends sst.Stack {
  roomTable;

  constructor(scope, id, props) {
    super(scope, id, props);

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