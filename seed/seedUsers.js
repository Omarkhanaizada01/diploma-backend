// seed/seedUsers.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers() {
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('user123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
      },
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'ADMIN',
      },
    ],
  });

  console.log('Users seeded ✅');
  await prisma.$disconnect();
}

seedUsers();
