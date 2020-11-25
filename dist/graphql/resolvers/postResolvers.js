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
const apollo_server_express_1 = require("apollo-server-express");
const Post_1 = __importDefault(require("../../models/Post"));
const verifySignature_1 = __importDefault(require("../../utils/verifySignature"));
exports.default = {
    Query: {
        getPost(_, { postid }) {
            return __awaiter(this, void 0, void 0, function* () {
                let post = yield Post_1.default.findById(postid);
                if (!post)
                    return new apollo_server_express_1.UserInputError('post not found');
                return post;
            });
        },
    },
    Mutation: {
        getPosts(_, { userid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                const posts = yield Post_1.default.find({ userid }).sort({ createdAt: -1 });
                return posts;
            });
        },
        createPost(_, { body }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                const newPost = new Post_1.default({
                    body,
                    userid: user.id,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                });
                let post = yield newPost.save();
                return post;
            });
        },
        deletePost(_, { postid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                const post = yield Post_1.default.findById(postid);
                if (!post)
                    return new apollo_server_express_1.UserInputError('Wrong post id');
                //Just post owner can delete his post.
                if (post.userid != user.id)
                    return new apollo_server_express_1.UserInputError('Action not allowed');
                yield post.remove();
                return "Post removed";
            });
        }
    }
};
