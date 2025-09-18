import express from 'express'
import * as groupController from '../controllers/groupControllers'
import verifyToken from '../middlewares/verifyToken'
import { storageGroup, upload } from '../utils/multer'

const groupRoutes = express.Router()

groupRoutes.post(
  '/free',
  verifyToken,
  upload(storageGroup).single('photo'),
  groupController.createFreeGroup
)

groupRoutes.post(
  '/paid',
  verifyToken,
  upload(storageGroup).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'assets' }
  ]),
  groupController.createPaidGroup
)

export default groupRoutes
