const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshallItem, unmarshallItem } = require('../common/dynamodb-utils');

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
  }
};

const dynamodbClient = new DynamoDBClient(dynamoDBClientParams);

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const likeUser = async (event, context) => {
  console.log('event: ', event);
  const body = event.Records[0].body;
  const userId = JSON.parse(body).id;
  console.log('userId: ', userId);

  const input = {
    TableName: 'usersTable',
    Key: marshallItem({ pk: userId }),
    UpdateExpression: 'ADD likes :inc',
    ExpressionAttributeValues: marshallItem({
      ':inc': 1
    }),
    ReturnValues: 'ALL_NEW'
  };
  const command = new UpdateItemCommand(input);

  const response = await dynamodbClient.send(command);
  await sleep(4000);
  console.log('dynamodb response: ', response)
};

module.exports = {
  likeUser
};
