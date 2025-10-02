import * as chatRepository from '../repositories/chatRepositories'
import { createMessageValues } from '../utils/schema/chat'
import path from 'path'
import fs from 'fs'

export const createRoomPersonal = async (
  sender_id: string,
  reciever_id: string
) => {
  return await chatRepository.createRoomPersonal(sender_id, reciever_id)
}

export const getRecentRoom = async (user_id: string) => {
  return await chatRepository.getRoom(user_id)
}

export const getRoomMessage = async (room_id: string) => {
  return await chatRepository.getRoomMessage(room_id)
}

export const createMessage = async (
  data: createMessageValues,
  user_id: string,
  file: Express.Multer.File | undefined
) => {
  const room = await chatRepository.findRoomById(data.room_id)

  if (room?.is_group) {
    const member = await chatRepository.findMember(room.id, user_id)
    if (!member) {
      const pathFile = path.join(
        __dirname,
        '../../public/assets/uploads/attach_messages',
        file?.filename || ''
      )
      if (file && fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile)
      }
      throw new Error('You are not a member of this group')
    }
  }

  return await chatRepository.createMessage(data, user_id, file)
}
