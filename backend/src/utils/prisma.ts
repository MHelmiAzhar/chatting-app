import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      photo_url: {
        needs: { photo: true },
        compute(data: any) {
          if (data.photo) {
            return `${process.env.BASE_ASSET_URL}${data.photo}`
          }
          return null
        }
      }
    }
  }
})
export default prisma
