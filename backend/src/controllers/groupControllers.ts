import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/CustomRequest'
import { groupFreeSchema } from '../utils/schema/group'
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

    const group = await groupServices.createFreeGroup(
      parse.data,
      req.file.filename,
      req.user?.id || ''
    )

    return res
      .status(201)
      .json({ success: true, message: 'Group created', data: group })
  } catch (error) {
    next(error)
  }
}
