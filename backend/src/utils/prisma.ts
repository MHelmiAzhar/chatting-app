import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      photo_url: {
        needs: { photo: true },
        compute(data: any) {
          if (data.photo) {
            return `${process.env.URL_ASSET_PHOTO}${data.photo}`
          }
          return null
        }
      }
    },
    group: {
      photo_url: {
        needs: { photo: true },
        compute(data: any) {
          if (data.photo) {
            return `${process.env.URL_ASSET_GROUP}${data.photo}`
          }
          return null
        }
      }
    }
  }
})
export default prisma
