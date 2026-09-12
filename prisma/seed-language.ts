/**
 * ============================================================
 * ROOTYM Global ExportOS
 * Author: Prem Singh
 * Purpose: Initialize the platform default Language master data.
 * ============================================================
 */

import prisma from "../lib/prisma";

async function main() {
  // Ensure only English remains the active default language.
  await prisma.language.updateMany({
    where: {
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });

  const language = await prisma.language.upsert({
    where: {
      code: "en",
    },
    update: {
      name: "English",
      nativeName: "English",
      isDefault: true,
      isActive: true,
      sortOrder: 1,
    },
    create: {
      code: "en",
      name: "English",
      nativeName: "English",
      isDefault: true,
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log("Default language configured:", {
    id: language.id,
    code: language.code,
    name: language.name,
    isDefault: language.isDefault,
    isActive: language.isActive,
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
