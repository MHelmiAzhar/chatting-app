import z from 'zod'

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export type SignUpValues = z.infer<typeof userSchema>
