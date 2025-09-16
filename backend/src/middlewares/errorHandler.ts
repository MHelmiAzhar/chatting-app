import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorCatched = error

  if (errorCatched instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(500).json({
      success: false,
      message: errorCatched.message
    })
  }

  return res.status(500).json({
    success: false,
    message: errorCatched.message ?? 'Internal Server Error'
  })
}
