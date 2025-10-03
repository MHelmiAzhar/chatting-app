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

export const getMyTransactions = async (user_id: string) => {
  return await prisma.transaction.findMany({
    where: {
      owner_id: user_id
    },
    include: {
      user: {
        select: {
          name: true,
          photo_url: true
        }
      },
      group: {
        select: {
          name: true,
          photo_url: true
        }
      }
    }
  })
}

export const getMyPayout = async (user_id: string) => {
  return await prisma.payout.findMany({
    where: {
      user_id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
