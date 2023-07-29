import S3 from "aws-sdk/clients/s3";
import Pusher from "pusher";

export const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: "v4",
});

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_APP_CLUSTER!,
});
