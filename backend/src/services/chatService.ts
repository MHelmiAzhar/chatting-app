import * as chatRepository from '../repositories/chatRepositories'

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
