import { GroupFreeValues, GroupPaidValues } from '../utils/schema/group'
import * as groupRepositories from '../repositories/groupRepositories'
import path from 'node:path'
import fs from 'node:fs'

export const upsertFreeGroup = async (
  data: GroupFreeValues,
  userId: string,
  photo?: string,
  groupId?: string
) => {
  if (groupId && photo) {
    const group = await groupRepositories.findGroupById(groupId)
    const pathPhoto = path.join(
      __dirname,
      '../../public/uploads/groups',
      group.photo
    )
    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto)
    }
  }
  const group = await groupRepositories.upsertFreeGroup(
    data,
    userId,
    photo,
    groupId
  )
  return group
}

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo?: string,
  assets?: string[],
  groupId?: string
) => {
  let groupData
  if (groupId && photo) {
    groupData = await groupRepositories.findGroupById(groupId)
    const pathPhoto = path.join(
      __dirname,
      '../../public/uploads/groups',
      groupData.photo
    )
    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto)
    }
  }
  if (groupId && assets && assets.length > 0) {
    groupData?.assets.forEach((asset) => {
      const pathAsset = path.join(
        __dirname,
        '../../public/uploads/group_assets',
        asset.file_name
      )
      if (fs.existsSync(pathAsset)) {
        fs.unlinkSync(pathAsset)
      }
    })
  }
  const group = await groupRepositories.upsertPaidGroup(
    data,
    userId,
    photo,
    assets,
    groupId
  )
  return group
}

export const getDiscoverGroups = async (name?: string) => {
  return await groupRepositories.getDiscoverGroups(name)
}

export const getDiscoverPeople = async (name?: string, user_id?: string) => {
  return await groupRepositories.getDiscoverPeople(name, user_id)
}

export const findDetailGroup = async (id: string, user_id: string) => {
  return await groupRepositories.findDetailGroup(id, user_id)
}

export const getMyOwnGroups = async (user_id: string) => {
  const group = await groupRepositories.getMyOwnGroups(user_id)
  const vipGroups = group.filter((g) => {
    return g.type === 'PAID'
  }).length

  const freeGroups = group.filter((g) => {
    return g.type === 'FREE'
  }).length

  const totalMembers = await groupRepositories.getTotalMembers(
    group.map((g) => g.id)
  )
  return {
    lists: group.map((g) => {
      return {
        id: g.id,
        name: g.name,
        photo_url: g.photo_url,
        type: g.type,
        total_members: g.room._count.room_member
      }
    }),
    paid_grous: vipGroups,
    free_groups: freeGroups,
    total_members: totalMembers
  }
}

export const addMemberFreeGroup = async (group_id: string, user_id: string) => {
  const checkMember = await groupRepositories.getMemberById(user_id, group_id)
  if (checkMember) {
    throw new Error('You are already a member of a group')
  }

  const group = await groupRepositories.findGroupById(group_id)

  if (group.type !== 'FREE') {
    throw new Error('This group is not free')
  }

  await groupRepositories.addMemberToGroup(group.room_id, user_id)

  return true
}
