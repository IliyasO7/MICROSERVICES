import AWS from "aws-sdk";

export const uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  const result = await s3bucket.upload(params);
  return result;
};
