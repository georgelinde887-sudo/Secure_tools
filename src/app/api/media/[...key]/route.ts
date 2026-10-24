import { NextRequest, NextResponse } from 'next/server';
import { r2Client } from '@/lib/storage/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await context.params;
    const objectKey = decodeURIComponent(key.join('/'));

    if (!objectKey) {
      return new NextResponse('Bad request', { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || 'software-directory-media';
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const response = await r2Client.send(command);
    if (!response.Body) {
      return new NextResponse('Not found', { status: 404 });
    }

    const contentType = response.ContentType || 'application/octet-stream';
    const stream = response.Body.transformToWebStream();

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(response.ContentLength ? { 'Content-Length': response.ContentLength.toString() } : {}),
      },
    });
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return new NextResponse('Media not found', { status: 404 });
    }
    return new NextResponse('Error fetching media', { status: 500 });
  }
}
