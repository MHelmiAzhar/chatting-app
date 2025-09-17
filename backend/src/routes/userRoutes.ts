import express from 'express'
import { storageUserPhoto } from '../utils/multer'
import multer from 'multer'
import * as userController from '../controllers/userController'

const userRoutes = express.Router()

const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      cb(null, false)
    }
    cb(null, true)
  }
})

userRoutes.post(
  '/auth/sign-up',
  uploadPhoto.single('photo'),
  userController.signUp
)

userRoutes.post('/auth/sign-in', userController.signIn)
userRoutes.post('/auth/reset-password', userController.getEmailReset)
userRoutes.put('/auth/reset-password/:token_id', userController.updatePassword)

export default userRoutes
