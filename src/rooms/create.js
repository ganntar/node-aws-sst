import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  console.log(data);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const roomId = uuidv4();
  const { name, picture } = data;
  const placeId = data.placeId ? data.placeId : "none";
  const status = "";
  const formatedRoomName = name.toLowerCase();

  try {
    // const roomsWithSameName = await this._roomRepository.getRoomsByName(userId, placeId, formatedRoomName);

    // if (name.length > 30 || name.length === 0) {
    //   return Promise.reject({
    //     code: 500,
    //     error: 'RoomValidationError',
    //     message: `The name must contain a maximum of 30 characters.`
    //   });
    // }

    // if (roomsWithSameName.length > 0) {

    //   return Promise.reject({
    //     code: 500,
    //     error: 'RoomDuplicatedName',
    //     message: `Name is already in use.`
    //   });
    // }
  
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        name: formatedRoomName,
        picture,
        placeId,
        userId,
        roomId,
        status,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format(),
      },
    };

    await dynamoDb.put(params);
    
    return params.Item;

  } catch (err) {
    //Logger.error(Logger.levels.INFO, err);

    return Promise.reject({
      code: 500,
      error: `RoomCreateFailure`,
      message: `The room "${data.name ? data.name : ""}" for user "${userId
        }" failed to create.`,
    });
  }
});
