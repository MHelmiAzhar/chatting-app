import prisma from '../utils/prisma'
import { GroupFreeValues, GroupPaidValues } from '../utils/schema/group'
import * as userRepository from './userRepositories'

export const upsertFreeGroup = async (
  data: GroupFreeValues,
  userId: string,
  photo?: string,
  groupId?: string
) => {
  const owner = await userRepository.findRole('OWNER')

  return await prisma.group.upsert({
    where: { id: groupId || '' },
    create: {
      name: data.name,
      about: data.about,
      photo: photo ?? '',
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
    },
    update: {
      name: data.name,
      about: data.about,
      photo: photo
    }
  })
}

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo?: string,
  assets?: string[],
  groupId?: string
) => {
  const owner = await userRepository.findRole('OWNER')

  const group = await prisma.group.upsert({
    where: { id: groupId || '' },
    create: {
      name: data.name,
      about: data.about,
      photo: photo ?? '',
      price: parseInt(data.price),
      benefit: data.benefits,
      type: 'PAID',
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
    },
    update: {
      name: data.name,
      about: data.about,
      photo: photo,
      price: parseInt(data.price),
      benefit: data.benefits
    }
  })

  if (assets && assets.length > 0) {
    for (const asset of assets) {
      await prisma.groupAsset.create({
        data: {
          group_id: group.id,
          file_name: asset
        }
      })
    }
  }
  return group
}

export const findGroupById = async (id: string) => {
  return await prisma.group.findFirstOrThrow({
    where: { id },
    include: { assets: true }
  })
}

export const getDiscoverGroups = async (name?: string) => {
  return await prisma.group.findMany({
    where: {
      name: name ? { contains: name as string, mode: 'insensitive' } : undefined
    },
    select: {
      photo: true,
      id: true,
      name: true,
      about: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              room_message: true
            }
          }
        }
      }
    }
  })
}

export const getDiscoverPeople = async (name?: string, user_id?: string) => {
  return await prisma.user.findMany({
    where: {
      id: { not: user_id },
      name: name ? { contains: name as string, mode: 'insensitive' } : undefined
    },
    select: {
      id: true,
      name: true,
      photo_url: true
    }
  })
}
