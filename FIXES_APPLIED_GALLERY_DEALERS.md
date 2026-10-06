# Sizal HD – Gallery, Dealers & Firebase Admin Fixes

## Gallery
- Admin gallery now uses Cloudinary for direct image/video uploads.
- Multiple images and videos can be selected in one batch.
- Mixed image/video previews are shown before saving.
- Fixed the `Cannot read properties of null (reading 'reset')` save error.
- Gallery remains album/category based.
- Public gallery keeps album navigation and responsive masonry media.
- Public media uses non-cropping display for mixed image/video aspect ratios.

## Dealers
- Public dealer registration is shorter and grouped into basic, business and location sections.
- Optional business details are collapsed instead of making the form very long.
- Admin add/edit dealer form is grouped into compact sections with optional details collapsed.
- Admin dealer list includes direct Call, WhatsApp and Email actions where available.
- Existing View/Edit/Delete/status workflow is preserved.

## Settings
- Gallery hero fields are included in the Prisma `WebsiteSettings` model.
- Existing company phone / WhatsApp settings remain the source of truth for the public contact/about areas.

## Firebase Admin
- Added `scripts/setup-firebase-admin-env.mjs`.
- The script reads the service-account JSON and writes the three Firebase Admin variables to `.env`, including the escaped private key.
- It does not copy or include any service-account JSON in this project.

## After extracting the project

1. Put your Firebase service-account JSON in the project root.
2. Run:
   `node scripts/setup-firebase-admin-env.mjs "sizal-hd-website-firebase-adminsdk-fbsvc-95d6067428 (1).json"`
3. Make sure `.env` has:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
4. Make sure `.env` / `.env` has your existing Neon and Cloudinary values.
5. Install dependencies:
   `npm install`
6. Generate Prisma:
   `npx prisma generate`
7. Apply the new WebsiteSettings columns:
   `npx prisma db push`
8. Start:
   `npm run dev`

The Cloudinary gallery requires:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

Do not commit `.env`, `.env`, Firebase service-account JSON, or any private key.
