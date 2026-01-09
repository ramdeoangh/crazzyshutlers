/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add your image domains here (for cloud storage)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // AWS S3
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net", // CloudFront
      },
      // Add more patterns as needed
    ],
    // Allow local images
    unoptimized: false,
  },
  // Future-proofing: Enable experimental features that may be needed
  experimental: {
    // Add experimental features here as needed
  },
};

export default nextConfig;

