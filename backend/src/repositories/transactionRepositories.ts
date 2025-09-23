import { Prisma, TransactionStatus } from '@prisma/client'
import prisma from '../utils/prisma'

export const createTransaction = async (
  data: Prisma.TransactionCreateInput
) => {
  return await prisma.transaction.create({
    data
  })
}

export const updateTransaction = async (
  id: string,
  status: TransactionStatus
) => {
  return await prisma.transaction.update({
    where: { id },
    data: { status }
  })
}
