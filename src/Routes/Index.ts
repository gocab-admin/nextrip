
import express ,{ Request, Response } from 'express';
import { ChatModule } from '@abserve/Module/Chat/ChatRoute'
import { ListModule, PaymentModule, AdminModule } from '@abserve/Module/Listing/Route/List'
import { AdvertisementModule } from '@abserve/Module/Ads/AdsRoute'
import AuthModule from '@abserve/Module/Auth/Route/Auth'
import payoutModule from '@abserve/Module/PaymentGateway/Route/Wallet'
import phonepeModule from '@abserve/Module/PaymentGateway/Route/Phonepe';
import MasterModule from '@abserve/Module/Listing/Route/DataStore'
import messageModule from '@abserve/Module/Messages/MessageRoutes'
import notificationsModule from '@abserve/Module/Notification/Notification'
import CmsModule from '@abserve/Module/Cms/CmsRoutes'
import SettingsModule from '@abserve/Module/Settings/SettingsRoutes'
import MailTemplateRoute from '@abserve/Module/MailTemplate/MailTemplateRoute'
import ThemeModule from '@abserve/Module/Theme/ThemeRoute';
import TranslationModule from '@abserve/Module/Translation/TranslationRoutes'
import DocumentModule from '@abserve/Module/Auth/Route/Document'
import CurrencyModule from '@abserve/Module/Currency/CurrencyRoutes'
import GalleryModule  from '@abserve/Module/Gallery/GalleryRoute'
import IcalModule from '@abserve/Module/Icalendar/IcalRoute';
import ReportListingModule from '@abserve/Module/ReportListing/ReportListingRoute'
import ReportUserModule from '@abserve/Module/ReportUser/ReportUserRoute'
import PrivilegeModule from '@abserve/Module/Privileges/Route/Privilege'


const routes = express.Router();

routes.use('/module/auth', AuthModule)
routes.use('/module/document', DocumentModule)
routes.use('/module/listing', ListModule)
routes.use('/module/:userType["admin","user"]', MasterModule)
routes.use('/module/ads', AdvertisementModule)
routes.use('/module/message', messageModule)
routes.use('/module/notifications', notificationsModule)
routes.use('/module/payment', PaymentModule)
routes.use('/module/admin', AdminModule)
routes.use('/module/chat', ChatModule)
routes.use('/module/cms', CmsModule)
routes.use('/module/settings', SettingsModule)
routes.use('/module/templates', MailTemplateRoute)
routes.use('/module/theme', ThemeModule)
routes.use('/module/translation', TranslationModule)
routes.use('/module/calendar', IcalModule)
routes.use('/module/currency', CurrencyModule)
routes.use('/module/gallery',GalleryModule)
routes.use('/module/report',ReportListingModule)
routes.use('/module/reportUser', ReportUserModule)
routes.use('/module/wallet', payoutModule)
routes.use('/module/phonepe', phonepeModule)
routes.use('/module/:userType["admin","user"]',PrivilegeModule)


routes.route('/').get((req: Request, res: Response) => {
    return res.send("App is running and licensed!")
});

export default routes;
