import { BaseResponse } from '../../../shared/types/response'
import instanceApi from '../../../shared/utils/axios'
import { z } from 'zod'

export const signUpResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  photo: z.string().url(),
  token: z.string()
})

export type SignUpResponse = z.infer<typeof signUpResponseSchema>

export const signUP = (data: FormData): Promise<BaseResponse<SignUpResponse>> =>
  instanceApi
    .post('/auth/sign-up', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((res) => res.data)
