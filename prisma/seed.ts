import PasswordHash from '@/infra/utils/PasswordHash';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'User Test',
        email: 'user-test@photolink.com.br',
        phone: '(67) 99999-9999',
        password_hash: await PasswordHash.hash('123456'),
        role: 'MEMBER',
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
