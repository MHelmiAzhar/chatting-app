import z from 'zod'

export const groupFreeSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  about: z.string()
})

export const groupPaidSchema = groupFreeSchema.extend({
  price: z.string(),
  benefits: z.array(z.string()).min(1, 'Benefits is required')
})

export type GroupFreeValues = z.infer<typeof groupFreeSchema>
export type GroupPaidValues = z.infer<typeof groupPaidSchema>
