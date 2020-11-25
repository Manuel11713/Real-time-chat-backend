"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    URIMONGO: {
        ROUTE: process.env.URIMONGO || 'mongodb://localhost:27017/social-media-app'
    },
    SECRETKEY: process.env.SECRETKEY || 'some-secret'
};
exports.default = config;
