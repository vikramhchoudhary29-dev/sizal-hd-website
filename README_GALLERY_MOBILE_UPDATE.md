# Sizal HD – Gallery + Mobile Update

## What changed

- Fully responsive public navigation with Gallery link and no Technology nav item.
- Responsive admin sidebar drawer for phones/tablets.
- Gallery now supports direct Firebase Storage uploads from the computer.
- Bulk gallery upload supports a mixed selection of images and videos.
- Gallery categories are database-backed and can be created/deleted from Admin → Gallery.
- Public gallery displays categories as album cards.
- Public gallery uses responsive media sizing and a full-screen media viewer.
- Gallery hero content is editable from Admin → Settings → Gallery Hero.
- Homepage About section now reads the company phone from Website Settings instead of hard-coding it.
- Public Contact page reads company contact details from Website Settings.
- Contact enquiry opens the configured WhatsApp destination with the form details pre-filled.
- Footer contact details are also synced from Website Settings.
- Added responsive foundations for small phones, tablets and desktop.

## Database update

After installing dependencies, run:

```powershell
npx prisma generate
npx prisma db push
```

The schema adds:

- `GalleryCategory`
- `GalleryItem.categoryId`
- `WebsiteSettings.galleryHeroTitle`
- `WebsiteSettings.galleryHeroHighlight`
- `WebsiteSettings.galleryHeroSubtitle`

Existing gallery items are preserved. Legacy items that only have the old text `category` continue to display correctly.

## Firebase

Gallery files are uploaded directly from the browser to Firebase Storage. The existing storage rule allows authenticated uploads up to 100 MB, matching the gallery uploader's video limit.

Keep Firebase Admin credentials only in `.env`; never commit the service-account JSON or `.env`.

## Run locally

```powershell
npm install
npx prisma generate
npx prisma db push
npm run dev
```
