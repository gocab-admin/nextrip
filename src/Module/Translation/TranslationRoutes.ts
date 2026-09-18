import express from 'express'
import multer from 'multer'
import path from 'path'
const TranslationModule = express.Router()
import { TranslationController as Translationctrl } from './TranslationController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


const File = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../locale'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const TranslationFile = multer({ storage: File })

TranslationModule.route('/translatejson')
  .get(authorize([Enum.ROLES.ADMIN]), Translationctrl.getTranslationJson)
TranslationModule.route('/languages/user')
  .get(Translationctrl.getLanguagesForUser)
TranslationModule.route('/languages/:languageId?')
  .get(authorize([Enum.ROLES.ADMIN]), Translationctrl.getLanguages)
  .post(authorize([Enum.ROLES.ADMIN]), TranslationFile.single('file'), Translationctrl.updateLanguage)
  .delete(authorize([Enum.ROLES.ADMIN]), Translationctrl.deleteLanguages)
TranslationModule.route('/translate')
  .get(authorize([Enum.ROLES.ADMIN]), Translationctrl.getTranslation)
  .put(authorize([Enum.ROLES.ADMIN]), Translationctrl.updateTranslationFile)
TranslationModule.route('/groups')
  .get(authorize([Enum.ROLES.ADMIN]), Translationctrl.getTranslationGroup)
TranslationModule.route('/transcribe/generate')
  .post(authorize([Enum.ROLES.ADMIN]), Translationctrl.generateJson)
TranslationModule.route('/set-default/:languageId')
  .put(authorize([Enum.ROLES.ADMIN]), Translationctrl.setDefaultLanguage)
TranslationModule.route('/transcribe/:translationId?')
  .get(authorize([Enum.ROLES.ADMIN]), Translationctrl.getTranscribe)
  .post(authorize([Enum.ROLES.ADMIN]), Translationctrl.updateTranscribe)

export default TranslationModule