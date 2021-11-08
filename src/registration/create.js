import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import moment from "moment";
import registrationRepository from './repository/registrationRepository';
import deviceModelRepository from './repository/deviceModelRepository'

export const main = handler(async (event) => {
  const { deviceId, manufacturer, orderNumber, serialNumber, modelNumber, roomId, placeId, deviceName } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const regex = / /g;
  const deviceNameParse = deviceName.replace(regex, `_`);

  if (deviceNameParse.length > 90 || deviceNameParse.length === 0) {
    return { statusCode: 500, error: "RegistrationValidationError", message: `The name must contain a maximum of 90 characters.` };
  }

  const device = await registrationRepository.findByDevice(deviceId);
  
  const registration = {
    deviceId,
    manufacturer,
    deviceName: deviceNameParse,
    metadata: {
      protocol: device ? device.metadata.protocol : '',
      orderNumber,
      serialNumber,
    },
    version: device.version,
    latestVersion: device.latestVersion,
    updateDevice: device.updateDevice,
    modelNumber: device.modelNumber,
    userId,
    placeId,
    roomId,
    status: `created`,
    createdAt: device.createdAt,
    updatedAt: moment().utc().format('hh:mm:ss'),
  };

  const params = {
    TableName: process.env.REGISTRATION_TABLE,
    Item: registration
  };

  await dynamoDb.put(params);

  if(serialNumber && modelNumber){
      const deviceModel = await deviceModelRepository.getByModelAndSerial(modelNumber, serialNumber);
      await deviceModelRepository.updateDeviceNameByModelAndSerial(deviceModel, deviceId);
  } else {
    return { 
      statusCode: 400, 
      error: "updateDeviceNameByModelAndSerialValidationError", 
      message: `something` };
  }

  
  
  return { message: true };
});