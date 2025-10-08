import { useMutation } from '@tanstack/react-query'
import { signUP } from '../api/signUp'

export const useSignUp = () => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data: FormData) => signUP(data)
  })

  return { mutateAsync, isPending, isError, error }
}
