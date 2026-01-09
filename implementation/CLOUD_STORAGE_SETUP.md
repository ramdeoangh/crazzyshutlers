# Cloud Storage Setup Guide

## Overview

The application supports multiple storage options for images:
1. **Local Storage** (default) - Files stored in `/public/uploads/`
2. **Cloudinary** - Cloud-based image management
3. **AWS S3** - Amazon S3 storage

## Local Storage (Default)

No configuration needed. Files are stored in `public/uploads/` directory.

**Pros:**
- Simple setup
- No additional costs
- Works immediately

**Cons:**
- Not scalable for production
- Files included in deployment
- No CDN benefits

## Cloudinary Setup

### 1. Sign Up
1. Go to https://cloudinary.com
2. Create a free account
3. Get your credentials from the dashboard

### 2. Install Package
```bash
npm install cloudinary
```

### 3. Configure Environment Variables
Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Update next.config.mjs
The configuration already includes Cloudinary domain. No changes needed.

**Pros:**
- Automatic image optimization
- CDN delivery
- Image transformations
- Free tier available

**Cons:**
- Requires account setup
- Costs for high usage

## AWS S3 Setup

### 1. Create S3 Bucket
1. Go to AWS Console → S3
2. Create a new bucket
3. Enable public read access (or use CloudFront)
4. Configure CORS if needed

### 2. Create IAM User
1. Go to IAM → Users
2. Create user with programmatic access
3. Attach policy: `AmazonS3FullAccess` (or custom policy)
4. Save Access Key ID and Secret Access Key

### 3. Install Package
```bash
npm install @aws-sdk/client-s3
```

### 4. Configure Environment Variables
Add to `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 5. Update next.config.mjs
Add your S3 domain to `remotePatterns`:
```javascript
remotePatterns: [
  {
    protocol: "https",
    hostname: "your-bucket.s3.your-region.amazonaws.com",
  },
]
```

**Pros:**
- Highly scalable
- Low cost
- Full control
- Can use CloudFront CDN

**Cons:**
- More complex setup
- Requires AWS account
- Manual image optimization

## Priority Order

The upload endpoint tries storage providers in this order:
1. **Cloudinary** (if configured)
2. **AWS S3** (if configured)
3. **Local Storage** (fallback)

## Testing

### Test Local Storage
```bash
# Just upload a file - it will use local storage by default
```

### Test Cloudinary
```bash
# Add Cloudinary env vars
# Upload a file - it should use Cloudinary
```

### Test S3
```bash
# Add S3 env vars
# Upload a file - it should use S3
```

## Migration

### From Local to Cloudinary
1. Set up Cloudinary account
2. Add environment variables
3. Re-upload images through admin panel
4. Or use Cloudinary migration script (create if needed)

### From Local to S3
1. Set up S3 bucket
2. Add environment variables
3. Upload existing files to S3
4. Update database URLs

## Production Recommendations

### For Small to Medium Sites
- **Cloudinary** - Easiest setup, automatic optimization

### For Large Sites
- **AWS S3 + CloudFront** - Better cost control, more scalable

### For Maximum Performance
- **Cloudinary** - Best image optimization and CDN

## Image Optimization

### Cloudinary
- Automatic optimization
- Responsive images
- Format conversion (WebP, AVIF)
- Configure in Cloudinary dashboard

### S3
- Use Next.js Image component (already implemented)
- Consider CloudFront for CDN
- Manual optimization before upload

### Local
- Next.js Image component handles optimization
- Consider pre-optimizing images

## Security

### Cloudinary
- Use signed URLs for private images
- Set up upload presets
- Configure upload restrictions

### S3
- Use IAM policies (least privilege)
- Enable bucket versioning
- Set up lifecycle policies
- Use CloudFront signed URLs for private images

## Cost Considerations

### Cloudinary
- Free tier: 25GB storage, 25GB bandwidth/month
- Paid plans start at $89/month

### S3
- Storage: ~$0.023/GB/month
- Transfer: ~$0.09/GB (first 10TB)
- Very cost-effective for high volume

## Troubleshooting

### Cloudinary Upload Fails
- Check credentials
- Verify cloud name
- Check API key permissions

### S3 Upload Fails
- Verify IAM permissions
- Check bucket policy
- Verify region matches

### Images Not Loading
- Check CORS settings
- Verify domain in next.config.mjs
- Check image URLs in database

