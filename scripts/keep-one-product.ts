import { prisma } from "@/lib/prisma";

async function main() {
  const requestedId = process.env.KEEP_PRODUCT_ID?.trim();

  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
    select: { id: true, name: true, code: true, status: true, featured: true, createdAt: true },
  });

  if (products.length <= 1) {
    console.log(`Products found: ${products.length}. Nothing to delete.`);
    return;
  }

  const keep = requestedId
    ? products.find((product) => product.id === requestedId)
    : products.find((product) => product.status === "active") || products[0];

  if (!keep) {
    throw new Error(`KEEP_PRODUCT_ID was not found: ${requestedId}`);
  }

  const idsToDelete = products
    .filter((product) => product.id !== keep.id)
    .map((product) => product.id);

  console.log(`Keeping: ${keep.name} (${keep.id})`);
  console.log(`Status: ${keep.status}, Featured: ${keep.featured}`);
  console.log(`Deleting ${idsToDelete.length} old product(s)...`);

  const result = await prisma.product.deleteMany({
    where: { id: { in: idsToDelete } },
  });

  console.log(`Deleted: ${result.count}`);
  console.log("One product remains and it is active when an active product existed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
