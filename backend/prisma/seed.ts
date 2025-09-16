import { PrismaClient, RoleType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed initial data here
  const roles = [RoleType.ADMIN, RoleType.USER, RoleType.MEMBER, RoleType.OWNER]
  for (const r of roles) {
    const roleExists = await prisma.role.findFirst({
      where: { role: r }
    })
    await prisma.role.upsert({
      where: { id: roleExists?.id || '' },
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
