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
