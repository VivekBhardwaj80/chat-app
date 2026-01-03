import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successfully');
    } catch (error) {
        console.log(`DB connection error ${error.message}`)
    }
}

export default connectDb