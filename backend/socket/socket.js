import http from 'http'
import express from 'express'
import { Server } from 'socket.io'


const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"https://chat-app-lh2w.onrender.com",
    }
})

const userSocketMap={}
export const getReceiverSocketId=(receiver)=>{
    return userSocketMap[receiver]
}
io.on("connection",(socket)=>{
    const userId = socket.handshake.query?.userId
    if (!userId) return;
    if(userId!==undefined){
        userSocketMap[userId]=socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
delete userSocketMap[userId]
io.emit("getOnlineUser",Object.keys(userSocketMap))
    })  
})

export {app, server, io}
