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
const uploadFileAttach = path.join(
  process.cwd(),
  'public/assets/uploads/attach_messages'
)
if (!fs.existsSync(uploadFileAttach)) {
  fs.mkdirSync(uploadFileAttach, { recursive: true })
}

const uploadDirGroupAssets = path.join(
  process.cwd(),
  'public/assets/uploads/group_assets'
)
if (!fs.existsSync(uploadDirGroupAssets)) {
  fs.mkdirSync(uploadDirGroupAssets, { recursive: true })
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

export const storageGroup = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo') {
      cb(null, uploadDirGroupPhoto)
    } else {
      cb(null, uploadDirGroupAssets)
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extention = file.mimetype.split('/')[1]
    const fileName = `${file.fieldname}-${uniqueSuffix}.${extention}`
    cb(null, fileName)
  }
})
export const storageFileAttach = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFileAttach)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extention = file.mimetype.split('/')[1]
    const fileName = `${file.fieldname}-${uniqueSuffix}.${extention}`
    cb(null, fileName)
  }
})

export const upload = (storage: multer.StorageEngine) =>
  multer({
    storage,
    fileFilter(req, file, cb) {
      if (file.fieldname === 'assets') {
        cb(null, true)
        return
      }
      if (!file.mimetype.startsWith('image/')) {
        cb(null, false)
      } else {
        cb(null, true)
      }
    }
  })
