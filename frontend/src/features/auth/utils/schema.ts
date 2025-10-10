import { z } from 'zod'

export const signUpSchema = z.object({
  photo: z
    .any()
    .refine((files: FileList) => files?.length > 0, 'Avatar is required.')
    .refine((files: FileList) => files?.[0]?.type.startsWith('image/'), {
      message: 'File must be an image'
    }),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export type SignUpValues = z.infer<typeof signUpSchema>
