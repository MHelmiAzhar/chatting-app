import { NextFunction, Request, Response } from 'express'
import fs from 'node:fs'
import * as userService from '../services/userService'
import {
  signInSchema,
  signUpSchema,
  updatePasswordSchema
} from '../utils/schema/user'
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

    const parse = signUpSchema.safeParse(req.body)
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

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.safeParse(req.body)
    if (!parse.success) {
      const errorMessages = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )

      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        detail: errorMessages
      })
    }

    const data = await userService.signIn(parse.data)
    return res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getEmailReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.pick({ email: true }).safeParse(req.body)
    if (!parse.success) {
      const errorMessages = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )

      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        detail: errorMessages
      })
    }

    await userService.getEmailReset(parse.data.email)
    return res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = updatePasswordSchema.safeParse(req.body)
    if (!parse.success) {
      const errorMessages = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      )

      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        detail: errorMessages
      })
    }

    await userService.updatePassword(parse.data, req.params.token_id)
    return res.status(200).json({
      success: true,
      message: 'Password Reset successfully'
    })
  } catch (error) {
    next(error)
  }
}
