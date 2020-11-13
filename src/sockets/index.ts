import app from '../app';

const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


io.on('connection',(socket:any) => {    
    let socketID = socket.id
    socket.on('join-user',(username:any) =>{
        socket.broadcast.emit('new-user',{socketID,username});
    });

});

export default server;