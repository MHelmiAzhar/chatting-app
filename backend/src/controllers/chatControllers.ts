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
