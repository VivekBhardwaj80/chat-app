import express from 'express'
import { getMessage, sendMessage } from '../controllers/message.controller.js'
import isAuth from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'

const messageRouter = express.Router()
messageRouter.post('/send/:receiver', isAuth,upload.single("image") ,sendMessage)
messageRouter.get('/get/:receiver',isAuth,getMessage)

export default messageRouter