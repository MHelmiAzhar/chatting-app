import express from 'express'
import * as groupController from '../controllers/groupControllers'
import verifyToken from '../middlewares/verifyToken'
import { uploadPhoto } from '../utils/multer'

const groupRoutes = express.Router()

groupRoutes.post(
  '/free',
  verifyToken,
  uploadPhoto.single('photo'),
  groupController.createFreeGroup
)

export default groupRoutes
