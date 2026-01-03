import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import messageRouter from './routes/message.route.js'
import { app, server } from './socket/socket.js'


const port = process.env.PORT || 5000


// middleware
app.use(cors({
    origin:"https://chat-app-lh2w.onrender.com",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/message',messageRouter)

server.listen(port, ()=>{connectDb(),console.log(`server is running on ${port} port`)})
