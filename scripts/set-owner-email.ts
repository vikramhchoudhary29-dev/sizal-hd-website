import { prisma } from "@/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      'ADMIN_EMAIL is required. Example: $env:ADMIN_EMAIL="vikramhchoudhary29@gmail.com"'
    );
  }

  const owners = await prisma.admin.findMany({
    where: { role: "owner" },
    select: { uid: true, email: true, name: true, role: true, status: true },
  });

  if (owners.length !== 1) {
    throw new Error(
      `Expected exactly one Owner admin, found ${owners.length}. Update the admin records manually before using this script.`
    );
  }

  const owner = owners[0];
  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing && existing.uid !== owner.uid) {
    throw new Error(`The email ${email} already belongs to another admin.`);
  }

  const updated = await prisma.admin.update({
    where: { uid: owner.uid },
    data: {
      email,
      role: "owner",
      status: "active",
    },
  });

  console.log(`Owner email updated: ${owner.email} -> ${updated.email}`);
  console.log(`Owner role: ${updated.role}`);
  console.log("The next authenticated request will automatically link the new Firebase UID to this Owner profile.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
