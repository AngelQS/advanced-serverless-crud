const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
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

const getUsers = async (event, context) => {
  console.log('event: ', event);
  const userId = event.pathParameters.id;
  
  const input = {
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: marshallItem({ ':pk': userId }),
    TableName: 'usersTable'
  };
  const command = new QueryCommand(input);

  const response = await dynamodbClient.send(command);
  console.log('response: ', response);
  const item = response.Items.length > 0 ? unmarshallItem(response.Items[0]) : [];
  
  return {
    'statusCode': 200,
    'body': JSON.stringify({ 'user': item })
  };
};

module.exports = {
  getUsers
};
