import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/CustomRequest'
import { groupFreeSchema, groupPaidSchema } from '../utils/schema/group'
import * as groupServices from '../services/groupServices'

export const createFreeGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupFreeSchema.safeParse(req.body)
    if (!parse.success) {
      const errMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errMessage
      })
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Photo is required' })
    }

    const group = await groupServices.upsertFreeGroup(
      parse.data,
      req.user?.id || '',
      req.file.filename
    )

    return res
      .status(201)
      .json({ success: true, message: 'Group created', data: group })
  } catch (error) {
    next(error)
  }
}
export const updateFreeGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupId = req.params.group_id
    const parse = groupFreeSchema.safeParse(req.body)
    if (!parse.success) {
      const errMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errMessage
      })
    }

    const group = await groupServices.upsertFreeGroup(
      parse.data,
      req.user?.id || '',
      req.file?.filename,
      groupId
    )

    return res
      .status(200)
      .json({ success: true, message: 'Group updated', data: group })
  } catch (error) {
    next(error)
  }
}

export const createPaidGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupPaidSchema.safeParse(req.body)
    if (!parse.success) {
      const errMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errMessage
      })
    }
    const file = req.files as {
      photo?: Express.Multer.File[]
      assets?: Express.Multer.File[]
    }
    console.log('ini file', file.photo)
    if (!file.photo) {
      return res
        .status(400)
        .json({ success: false, message: 'Photo is required' })
    }

    if (!file.assets || file.assets.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'At least one asset is required' })
    }

    const assets = file.assets.map((asset) => asset.filename)

    const group = await groupServices.upsertPaidGroup(
      parse.data,
      req.user?.id || '',
      file.photo[0].filename,
      assets
    )

    return res
      .status(201)
      .json({ success: true, message: 'Group created', data: group })
  } catch (error) {
    next(error)
  }
}
export const updatePaidGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupId = req.params.group_id
    const parse = groupPaidSchema.safeParse(req.body)
    if (!parse.success) {
      const errMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errMessage
      })
    }
    const file = req.files as {
      photo?: Express.Multer.File[]
      assets?: Express.Multer.File[]
    }
    console.log('ini file', req)

    const assets = file?.assets?.map((asset) => asset.filename)

    const group = await groupServices.upsertPaidGroup(
      parse.data,
      req.user?.id || '',
      file.photo?.[0]?.filename ?? '',
      assets,
      groupId
    )

    return res
      .status(200)
      .json({ success: true, message: 'Group updated', data: group })
  } catch (error) {
    next(error)
  }
}

export const getDiscoverGroups = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query
    const groups = await groupServices.getDiscoverGroups(
      name as string | undefined
    )
    return res
      .status(200)
      .json({ success: true, message: 'Discover groups fetched', data: groups })
  } catch (error) {
    next(error)
  }
}

export const getDiscoverPeople = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query
    const user_id = req.user?.id
    const people = await groupServices.getDiscoverPeople(
      name as string | undefined,
      user_id
    )
    return res
      .status(200)
      .json({ success: true, message: 'Discover people fetched', data: people })
  } catch (error) {
    next(error)
  }
}
