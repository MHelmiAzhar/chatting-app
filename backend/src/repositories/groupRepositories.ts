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

export const findDetailGroup = async (id: string, user_id: string) => {
  return await prisma.group.findFirstOrThrow({
    where: { id, room: { created_by: user_id } },
    select: {
      id: true,
      name: true,
      about: true,
      photo_url: true,
      price: true,
      type: true,
      assets: {
        select: { file_name: true }
      },
      room: {
        select: {
          room_member: {
            take: 1,
            where: { user_id },
            select: {
              user: {
                select: {
                  name: true,
                  photo_url: true
                }
              }
            }
          },
          _count: {
            select: {
              room_member: true
            }
          }
        }
      }
    }
  })
}

export const getMyOwnGroups = async (user_id: string) => {
  return await prisma.group.findMany({
    where: { room: { created_by: user_id } },
    select: {
      id: true,
      name: true,
      photo_url: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              room_member: true
            }
          },
          id: true
        }
      }
    }
  })
}

export const getTotalMembers = async (room_ids: string[]) => {
  return await prisma.roomMember.count({
    where: { room_id: { in: room_ids } }
  })
}

export const getMemberById = async (user_id: string, group_id: string) => {
  return await prisma.roomMember.findFirst({
    where: {
      user_id,
      room: {
        Group: {
          id: group_id
        }
      }
    }
  })
}

export const addMemberToGroup = async (room_id: string, user_id: string) => {
  const role = await userRepository.findRole('MEMBER')
  return await prisma.roomMember.create({
    data: {
      room_id,
      user_id,
      role_id: role?.id || ''
    }
  })
}
