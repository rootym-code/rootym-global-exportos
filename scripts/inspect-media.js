const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      fileName: true,
      storedFileName: true,
      fileUrl: true,
      storageProvider: true,
      mediaType: true,
      folder: true,
      isDeleted: true,
      fileSize: true,
    },
  });

  console.table(media);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
