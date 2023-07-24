import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: "v4",
});
