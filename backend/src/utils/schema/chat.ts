import z from 'zod'

export const createChatPersonalShema = z
  .object({
    user_id: z.string().min(1, 'User ID is required')
  })
  .strict()

export const createMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  room_id: z.string().min(1, 'Room ID is required')
})
export type createRoomPersonalValues = z.infer<typeof createChatPersonalShema>
export type createMessageValues = z.infer<typeof createMessageSchema>
