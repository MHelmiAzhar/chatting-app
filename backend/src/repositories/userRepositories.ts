import { RoleType } from '@prisma/client'
import prisma from '../utils/prisma'
import { SignUpValues } from '../utils/schema/user'
import crypto from 'node:crypto'

export const findUserById = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    include: { role: true }
  })
}
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

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirstOrThrow({
    where: { email }
  })
}

export const createPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email)
  const token = crypto.randomBytes(32).toString('hex')

  return await prisma.passwordReset.create({
    data: {
      user_id: user.id,
      token
    }
  })
}

export const findPasswordResetByToken = async (token: string) => {
  return await prisma.passwordReset.findFirstOrThrow({
    where: { token },
    include: { user: { select: { email: true } } }
  })
}

export const updateUserPassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email)
  return await prisma.user.update({
    where: { id: user.id },
    data: { password }
  })
}

export const deleteTokenResetPasswordById = async (id: string) => {
  return await prisma.passwordReset.delete({
    where: { id }
  })
}
