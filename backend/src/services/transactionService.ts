import * as groupRepository from '../repositories/groupRepositories'
import * as transactionRepository from '../repositories/transactionRepositories'
import * as userRepository from '../repositories/userRepositories'

export const createTransaction = async (group_id: string, user_id: string) => {
  const checkMember = await groupRepository.getMemberById(user_id, group_id)
  if (checkMember) {
    throw new Error('You are already a member of the group')
  }

  const group = await groupRepository.findGroupById(group_id)
  if (group.type === 'FREE') {
    throw new Error('Group is free, cannot create transaction')
  }

  const transaction = await transactionRepository.createTransaction({
    price: group.price,
    owner: { connect: { id: group.room.room_member[0].user_id } },
    user: { connect: { id: user_id } },
    status: 'PENDING',
    group: { connect: { id: group_id } }
  })

  const user = await userRepository.findUserById(user_id)

  const midtransUrl = process.env.MIDTRANS_URL_TRANSACTION ?? ''
  const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? ''

  console.log(midtransAuth)
  console.log(midtransUrl)
  console.log(transaction)

  const midtransResponse = await fetch(midtransUrl, {
    method: 'POST',
    body: JSON.stringify({
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.price
      },
      credit_card: {
        secure: true
      },

      customer_details: {
        email: user.email
      }
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${midtransAuth}`
    }
  })
  const midtransJson = await midtransResponse.json()
  return midtransJson
}

export const updateTransactionStatus = async (
  order_id: string,
  status: string
) => {
  switch (status) {
    case 'capture':
    case 'settlement': {
      const transaction = await transactionRepository.updateTransaction(
        order_id,
        'COMPLETED'
      )
      const group = await groupRepository.findGroupById(transaction.group_id)
      await groupRepository.addMemberToGroup(group.room_id, transaction.user_id)
      return { transaction_id: transaction.id }
    }
    case 'deny':
    case 'expire':
    case 'failure': {
      const transaction = await transactionRepository.updateTransaction(
        order_id,
        'FAILED'
      )
      return { transaction_id: transaction.id }
    }
    default:
      return {}
  }
}

export const getRevenueStat = async (user_id: string) => {
  const transactions = await transactionRepository.getMyTransactions(user_id)
  const payout = await transactionRepository.getMyPayout(user_id)
  const group = await groupRepository.getMyOwnGroups(user_id)

  const totalRevenue = transactions.reduce((acc, curr) => {
    if (curr.status === 'COMPLETED') {
      return acc + curr.price
    }
    return acc
  }, 0)
  const totalPayout = payout.reduce((acc, curr) => acc + curr.amount, 0)
  const balance = totalRevenue - totalPayout

  const totalVipGroups = group.filter((g) => g.type === 'PAID').length
  const totalVipMembers = group.reduce((acc, curr) => {
    if (curr.type === 'PAID') {
      return acc + (curr?.room?._count?.room_member || 0)
    }
    return acc
  }, 0)

  const latestMemberVip = transactions.filter((t) => t.status === 'COMPLETED')
  return {
    balance,
    total_vip_groups: totalVipGroups,
    total_vip_members: totalVipMembers,
    total_revenue: totalRevenue,
    latest_member_vip: latestMemberVip
  }
}

export const getHistoryPayouts = async (user_id: string) => {
  return await transactionRepository.getMyPayout(user_id)
}
