import prisma from '../utils/prisma'
import * as userRepository from './userRepositories'
export const createRoomPersonal = async (
  sender_id: string,
  reciever_id: string
) => {
  const room = await prisma.room.findFirst({
    where: {
      room_member: {
        every: {
          user_id: { in: [sender_id, reciever_id] }
        }
      },
      is_group: false
    }
  })

  const roleOwner = await userRepository.findRole('OWNER')
  const roleMember = await userRepository.findRole('MEMBER')

  return await prisma.room.upsert({
    where: { id: room?.id || '' },
    update: {},
    create: {
      created_by: sender_id,
      is_group: false,
      name: '',
      room_member: {
        createMany: {
          data: [
            { user_id: sender_id, role_id: roleOwner.id },
            { user_id: reciever_id, role_id: roleMember.id }
          ]
        }
      }
    }
  })
}
