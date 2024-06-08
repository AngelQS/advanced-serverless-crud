const AWS = require('aws-sdk');

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamodbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
  }
};

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDBClientParams);

const getUsers = async (event, context) => {
  console.log('event: ', event);
  const userId = event.pathParameters.id;
  
  const params = {
    ExpressionAttributeValues: { ':pk': userId },
    KeyConditionExpression: 'pk = :pk',
    TableName: 'usersTable'
  };

  const result = await dynamodb.query(params).promise();
  console.log('result: ', result);
  
  return {
    "statusCode": 200,
    "body": JSON.stringify({ 'user': result })
  };
};

module.exports = {
  getUsers
};
