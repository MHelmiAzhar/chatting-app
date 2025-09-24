import * as chatRepository from '../repositories/chatRepositories'

export const createRoomPersonal = async (
  sender_id: string,
  reciever_id: string
) => {
  return await chatRepository.createRoomPersonal(sender_id, reciever_id)
}
