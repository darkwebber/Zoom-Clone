const express = require('express');
const ejs = require('ejs');
const {v4 : uuidv4} = require('uuid');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(httpServer,{debug:true});
const io = new Server(httpServer);
app.set('view engine','ejs');
app.use(express.static("public"));
app.use("/peerjs",peerServer);
app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});
app.get("/:room",(req,res)=>{
    res.render("room",{roomId : req.params.room});
});
io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(userId+" #1");
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
    });
    socket.on('user-lost',(userId)=>{
        console.log(userId+" #2");
    });
    socket.on('message',(message,roomId)=>{
        socket.to(roomId).emit('recieve',message); 
    });
});


httpServer.listen(process.env.PORT||2000,()=>{
    console.log("Server Served Up");
});