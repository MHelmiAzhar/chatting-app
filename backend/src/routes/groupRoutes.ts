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
groupRoutes.post(
  '/join-free',
  verifyToken,
  groupController.createMemberFreeGroup
)

groupRoutes.put(
  '/free/:group_id',
  verifyToken,
  upload(storageGroup).single('photo'),
  groupController.updateFreeGroup
)

groupRoutes.put(
  '/paid/:group_id',
  verifyToken,
  upload(storageGroup).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'assets' }
  ]),
  groupController.updatePaidGroup
)

groupRoutes.get('/peoples', verifyToken, groupController.getDiscoverPeople)
groupRoutes.get(
  '/detail/:group_id',
  verifyToken,
  groupController.findDetailGroup
)
groupRoutes.get('/own_groups', verifyToken, groupController.getMyOwnGroups)
groupRoutes.get('/', verifyToken, groupController.getDiscoverGroups)

export default groupRoutes
