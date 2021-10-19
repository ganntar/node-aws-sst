import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import moment from "moment";
import getPlaceId from "./repository/getPlaceId";

export const main = handler(async (event) => {
  const placeId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const place = await getPlaceId(userId, placeId);

  const updateItem = {
    ...place,
    status: 'deleted',
    updatedAt: moment().utc().format()
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: userId,
      placeId: placeId,
    },
    Item: updateItem
  };

  await dynamoDb.put(params);

  return { status: true };
});