import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@zimdesigns/env/server";
import { randomUUID } from "crypto";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type || "image/jpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );

  return `${env.R2_PUBLIC_URL}/${key}`;
}
