import { z } from 'zod'

export const withdrawSchema = z.object({
  amount: z.number().min(10000, 'Minimum withdraw is 10,000'),
  bank_name: z.enum(['BCA', 'BNI', 'BRI', 'MANDIRI']),
  bank_account_number: z.string().min(10).max(16),
  bank_account_name: z.string().min(3).max(50)
})

export type WithDrawValues = z.infer<typeof withdrawSchema>
