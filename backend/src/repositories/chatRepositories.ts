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

export const getRoom = async (user_id: string) => {
  return await prisma.room.findMany({
    where: {
      room_member: { some: { user_id } }
    },
    include: {
      room_message: {
        select: {
          context: true,
          sender: {
            select: {
              name: true,
              photo_url: true
            }
          }
        },
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      },
      room_member: {
        select: {
          user: {
            select: {
              name: true,
              photo_url: true
            }
          }
        },
        where: {
          role: { role: 'MEMBER' }
        }
      },
      Group: {
        select: {
          name: true,
          photo_url: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
