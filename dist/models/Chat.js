"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    members: [{
            userid: { type: mongoose_1.Schema.Types.ObjectId },
            username: { type: String }
        }],
    messages: [{
            sender_userid: { type: mongoose_1.Schema.Types.ObjectId },
            sender_username: { type: String },
            body_message: { type: String },
            createdAt: { type: String }
        }]
});
exports.default = mongoose_1.model('Chat', ChatSchema);
