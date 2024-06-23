const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ signatureVersion: 'v4' });

const signedS3URL = async (event, context) => {
  console.log('event: ', event);
  const filename = event.queryStringParameters.filename;

  const input = {
    Bucket: process.env.BUCKET,
    Key: `upload/${filename}`
  };
  const command = new PutObjectCommand(input);

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return {
    'statusCode': 200,
    'body': JSON.stringify({ signedUrl })
  };
};

module.exports = {
  signedS3URL
};
