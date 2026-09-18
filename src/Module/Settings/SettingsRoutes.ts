import express from 'express'
import multer from 'multer'
import path from 'path'
const SettingsModule = express.Router()
import { SettingsController as settingctrl } from './SettingsController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let settingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/Settings'))
  },
  filename: (req, file, cb) => {
    let filetypes: any
    if (file.fieldname === 'logo') {
      filetypes = /png/
    } else if (file.fieldname === 'favicon') {
      filetypes = /ico/
    } else if (file.fieldname === 'qrcode') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'hostFormImage1') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'hostFormImage2') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'hostFormImage3') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'createFormImage1') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'createFormImage2') {
      filetypes = /png|jpeg|jpg/
    } else if (file.fieldname === 'createFormImage3') {
      filetypes = /png|jpeg|jpg/
    }

    if (filetypes?.test(file.mimetype)) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    } else {
      cb(new Error('INVALID_FILE_TYPE'), '')
    }
  }
})

let pwaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/pwa')); 
  },
  filename: (req, file, cb) => {
    let filetypes = /png/
    if (filetypes?.test(file.mimetype)) {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    }
    else {
      cb(new Error('INVALID_FILE_TYPE'), '')
    }
  }
});

let settingUpload = multer({ storage: settingStorage }).fields([ { name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }, { name: 'qrcode', maxCount: 1 }, { name: 'hostFormImage1', maxCount: 1 }, { name: 'hostFormImage2', maxCount: 1 }, { name: 'hostFormImage3', maxCount: 1 }, { name: 'createFormImage1', maxCount: 1 }, { name: 'createFormImage2', maxCount: 1 }, { name: 'createFormImage3', maxCount: 1 } ])

let pwaUpload = multer({ storage : pwaStorage }).fields([ { name: 'maskable', maxCount: 1 }, { name: 'icons', maxCount: 10 } ]);

SettingsModule.route('/update').put(authorize([Enum.ROLES.ADMIN]), settingUpload, settingctrl.createSettings)
SettingsModule.route('/fieldStatus').get(settingctrl.fetchFieldStatus)
SettingsModule.route('/updatePwa').put( authorize([Enum.ROLES.ADMIN]), pwaUpload, settingctrl.updatePWA)
SettingsModule.route('/pwa').get(settingctrl.getAllPWA)
SettingsModule.route('/removePwaIcon').delete( authorize([Enum.ROLES.ADMIN]), settingctrl.removeIcon)
SettingsModule.route('/installationSteps').get(settingctrl.getInstallationSteps)
SettingsModule.route('/').get(settingctrl.getAllSetting)

export default SettingsModule