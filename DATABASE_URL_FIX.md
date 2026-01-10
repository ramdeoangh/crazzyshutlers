# Database URL Fix for Hostinger

## Database Connection String

Your Hostinger database connection details.

## Solution

### Your Correct DATABASE_URL:
```
DATABASE_URL="mysql://u694807547_crazzy_user:Syntiaro6202@82.180.140.4:3306/u694807547_crazzyshuttler"
```

**Note**: This password has no special characters, so no URL encoding is needed.

## How to Fix

### Option 1: Update .env file directly
Update your `.env` file with the corrected DATABASE_URL:

```env
DATABASE_URL="mysql://u694807547_crazzy_user:Syntiaro6202@82.180.140.4:3306/u694807547_crazzyshuttler"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Option 2: Common URL Encoding Reference
If your password contains other special characters, here's the encoding:

| Character | Encoded |
|-----------|---------|
| `#` | `%23` |
| `@` | `%40` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| `:` | `%3A` |
| ` ` (space) | `%20` |

## Testing the Connection

After updating your `.env` file, test the connection:

```bash
# Generate Prisma Client
npx prisma generate

# Test connection
npx prisma db push
```

## Alternative: Use Connection String Parameters

If URL encoding is problematic, you can also use connection parameters:

```env
DATABASE_URL="mysql://u694807547_crazzy_user:Syntiaro6202@82.180.140.4:3306/u694807547_crazzyshuttler?sslaccept=strict"
```

## Hostinger Database Connection Details

- **Host**: 82.180.140.4
- **Port**: 3306
- **Database**: u694807547_crazzyshuttler
- **Username**: u694807547_crazzy_user
- **Password**: Syntiaro6202

## Important Notes

1. **Never commit `.env` file** to version control
2. **Use environment variables** in production (Railway, Vercel, etc.)
3. **Test connection** after updating
4. **Keep password secure** and don't share it
