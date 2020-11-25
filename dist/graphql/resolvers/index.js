"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postResolvers_1 = __importDefault(require("./postResolvers"));
const userResolvers_1 = __importDefault(require("./userResolvers"));
const commentResolvers_1 = __importDefault(require("./commentResolvers"));
const likeResolvers_1 = __importDefault(require("./likeResolvers"));
const chatResolvers_1 = __importDefault(require("./chatResolvers"));
exports.default = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: Object.assign(Object.assign(Object.assign({}, postResolvers_1.default.Query), userResolvers_1.default.Query), chatResolvers_1.default.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, userResolvers_1.default.Mutation), postResolvers_1.default.Mutation), commentResolvers_1.default.Mutation), likeResolvers_1.default.Mutation), chatResolvers_1.default.Mutation)
};
