import "dotenv/config";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env"
    );
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("");
    console.log("========================================");
    console.log("Admin already exists.");
    console.log("========================================");
    console.log(`Name  : ${existingAdmin.name}`);
    console.log(`Email : ${existingAdmin.email}`);
    console.log("");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  console.log("");
  console.log("========================================");
  console.log("Admin created successfully.");
  console.log("========================================");
  console.log(`ID       : ${admin.id}`);
  console.log(`Name     : ${admin.name}`);
  console.log(`Email    : ${admin.email}`);
  console.log("");
  console.log("Login Credentials");
  console.log("----------------------------------------");
  console.log(`Email    : ${email}`);
  console.log(`Password : ${password}`);
  console.log("========================================");
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });