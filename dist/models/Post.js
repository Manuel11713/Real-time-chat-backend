"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    body: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: String, required: true },
    userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
            userid: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }
    ],
    likes: [{
            username: String,
            createdAt: String,
            userid: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }]
});
exports.default = mongoose_1.model('Post', postSchema);
