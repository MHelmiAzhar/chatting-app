import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/CustomRequest'
import { createChatPersonalShema } from '../utils/schema/chat'
import * as chatServices from '../services/chatService'

export const createRoomChatPersonal = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = createChatPersonalShema.safeParse(req.body)
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

    const data = await chatServices.createRoomPersonal(
      req.user?.id || '',
      parse.data.user_id
    )

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getRecentRoom = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await chatServices.getRecentRoom(req.user?.id || '')
    return res.status(200).json({
      success: true,
      message: 'Recent room fetched successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getRoomMessage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await chatServices.getRoomMessage(req.params.room_id)
    return res.status(200).json({
      success: true,
      message: 'Room messages fetched successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}
