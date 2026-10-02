# Sizal HD Product Excel Import

The admin Products page now has **Download Template** and **Import Excel**.

## Sheet 1: Products

Use one row per product.

| Excel column | Required | Purpose |
|---|---|---|
| Name | Yes | Public product name |
| Code | Yes | Product code used to match table rows |
| Category | No | Product category |
| Short Description | No | Short product description |
| Full Description | No | Main product description |
| Lens Index | No | Main lens index |
| Coating | No | Main coating |
| Image URL | No | Cloudinary image URL |
| Cover Image URL | No | Cloudinary cover image URL |
| Video URL | No | Cloudinary video URL |
| PDF URL | No | Cloudinary PDF URL |
| Status | No | `active` or `draft` |
| Featured | No | `true` / `false` |
| SEO Title | No | SEO title |
| SEO Description | No | SEO description |

## Sheet 2: Product Table

Use as many rows as needed for each product. Match every row to a product using **Product Code**.

| Excel column | Required | Purpose |
|---|---|---|
| Product Code | Yes | Must match `Code` in Products |
| Index | No | Table Index value, e.g. `1.56` |
| Product Name | No | Name shown in the table row |
| Dia (mm) | No | Diameter value, e.g. `75/65` |
| Coating Colour | No | Coating colour, e.g. `Magenta` |
| Description | No | **Description replaces Power Range** |
| Display Order | No | Optional numeric row order |

## Important

- Product images/videos/PDFs should be uploaded to Cloudinary from the normal product form.
- Excel import accepts Cloudinary URLs if you already have them.
- Importing a product with an existing Code updates that product.
- Importing table rows replaces the existing table rows for that product.
- The public product page displays the Product Information table below the product hero.
- Material and Technology are no longer product fields.
