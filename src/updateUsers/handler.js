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

const updateUsers = async (event, context) => {
  console.log('event: ', event);

  const userId = event.pathParameters.id;
  const userBody = JSON.parse(event.body);
  
  const input = {
    TableName: 'usersTable',
    Key: marshallItem({ pk: userId }),
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: marshallItem({
      ':name': userBody.name
    }),
    ReturnValues: 'ALL_NEW'
  };
  const command = new UpdateItemCommand(input);

  const response = await dynamodbClient.send(command);
  console.log('response: ', response);
  
  return {
    'statusCode': 200,
    'body': JSON.stringify({ 'user': unmarshallItem(response.Attributes) })
  };
};

module.exports = {
  updateUsers
};
