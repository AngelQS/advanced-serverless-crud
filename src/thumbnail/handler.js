const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const util = require('util');
const sharp = require('sharp');
const s3Client = new S3Client();

const thumbnailGenerator = async (event, context) => {
  console.log('Reading options from event:\n', util.inspect(event, { depth: 5 }));
  const srcBucket = event.Records[0].s3.bucket.name;
  console.log(event.Records[0].s3.object);
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  console.log(srcKey);

  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log('Could not determine the image type');
    return;
  };

  const imageType = typeMatch[1].toLocaleLowerCase();
  if (imageType != 'jpg' && imageType != 'png') {
    console.log(`Unsupported image type: ${imageType}`);
    return;
  };

  let originalImage = null;
  let objectBuffer = null;
  try {
    const input = {
      Bucket: srcBucket,
      Key: srcKey
    };
    const command = new GetObjectCommand(input);

    const response = await s3Client.send(command);
    originalImage = response;
    objectBuffer = await streamToBuffer(response.Body);
  } catch (error) {
    console.log(error);
    return;
  };

  const widths = [50, 100, 200];
  for (const w of widths) {
    await resizer(objectBuffer, w, srcBucket, srcKey);
  };
};

const resizer = async (imgBody, newSize, dstBucket, fileKey) => {
  const nameFile = fileKey.split('/')[1];
  const dstKey = `resized/${newSize}-${nameFile}`;

  let buffer = null;
  try {
    buffer = await sharp(imgBody).resize(newSize).toBuffer();
  } catch (error) {
    console.log(error);
    return;
  };

  try {
    const input = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: buffer,
      ContentType: 'image'
    };
    const command = new PutObjectCommand(input);

    await s3Client.send(command);
  } catch (error) {
    console.log(error);
    return;
  };

  console.log(`Successfully resized ${dstBucket}/${fileKey} and uploaded to ${dstBucket}/${dstKey}`)
};

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
  });
}

module.exports = {
  thumbnailGenerator
};
