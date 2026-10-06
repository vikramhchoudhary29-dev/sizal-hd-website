# Sizal HD Website – Final Setup & Gallery Fix

## 1. Install dependencies

```powershell
npm install
npx prisma generate
```

## 2. Configure Firebase Admin

The project does **not** include the Firebase service-account JSON or `.env`. Keep those private.

If the service-account JSON is in your Downloads folder, run the setup script with its full path, for example:

```powershell
node scripts/setup-firebase-admin-env.mjs "C:\Users\vikra\Downloads\sizal-hd-website-firebase-adminsdk-fbsvc-95d6067428 (1).json"
```

Or, if the JSON is inside the project folder:

```powershell
node scripts/setup-firebase-admin-env.mjs "sizal-hd-website-firebase-adminsdk-fbsvc-95d6067428 (1).json"
```

The script writes these server-only variables to `.env`:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Then **restart Next.js**.

## 3. Configure Neon + Firebase client + Cloudinary

Create/update `.env` with your existing project values. At minimum, the gallery upload needs:

```env
DATABASE_URL="your-neon-pooled-connection"
DIRECT_URL="your-neon-direct-connection"

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID="sizal-hd-website"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-upload-preset"
```

The gallery uses **Cloudinary**, not Firebase Storage, for image/video uploads. Do not put a Cloudinary API secret in `NEXT_PUBLIC_*` variables.

## 4. Apply the Prisma schema

```powershell
npx prisma db push
npx prisma generate
```

## 5. Start the app

```powershell
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/gallery`
- `http://localhost:3000/admin/gallery`

## Gallery save fix

The admin gallery save form now keeps a stable form ref and resets through that ref after the awaited API requests. This avoids the React `Cannot read properties of null (reading 'reset')` error.

The Cloudinary multi-upload component also validates its Cloudinary configuration at upload time and supports mixed image/video batches.

## Important

Never commit or upload these files:

- `.env`
- `.env`
- Firebase service-account JSON files
- private keys / API secrets
