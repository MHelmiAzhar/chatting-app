import express from 'express'
import { storageUserPhoto, upload } from '../utils/multer'
import * as userController from '../controllers/userController'

const userRoutes = express.Router()

userRoutes.post(
  '/sign-up',
  upload(storageUserPhoto).single('photo'),
  userController.signUp
)

userRoutes.post('/sign-in', userController.signIn)
userRoutes.post('/reset-password', userController.getEmailReset)
userRoutes.put('/reset-password/:token_id', userController.updatePassword)

export default userRoutes
