import express from 'express'
import * as chatController from '../controllers/chatControllers'
import verifyToken from '../middlewares/verifyToken'
import { upload, storageFileAttach } from '../utils/multer'

const chatRoutes = express.Router()

chatRoutes.get('/recent', verifyToken, chatController.getRecentRoom)
chatRoutes.get('/room/:room_id', verifyToken, chatController.getRoomMessage)
chatRoutes.post('/personal', verifyToken, chatController.createRoomChatPersonal)
chatRoutes.post(
  '/room/message',
  verifyToken,
  upload(storageFileAttach).single('attach'),
  chatController.createMessage
)

export default chatRoutes
