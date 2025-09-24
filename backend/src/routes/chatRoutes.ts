import express from 'express'
import * as chatController from '../controllers/chatControllers'
import { de } from 'zod/v4/locales'
import verifyToken from '../middlewares/verifyToken'
const chatRoutes = express.Router()

chatRoutes.post('/personal', verifyToken, chatController.createRoomChatPersonal)

export default chatRoutes
