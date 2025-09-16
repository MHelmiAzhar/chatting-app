import { SignUpValues } from '../utils/schema/user'
import * as userRepository from '../repositories/userRepositories'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (data: SignUpValues, file: Express.Multer.File) => {
  const checkEmail = await userRepository.checkEmailExists(data.email)
  if (checkEmail > 0) {
    throw new Error('Email already exists')
  }

  const user = await userRepository.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 10)
    },
    file.filename
  )

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY ?? '',
    { expiresIn: '1d' }
  )
  return { id: user.id, email: user.email, photo: user.photo_url, token }
}
