import path from 'path'
import fs from 'fs'
import multer from 'multer'

const uploadDirUserPhoto = path.join(
  process.cwd(),
  'public/assets/uploads/photos'
)
if (!fs.existsSync(uploadDirUserPhoto)) {
  fs.mkdirSync(uploadDirUserPhoto, { recursive: true })
}

const uploadDirGroupPhoto = path.join(
  process.cwd(),
  'public/assets/uploads/groups'
)
if (!fs.existsSync(uploadDirGroupPhoto)) {
  fs.mkdirSync(uploadDirGroupPhoto, { recursive: true })
}

export const storageUserPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirUserPhoto)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extention = file.mimetype.split('/')[1]
    const fileName = `photo-${uniqueSuffix}.${extention}`
    cb(null, fileName)
  }
})

export const storageGroupPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirGroupPhoto)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extention = file.mimetype.split('/')[1]
    const fileName = `photo-${uniqueSuffix}.${extention}`
    cb(null, fileName)
  }
})

export const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      cb(null, false)
    }
    cb(null, true)
  }
})
