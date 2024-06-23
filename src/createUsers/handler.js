const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { randomUUID } = require('crypto');
const { marshallItem, unmarshallItem } = require('../common/dynamodb-utils');

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamodbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
  }
};

const dynamodbClient = new DynamoDBClient(dynamoDBClientParams);

const createUsers = async (event, context) => {
  console.log('event: ', event);

  const userId = randomUUID();
  const userBody = JSON.parse(event.body);
  userBody.pk = userId;
  
  const input = {
    TableName: 'usersTable',
    Item: marshallItem(userBody)
  };
  const command = new PutItemCommand(input);

  const response = await dynamodbClient.send(command);
  console.log('response: ', response);
  
  return {
    'statusCode': 200,
    'body': JSON.stringify({ 'user': unmarshallItem(input.Item) })
  };
};

module.exports = {
  createUsers
};
