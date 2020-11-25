"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifySignature_1 = __importDefault(require("../../utils/verifySignature"));
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../../models/User"));
const Chat_1 = __importDefault(require("../../models/Chat"));
exports.default = {
    Query: {},
    Mutation: {
        getChat(_, { chatid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                return yield Chat_1.default.findById(chatid);
            });
        },
        createChat(_, { partnerid, partnername }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                user = (yield User_1.default.findById(user.id));
                let partner = yield User_1.default.findById(partnerid);
                let members = [
                    {
                        userid: user.id,
                        username: user.username
                    },
                    {
                        userid: partnerid,
                        username: partnername
                    }
                ];
                let newChat = new Chat_1.default({
                    members,
                    messages: []
                });
                let chatSaved = yield newChat.save();
                if (user.chats) {
                    user.chats.push({
                        chatid: chatSaved._id,
                        partnerid,
                        partnername
                    });
                }
                else {
                    user.chats = [{
                            chatid: chatSaved._id,
                            partnerid,
                            partnername
                        }];
                }
                yield user.save();
                if (partner.chats) {
                    partner.chats.push({
                        chatid: chatSaved._id,
                        partnerid: user._id,
                        partnername: user.username
                    });
                }
                else {
                    partner.chats = [{
                            chatid: chatSaved._id,
                            partnerid: user._id,
                            partnername: user.username
                        }];
                }
                yield partner.save();
                return chatSaved;
            });
        },
        sendMessage(_, { chatid, bodyMessage }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                let chat = yield Chat_1.default.findById(chatid);
                let newMessage = {
                    sender_userid: user.id,
                    sender_username: user.username,
                    body_message: bodyMessage,
                    createdAt: new Date().toISOString()
                };
                chat.messages.unshift(newMessage);
                yield chat.save();
                return chat.messages[0];
            });
        }
    }
};
