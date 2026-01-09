/**
 * Cloudinary integration for image uploads
 * 
 * To use Cloudinary:
 * 1. Sign up at https://cloudinary.com
 * 2. Get your cloud name, API key, and API secret
 * 3. Add to .env:
 *    CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 * 4. Install: npm install cloudinary
 */

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Upload image to Cloudinary
 * Returns the secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  file: Buffer,
  filename: string,
  folder: string = "banners"
): Promise<{ url: string; publicId: string }> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary configuration not found");
  }

  // Dynamic import to avoid bundling in client
  const cloudinary = await import("cloudinary").then((m) => m.v2);

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
        overwrite: false,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );

    uploadStream.end(file);
  });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary configuration not found");
  }

  const cloudinary = await import("cloudinary").then((m) => m.v2);

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });

  await cloudinary.uploader.destroy(publicId);
}

