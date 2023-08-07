import s3 from "../.././../shared/services/s3.js";

export const getS3PresignedUrl = async (req, res) => {
  let data;
  const { fileName = "" } = req.query;
  const expirationInSeconds = 120;
  if (!fileName) {
    return sendResponse(res, 200, "success", data);
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: "image/*",
    Expires: expirationInSeconds,
  };

  const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);

  if (!preSignedUrl) {
    data = {
      err: "Something Went Wrong",
      headers: {
        "access-control-allow-origin": "*",
      },
      body: "error occured",
    };
    return sendResponse(res, 500, "Failed", data);
  }

  data = {
    statusCode: 200,
    headers: {
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify({
      signedUrl: preSignedUrl,
    }),
  };

  return sendResponse(res, 200, "Success", data);
};
