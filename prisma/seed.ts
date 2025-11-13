import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoUserId = 'b635f618-1e49-4499-b45a-8e96f1813a71';

  await prisma.product.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Product ${i + 1}`,
      price: (Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStockAt: 5,
      description: `Description for product ${i + 1}`,
      userId: demoUserId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
  });

  console.log('Seed data created successfully!');
  console.log(`Created 10 products for user ID: ${demoUserId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
