import handler from "../util/handler";
import getPlaceId from "./repository/getPlaceId";

export const main = handler(async (event) => {
  const placeId = event.pathParameters.id
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  return await getPlaceId(userId, placeId);
});