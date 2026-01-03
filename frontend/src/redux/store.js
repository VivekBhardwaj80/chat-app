import {configureStore} from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import  messageSlice  from './slice/messageSlice'

export const store = configureStore({
    reducer:{
        user:userSlice,
        message:messageSlice
    }
})