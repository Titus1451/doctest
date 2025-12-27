import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const jurisdictions = [
    { code: 'US', name: 'United States', type: 'COUNTRY' },
    { code: 'US-TX', name: 'Texas', type: 'STATE' },
    { code: 'US-TN', name: 'Tennessee', type: 'STATE' },
    { code: 'US-CA', name: 'California', type: 'STATE' },
    { code: 'US-NY', name: 'New York', type: 'STATE' },
    { code: 'CA', name: 'Canada', type: 'COUNTRY' },
    { code: 'CA-ON', name: 'Ontario', type: 'PROVINCE' },
    { code: 'CA-BC', name: 'British Columbia', type: 'PROVINCE' },
    { code: 'CA-AB', name: 'Alberta', type: 'PROVINCE' },
  ]

  for (const j of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { code: j.code },
      update: {},
      create: j,
    })
  }

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
