import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

const uploadOnCloudinary = async(filePath)=>{
    
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log("Cloudinary error",error.message)
    }
}

export default uploadOnCloudinary