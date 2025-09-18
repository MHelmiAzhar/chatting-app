import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/CustomRequest'
import jwt from 'jsonwebtoken'
import * as userRepositories from '../repositories/userRepositories'

export default async function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authorization.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  if (authorization?.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, process.env.SECRET_KEY ?? '', async (err, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: 'Token is invalid' })
    }

    const data = decoded as { id: string; email: string }
    const user = await userRepositories.findUserById(data.id)

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.role
    }

    next()
  })
}
