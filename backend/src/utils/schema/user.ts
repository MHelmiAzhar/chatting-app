import z from 'zod'

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})
export const signInSchema = signUpSchema.pick({
  email: true,
  password: true
})
export const updatePasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type SignUpValues = z.infer<typeof signUpSchema>
export type SignInValues = z.infer<typeof signInSchema>
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>
