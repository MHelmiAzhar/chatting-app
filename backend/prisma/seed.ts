import { PrismaClient } from '@prisma/client'
import { RoleType } from '../src/generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // Seed initial data here
  const roles = [RoleType.ADMIN, RoleType.USER, RoleType.MEMBER]
  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: r },
      update: {},
      create: { role: r }
    })
  }
  console.log('Successfully seeded roles.')
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
