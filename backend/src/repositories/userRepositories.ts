import { RoleType } from '../generated/prisma'
import prisma from '../utils/prisma'
import { SignUpValues } from '../utils/schema/user'

export const checkEmailExists = async (email: string) => {
  return await prisma.user.count({
    where: { email }
  })
}

export const findRole = async (role: RoleType) => {
  return await prisma.role.findFirstOrThrow({
    where: { role: role }
  })
}

export const createUser = async (data: SignUpValues, photo: string) => {
  const role = await findRole('USER')

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      photo,
      role_id: role.id
    }
  })
}
