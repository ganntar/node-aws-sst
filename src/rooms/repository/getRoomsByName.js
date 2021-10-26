import dynamoDb from "../util/dynamodb";

export default async function getPlaceByName(userId, placeId, searchName, oldRoomId=false) {
  const KeyConditionExpression = "userId = :uid";
  let FilterExpression = "#rooms_status <> :sts and #room_name = :roomName";

  const ExpressionAttributeNames = {
    "#rooms_status": "status",
    "#room_name": "name"
  };

  const ExpressionAttributeValues = {
    ":uid": userId,
    ":sts": "deleted",
    ":roomName": searchName,
  };

  if (placeId) {
    FilterExpression += " AND #placeId = :placeId";
    ExpressionAttributeNames["#placeId"] = "placeId";
    ExpressionAttributeValues[":placeId"] = placeId;
  }

  if (oldRoomId){
    FilterExpression += " AND #roomId <> :roomId";
    ExpressionAttributeNames["#roomId"] = "roomId";
    ExpressionAttributeValues[":roomId"] = oldRoomId;
  }

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        KeyConditionExpression,
        FilterExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
      },
    };

    const result = await dynamoDb.get(params);

    if (!result.Item) {
      return { statusCode: 400, message: 'Item not found' };
    }

    return result.Item;
}
