"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const server = require('http').createServer(app_1.default);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    let socketID = socket.id;
    socket.on('join-user', (username) => {
        socket.broadcast.emit('new-user', { socketID, username });
    });
});
exports.default = server;
