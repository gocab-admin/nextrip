import * as DotEnv from "dotenv";
import express from "express";
import logger from "morgan";
import * as bodyParser from 'body-parser';
import path from "path";
import mongoose from "mongoose";
import winston from "winston"
import expressWinston from "express-winston";
import userRoutes from "@abserve/Routes/Index";
import notFound from "./Middlewares/NotFoundMiddleware";
import errorHandlerMiddleware from "./Middlewares/ErrorHandlerMIddleware";
import { createDefaultAdmin, createDefaultCategory, createDefaultPrivilege } from './Seeder/Seeder'
import { licenseMiddleware } from "./Middlewares/licenseMiddleware";
import { I18n } from 'i18n'
import { Config } from "./Config/AppConfig";
let debugMode: any = false;

class App {
    public Express: express.Application;
    constructor() {
        this.setEnvironment();
        this.Express = express();
        this.middleware();
        this.database();
    }

    private database(): void {
        mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on('error', (error) => {
            console.log(error)
            process.exit();
        });
        mongoose.connection.once('open', async () => {
        console.log('✅ MongoDB connected');
        if (Config.createDefaultData === true) { 
            await createDefaultAdmin();
            await createDefaultCategory();
            await createDefaultPrivilege();
        }
        });
    }
    if(debugMode) {
        expressWinston.requestWhitelist.push("body");
        expressWinston.responseWhitelist.push("body");
        // express-winston logger makes sense BEFORE the router
        this.Express.use(
            expressWinston.logger({
                transports: [
                    new winston.transports.Console(
                        //     {
                        //     json: true,
                        //     colorize: true,
                        //   }
                    ),
                ],
            })
        );
    }

    private middleware(): void {
        this.Express.use(logger("dev"));
        this.Express.use(bodyParser.json());
        //this.Express.use(licenseMiddleware)
        this.Express.use(bodyParser.urlencoded({ extended: true }));
        const i18n = new I18n({
            locales: ['en', 'fr', 'es', 'ar', 'hi', 'id', 'ja', 'nl', 'pt', 'vi', 'zh'],
            directory: __dirname + '/public/locale/server'
        });
        this.Express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE,PATCH');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
            res.header('Access-Control-Expose-Headers', 'x-total-count');
            if (req.method === 'OPTIONS') {
                res.status(200).send();
            } else {
                next();
            }
        });
        this.Express.use('/public', express.static(path.join(__dirname, '/public')));
        this.Express.use('/locale', express.static(path.join(__dirname, '../locale')));  
        this.Express.use('/public', express.static(path.join(__dirname, '../public')));
        this.Express.use((req, res, next) => {
            const originalJson = res.json;
            res.json = function (body) {
                if (typeof body === 'object' && body.message)
                    body.message = res.__(body.message)
                return originalJson.call(this, body);
            };
            next();
        })
        this.Express.use((req, res, next) => {
            i18n.init(req,res)
            if(req.headers['accept-language'] && Config.locale.includes(req.headers['accept-language'])) {
                const lang = req.headers['accept-language'] ? req.headers['accept-language'] : 'en'
                req.setLocale(lang)
            } else {
                req.setLocale("en")    
            }
            next()
        })
        this.Express.use('', userRoutes);
        this.Express.use(notFound);
        this.Express.use(errorHandlerMiddleware);
    }   

    private setEnvironment(): void {
        DotEnv.config({ path: '.env' });
    }
}

export default App;
