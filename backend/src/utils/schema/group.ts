import z from 'zod'

export const groupFreeSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  about: z.string()
})

export type GroupFreeValues = z.infer<typeof groupFreeSchema>
