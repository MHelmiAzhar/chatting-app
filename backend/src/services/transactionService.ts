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
