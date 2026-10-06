# Sizal HD Gallery Final Fixes

This source package keeps Firebase Authentication/Admin for admin access and uses Cloudinary for gallery media uploads. Firebase Storage is not used by the gallery uploader.

## Fixed

1. Removed the React state-update-during-render bug in `CloudinaryMultiUpload`.
2. Gallery upload state is now synchronized with the parent immediately after a successful upload batch.
3. Removing an uploaded file also synchronizes the parent state immediately.
4. Gallery save no longer incorrectly reports `Please choose at least one image or video` after a successful Cloudinary upload.
5. Added `/admin` -> `/admin/dashboard` redirect.
6. Gallery category select is controlled, so the first category still becomes selected after categories load asynchronously.
7. Hardened the gallery two-column layout with `min-w-0`, `max-w-full`, `w-full`, and overflow protection.
8. Hardened Cloudinary preview cards and filename controls against horizontal overflow.
9. Firebase Admin setup script now writes to `.env` because this project uses `.env`.
10. Updated the related setup documentation from `.env.local` to `.env`.

## Environment

The ZIP intentionally does NOT contain your real `.env` or Firebase service-account JSON.

Keep your existing `.env` in the project root.

Required values:

- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_ADMIN_PROJECT_ID
- FIREBASE_ADMIN_CLIENT_EMAIL
- FIREBASE_ADMIN_PRIVATE_KEY
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

## Setup

```powershell
npm install
npx prisma generate
npm run dev
```

If Firebase Admin variables are missing, run:

```powershell
node scripts/setup-firebase-admin-env.mjs "C:\path\to\your-service-account.json"
```

That command writes the Firebase Admin variables to `.env`.

After changing `.env`, completely stop the Next.js server and start it again.

Open:

- `http://localhost:3000/admin`
- `http://localhost:3000/admin/gallery`

The gallery upload goes directly to Cloudinary. The saved Cloudinary URL is stored in Neon/PostgreSQL through Prisma.
