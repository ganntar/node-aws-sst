import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import deviceFunction from './repository/deviceFunctions';

import { v4 as uuidv4 } from "uuid";
import moment from "moment";



export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const deviceId = event.pathParameters.id;
  const {placeId} = event.body;

  const itemAccess = await deviceFunction.getDevicesAccess(userId, placeId)
  if (itemAccess === undefined) {
    const id = uuidv4();
    const item = {
      id,
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
      userId: userId,
      deviceId,
      placeId,
    }

    const params = {
      TableName: process.env.DEVICE_TABLE,
      Item: item,
    }

    await dynamoDb.put(params);
    return params.Item;

  } else {
    itemAccess.updatedAt = moment().utc().format()

    const params = {
      TableName: process.env.DEVICE_TABLE,
      Key: {
        deviceId: deviceId,
        userId: userId,
      },
      UpdateExpression: 'set updatedAt = :updatedAt',
      ExpressionAttributeValues: { ':updatedAt': moment().utc().format() },
    }
    
    await dynamoDb.put(params);
    return params.Item;
  }

});
