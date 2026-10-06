# Neon + Prisma setup

The application now uses **Neon PostgreSQL + Prisma** as its application database. Firebase remains only for Authentication and Storage.

## 1. Environment variables

Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `DIRECT_URL` plus the existing Firebase variables. Use the Neon pooled URL for `DATABASE_URL` and the direct Neon URL for `DIRECT_URL`.

## 2. Install dependencies

```bash
npm install
```

## 3. Generate Prisma Client

```bash
npm run db:generate
```

## 4. Create the Neon schema

For a new database:

```bash
npm run db:push
```

For a development migration workflow:

```bash
npm run db:migrate
```

## 5. Migrate existing Firestore data

Do this **only after the Neon schema exists** and while the Firebase Admin environment variables still point at the current Firebase project:

```bash
npm run db:migrate-firestore
```

The script copies products, categories, dealers, downloads, gallery, blogs, website settings, admin profiles and activity logs. Firebase Authentication users are not recreated because their existing Firebase UIDs remain the source of authentication identity.

## 6. Production

Set `DATABASE_URL` in Vercel to the Neon connection string, run the Prisma generate step during install/build, and deploy.

Firebase remains required for admin login and Firebase Storage/Cloudinary media that the current UI already uses.

## 7. Keep one migrated product for testing

If the migration imported several old products and you want to keep only one for testing:

```bash
npm run db:keep-one-product
```

By default the script keeps the oldest product and deletes the other Product records.
To keep a specific product instead:

```powershell
$env:KEEP_PRODUCT_ID="YOUR_PRODUCT_ID"
npm run db:keep-one-product
```

The script only changes the `Product` table.

## 8. Production health check

After deploying, open `/api/health`. A healthy response looks like:

```json
{
  "ok": true,
  "database": "connected",
  "activeProducts": 1
}
```

## 9. Link the real Firebase owner email

If the old migrated Owner record still contains the deleted test email, update it with:

```powershell
$env:ADMIN_EMAIL="vikramhchoudhary29@gmail.com"
npm run db:set-owner-email
```

The application will then match the verified Firebase email and automatically replace the old migrated Firebase UID with the new Firebase UID on the first protected admin request.
