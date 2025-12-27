import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clearing existing data if necessary or just adding setup
  // Note: prisma db seed usually runs non-destructively or you can add clean up logic
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
