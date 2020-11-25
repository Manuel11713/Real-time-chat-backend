"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const verifySignature = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer')[1].trim();
        if (token) {
            try {
                const user = jsonwebtoken_1.default.verify(token, config_1.default.SECRETKEY);
                return user;
            }
            catch (_a) {
                return null;
            }
        }
        else
            return null;
    }
    else
        return null;
};
exports.default = verifySignature;
