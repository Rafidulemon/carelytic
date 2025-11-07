import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  const demoUsers = [
    {
      email: 'demo@carelytic.com',
      phone: '+8801850700054',
      name: 'Rafid',
      credits: 10,
      password: 'DemoUser123!',
    },
    {
      email: 'demo2@carelytic.com',
      phone: '+8801234567891',
      name: 'Test User',
      credits: 100,
      password: 'DemoUser456!',
    },
    {
      email: 'demo3@carelytic.com',
      phone: '+8801223456789',
      name: 'Test User 2',
      credits: 100,
      password: 'DemoUser789!',
    },
  ];

  await Promise.all(
    demoUsers.map(async ({ password, ...user }) => {
      const hashedPassword = await hash(password, SALT_ROUNDS);
      const { email, phone, name, credits } = user;
      return prisma.user.upsert({
        where: { email },
        update: {
          hashedPassword,
          phone,
          name,
          credits,
        },
        create: {
          email,
          phone,
          name,
          hashedPassword,
          isDiabetic: false,
          hasHypertension: false,
          credits,
        },
      });
    })
  );
}

main()
  .then(() => {
    console.info('Database seeded with demo users');
  })
  .catch((error) => {
    console.error('Failed to seed database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
