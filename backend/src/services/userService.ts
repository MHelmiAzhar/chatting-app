import {
  SignInValues,
  SignUpValues,
  UpdatePasswordValues
} from '../utils/schema/user'
import * as userRepository from '../repositories/userRepositories'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import client from '../utils/mailtrap'

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

export const signIn = async (data: SignInValues) => {
  const checkEmail = await userRepository.checkEmailExists(data.email)
  if (checkEmail === 0) {
    throw new Error('Email not registered')
  }

  const user = await userRepository.findUserByEmail(data.email)
  if (!bcrypt.compareSync(data.password, user.password)) {
    throw new Error('Email or password is incorrect')
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY ?? '',
    { expiresIn: '1d' }
  )
  return { id: user.id, email: user.email, photo: user.photo_url, token }
}

export const getEmailReset = async (email: string) => {
  const data = await userRepository.createPasswordReset(email)

  await client.testing.send({
    from: {
      email: 'noreply@messager.com',
      name: 'Messager App'
    },
    to: [
      {
        email: email
      }
    ],
    subject: 'Password Reset',
    text: `Here is your password reset token: ${data.token}` //link to frontend
  })
  return true
}

export const updatePassword = async (
  data: UpdatePasswordValues,
  token: string
) => {
  const tokenData = await userRepository.findPasswordResetByToken(token)
  if (!tokenData) {
    throw new Error('Invalid or expired token')
  }
  await userRepository.updateUserPassword(
    tokenData.user.email,
    bcrypt.hashSync(data.password, 10)
  )
  await userRepository.deleteTokenResetPasswordById(tokenData.id)
  return true
}
