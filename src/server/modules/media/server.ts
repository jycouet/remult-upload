import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
// @ts-ignore
import { Buffer } from "node:buffer";
import {
  S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY_SECRET,
  S3_BUCKET_NAME,
  S3_ENDPOINT,
  S3_REGION,
} from "$env/static/private";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { createRequest } from "@aws-sdk/util-create-request";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Media, MediaWithUrl } from ".";
import type { Module } from "../../api";

const getClient = () => {
  return new S3Client({
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_ACCESS_KEY_SECRET,
    },
    region: S3_REGION,
  });
};

export async function base64ToS3(key: string, data: string) {
  const s3Client = getClient();

  // new FileStorage(adapter);
  // ...
  // If local....

  // If S3 do that...

  let split = data.split(",");
  let type = split[0].substring(5).replace(";base64", "");
  const buffer = Buffer.from(split[1], "base64");
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: type,
      Body: buffer,
    })
  );
  return result;
}

export const getFromS3 = async (key: string) => {
  const s3Client = getClient();

  // const result = await s3Client.send(
  //   new GetObjectCommand({
  //     Bucket: S3_BUCKET_NAME,
  //     Key: key,
  //   })
  // );
  // console.log(`result`, result);

  const signer = new S3RequestPresigner({ ...s3Client.config });
  const writeRequest = await createRequest(
    s3Client,
    new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key })
  );
  return { url: formatUrl(await signer.presign(writeRequest)) };
};

export const deleteInS3 = async (key: string) => {
  const s3Client = getClient();

  const result = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    })
  );

  return result;
};

export const media: Module = {
  entities: [Media, MediaWithUrl],
  initApi: () => {
    Media.abstractBase64ToS3 = base64ToS3;
    Media.abstractGetFromS3 = getFromS3;
    Media.abstractDeleteInS3 = deleteInS3;
  },
};
