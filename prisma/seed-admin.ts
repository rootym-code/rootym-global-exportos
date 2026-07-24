import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  const password = await bcrypt.hash(
    "Rootym@2026",
    10
  );

  const admin = await prisma.admin.upsert({
    where: {
      email: "prem@rootym.in",
    },
    update: {},
    create: {
      name: "Prem Singh",
      email: "prem@rootym.in",
      password,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("Admin created:", {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });