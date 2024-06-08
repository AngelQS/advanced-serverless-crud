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

const updateUsers = async (event, context) => {
  console.log('event: ', event);
  const userId = event.pathParameters.id;
  const userBody = JSON.parse(event.body);
  
  const params = {
    TableName: 'usersTable',
    Key: { pk: userId },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: {
      '#name': 'name' 
    },
    ExpressionAttributeValues: {
      ':name': userBody.name
    },
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamodb.update(params).promise();
  console.log('result: ', result); 
  
  return {
    "statusCode": 200,
    "body": JSON.stringify({ 'user': result.Attributes })
  };
};

module.exports = {
  updateUsers
};
