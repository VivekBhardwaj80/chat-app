import express from 'express'
import { editProfile, findOtherUsers, getCurrentUser, searchUser } from '../controllers/user.controller.js'
import isAuth from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.get('/current', isAuth ,getCurrentUser)
userRouter.put('/update-profile', isAuth,upload.single("image") ,editProfile)
userRouter.get('/allUsers',isAuth,findOtherUsers)
userRouter.get('/search',isAuth,searchUser)

export default userRouter