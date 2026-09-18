import express from 'express'
import multer from 'multer';
const ThemeModule = express.Router()
import { ThemeController as themectrl } from "@abserve/Module/Theme/ThemeController";
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let memoryStorage = multer.memoryStorage();
let themeUpload = multer({ storage: memoryStorage })

ThemeModule.route('/recentBookings')
    .get(themectrl.recentBookings)
ThemeModule.route('/detail')
    .get(themectrl.getDetailedTheme)
ThemeModule.route('/')
    .post(authorize([Enum.ROLES.ADMIN]), themeUpload.any(), themectrl.addTheme)
    .put(authorize([Enum.ROLES.ADMIN]), themeUpload.any(), themectrl.editTheme)
    .get(authorize([Enum.ROLES.ADMIN]), themectrl.getTheme)


export default ThemeModule