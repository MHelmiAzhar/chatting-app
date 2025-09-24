import z from 'zod'

export const createChatPersonalShema = z
  .object({
    user_id: z.string().min(1, 'User ID is required')
  })
  .strict()

export type createRoomPersonalValues = z.infer<typeof createChatPersonalShema>
