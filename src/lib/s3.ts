/**
 * AWS S3 integration for image uploads
 * 
 * To use AWS S3:
 * 1. Create an S3 bucket
 * 2. Set up IAM user with S3 permissions
 * 3. Add to .env:
 *    AWS_ACCESS_KEY_ID=your_access_key
 *    AWS_SECRET_ACCESS_KEY=your_secret_key
 *    AWS_REGION=your_region
 *    AWS_S3_BUCKET=your_bucket_name
 * 4. Install: npm install @aws-sdk/client-s3
 */

interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

export function getS3Config(): S3Config | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    return null;
  }

  return { accessKeyId, secretAccessKey, region, bucket };
}

/**
 * Upload image to S3
 * Returns the public URL of the uploaded image
 */
export async function uploadToS3(
  file: Buffer,
  filename: string,
  folder: string = "banners"
): Promise<string> {
  const config = getS3Config();
  if (!config) {
    throw new Error("S3 configuration not found");
  }

  // Dynamic import to avoid bundling in client
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const key = `${folder}/${Date.now()}-${filename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: file,
      ContentType: "image/jpeg", // Adjust based on file type
      ACL: "public-read", // Make file publicly accessible
    })
  );

  // Return public URL
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

/**
 * Delete image from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  const config = getS3Config();
  if (!config) {
    throw new Error("S3 configuration not found");
  }

  const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");

  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  );
}

