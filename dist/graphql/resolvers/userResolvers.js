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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const validatorUser_1 = require("../../helpers/validatorUser");
const verifySignature_1 = __importDefault(require("../../utils/verifySignature"));
//Models
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    Query: {
        getUserbyID(_, { userid }) {
            return __awaiter(this, void 0, void 0, function* () {
                let userDB = yield User_1.default.findById(userid);
                return userDB;
            });
        },
    },
    Mutation: {
        verifyToken(_, { token }) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = yield jsonwebtoken_1.default.verify(token, config_1.default.SECRETKEY);
                return user;
            });
        },
        addFriend(_, { userid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                let userDB = yield User_1.default.findById(user.id);
                let friendToAdd = yield User_1.default.findById(userid);
                if (!userDB.friends)
                    userDB.friends = [{ userid, username: friendToAdd.username }];
                else
                    userDB.friends.push({ userid, username: friendToAdd.username });
                if (!friendToAdd.friends)
                    friendToAdd.friends = [{ userid: user.id, username: user.username }];
                else
                    friendToAdd.friends.push({ userid: user.id, username: user.username });
                yield userDB.save();
                yield friendToAdd.save();
                return 'Added';
            });
        },
        removeFriend(_, { userid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                let userDB = yield User_1.default.findById(user.id);
                let friendToRemove = yield User_1.default.findById(userid);
                //User of token
                let userReqId = user.id;
                if (!userDB.friends && !friendToRemove.friends)
                    return "Removed";
                userDB.friends = userDB.friends.filter(friend => friend.userid != userid);
                friendToRemove.friends = friendToRemove.friends.filter(friend => friend.userid != userReqId);
                yield userDB.save();
                yield friendToRemove.save();
                return 'Removed';
            });
        },
        getUsers(_, { username }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (username.trim().length === 0)
                    return new apollo_server_express_1.UserInputError('username must be not empty');
                let users = yield User_1.default.find({ username: { $regex: username } });
                return users;
            });
        },
        login(_, { email, password }) {
            return __awaiter(this, void 0, void 0, function* () {
                //Validate User data
                const { valid, errors } = validatorUser_1.validateLogin(email, password);
                if (!valid)
                    return new apollo_server_express_1.UserInputError('Wrong data', errors);
                //-----Make sure user exists already.
                const user = yield User_1.default.findOne({ email });
                if (!user)
                    return new apollo_server_express_1.UserInputError("Check your email and password"); //Wrong email.
                //-----Compare input password vs password in db.
                const match = yield bcryptjs_1.default.compare(password, user.password);
                if (!match)
                    return new apollo_server_express_1.UserInputError("Check your email and password"); //Wrong password.
                //-----Token
                const token = jsonwebtoken_1.default.sign({
                    id: user._id,
                    email: user.email,
                    username: user.username
                }, config_1.default.SECRETKEY, { expiresIn: '3d' });
                return {
                    id: user._id,
                    email: user.email,
                    chats: user.chats,
                    username: user.username,
                    createdAt: user.createdAt,
                    token,
                };
            });
        },
        register(parent, { registerInput: { username, password, email, birthday } }, context, info) {
            return __awaiter(this, void 0, void 0, function* () {
                //Validate User data
                const { valid, errors } = validatorUser_1.validateRegister(username, email, password);
                if (!valid)
                    return new apollo_server_express_1.UserInputError('Wrong data', errors);
                //-----Make sure user doesn't exists already.
                const user = yield User_1.default.findOne({ email });
                if (user)
                    return new apollo_server_express_1.UserInputError('User already in database', {
                        errors: {
                            email: 'email already in database'
                        }
                    });
                //-----Hash password and create an auth token.
                const hash = yield bcryptjs_1.default.hash(password, 12);
                const newUser = new User_1.default({
                    username,
                    password: hash,
                    email,
                    birthday,
                    createdAt: new Date().toISOString()
                });
                const res = yield newUser.save();
                const token = jsonwebtoken_1.default.sign({
                    id: res._id,
                    email: res.email,
                    username: res.username
                }, config_1.default.SECRETKEY, { expiresIn: '3d' });
                return {
                    id: res._id,
                    email: res.email,
                    birthday,
                    username: res.username,
                    createdAt: res.createdAt,
                    token,
                };
            });
        }
    }
};
