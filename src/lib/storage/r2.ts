import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.R2_BUCKET_NAME || 'software-directory-media';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || 'https://aa0ff809b2c36cbad5b1971c6d48f6ba.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}

/**
 * Uploads a file buffer to Cloudflare R2
 */
export async function uploadToR2({ key, body, contentType, metadata }: UploadOptions): Promise<{ key: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  await r2Client.send(command);

  // Return durable key and reference URL
  const publicUrl = `/api/media/${encodeURIComponent(key)}`;
  return { key, publicUrl };
}

/**
 * Generates a temporary signed URL for private R2 object download
 */
export async function getSignedR2Url(key: string, expiresInSeconds = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Deletes an object from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await r2Client.send(command);
}
