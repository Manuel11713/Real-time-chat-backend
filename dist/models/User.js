"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthday: { type: String },
    friends: [{
            userid: { type: mongoose_1.Schema.Types.ObjectId },
            username: { type: String }
        }],
    chats: [{
            chatid: { type: String },
            partnerid: { type: mongoose_1.Schema.Types.ObjectId },
            partnername: { type: String }
        }],
    email: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
});
exports.default = mongoose_1.model('User', userSchema);
