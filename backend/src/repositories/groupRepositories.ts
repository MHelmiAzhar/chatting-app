import prisma from '../utils/prisma'
import { GroupFreeValues } from '../utils/schema/group'
import * as userRepository from './userRepositories'

export const createGroup = async (
  data: GroupFreeValues,
  photo: string,
  userId: string
) => {
  const owner = await userRepository.findRole('OWNER')

  return await prisma.group.create({
    data: {
      name: data.name,
      about: data.about,
      photo: photo,
      price: 0,
      type: 'FREE',
      room: {
        create: {
          created_by: userId,
          name: data.name,
          room_member: {
            create: {
              user_id: userId,
              role_id: owner?.id || ''
            }
          },
          is_group: true
        }
      }
    }
  })
}
