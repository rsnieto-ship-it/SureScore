import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const contacts = await prisma.contact.findMany({
    where: { status: 'SUBSCRIBED' },
    select: { email: true },
    orderBy: { email: 'asc' }
  });
  contacts.forEach(c => console.log(c.email));
  await prisma.$disconnect();
}
main();
