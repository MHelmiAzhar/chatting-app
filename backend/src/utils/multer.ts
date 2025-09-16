import path from 'path'
import fs from 'fs'
import multer from 'multer'

const uploadDir = path.join(process.cwd(), 'public/assets/uploads/photos')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

export const storageUserPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extention = file.mimetype.split('/')[1]
    const fileName = `photo-${uniqueSuffix}.${extention}`
    cb(null, fileName)
  }
})
