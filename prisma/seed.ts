import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@carelytic.com';
  const phone = '+8801850700054';
  const hashedPassword =
    '$2b$12$J2GsKofxseKTgWJxdbCaWOdagLxzwqhz9Ou.XGdhv2.rfComm.pOu'; // bcrypt hash for Password123!

  await prisma.user.upsert({
    where: { email },
    update: {
      hashedPassword,
      phone,
      name: 'Demo User',
    },
    create: {
      email,
      phone,
      name: 'Demo User',
      hashedPassword,
      isDiabetic: false,
      hasHypertension: false,
      credits: 10,
    },
  });
}

main()
  .then(() => {
    console.info('Database seeded with demo user');
  })
  .catch((error) => {
    console.error('Failed to seed database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
