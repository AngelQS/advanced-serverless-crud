const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');

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

const createUsers = async (event, context) => {
  console.log('event: ', event);

  const userId = randomUUID();
  const userBody = JSON.parse(event.body);
  userBody.pk = userId;
  
  const params = {
    TableName: 'usersTable',
    Item: userBody
  };

  console.log('params: ', params);

  const result = await dynamodb.put(params).promise();
  console.log('result: ', result);
  
  return {
    "statusCode": 200,
    "body": JSON.stringify({ 'user': params.Item })
  };
};

module.exports = {
  createUsers
};
