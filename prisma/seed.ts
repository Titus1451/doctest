import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clearing existing data if necessary or just adding setup
  // Note: prisma db seed usually runs non-destructively or you can add clean up logic

  // Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
