import dynamoDb from "../../util/dynamodb";

exports.updateDeviceNameByModelAndSerial = async (deviceModel, deviceId) => {

  console.log('deviceModel >>>>>', deviceModel);

  const params = {
    TableName: process.env.DEVICE_TABLE,
    Item: {
      ...deviceModel,
      deviceId,
    },
  };

  console.log('params >>>>>', params);
  
  await dynamoDb.put(params);

  return { status: true };
}

exports.getByModelAndSerial = async (modelNumber, serialNumber) => {
  const params = {
    TableName: process.env.DEVICE_TABLE,
    //IndexName: 'modelNumber-index',
    Key:{
      modelNumber,
      serialNumber
    },
  };

  console.log('getByModelAndSerial >>>>>',params)

  return await dynamoDb.get(params);
}