import { NextFunction, Request, Response } from 'express'
import { userSchema } from '../utils/schema/user'
import fs from 'node:fs'
import * as userService from '../services/userService'
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Photo is required' })
    }

    const parse = userSchema.safeParse(req.body)
    if (!parse.success) {
      const errorMessages = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )

      fs.unlinkSync(req.file.path)

      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        detail: errorMessages
      })
    }

    const newUser = await userService.signUp(parse.data, req.file)
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    })
  } catch (error) {
    next(error)
  }
}
