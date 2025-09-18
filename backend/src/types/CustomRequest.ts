import { RoleType } from '@prisma/client'
import { Request } from 'express'

type User = {
  id: string
  name: string
  email: string
  role: RoleType
}
export interface CustomRequest extends Request {
  user?: User | null
}
