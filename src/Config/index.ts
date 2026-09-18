"use strict";
let __createBinding;
__createBinding = (this && __createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
let __setModuleDefault;
__setModuleDefault = (this && __setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
let __importStar;
__importStar = (this && __importStar) || function (mod) {
    if (mod?.__esModule) return mod;
    let result = {};
    if (mod != null) for (let k in mod) if (k !== "default" && Object.hasOwn(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
let dotenv = __importStar(require("dotenv"));
let general = require('./general.json');
dotenv.config({ path: '.env' });
let normalizeToString = function (val) {
    let returnString = (typeof val === 'string') ? val : val.toString();
    return returnString;
};
let normalizeToNumber = function (val) {
    let returnNumber = (typeof val === 'number') ? val : val.toString();
    return returnNumber;
};
let exportValues = {
    baseURL: general.baseURL,
    baseURL1:general.baseURL1,
    database: general.database,
    phoneCode: normalizeToString(general.phoneCode),
    gmt: general.gmt,
    utcOffset: general.utcOffset,
    utcOffsetSub: general.utcOffsetSub,
    jwtSecret: process.env.APPLICATION_SECRET,
    appLanguages: general.appLanguages,
    appServices: general.appServices,
    resentCounterSecs: normalizeToNumber(general.resentCounterSecs),
    userLoginType: general.userLoginType,
    providerLoginType: general.providerLoginType,
    orientation: general.orientation,
    appServicesSettings: general.appServicesSettings,
    otpValidityMinutes: general.otpValidityMinutes
};
module.exports = exportValues;
