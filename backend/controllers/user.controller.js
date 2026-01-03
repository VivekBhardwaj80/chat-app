import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js"

const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
        if(!userId){
            return res.status(404).json({success:false,message:"UserId not valid"})
        }
        const findCurrentUser = await User.findById(userId).select("-password")
        if(!findCurrentUser){
            return res.status(404).json({success:false,message:"User not access on this email"})
        }
        res.status(200).json({success:true,findCurrentUser})
    } catch (error) {
        res.status(500).json({success:false,message:"get Current User error",error:error.message})
    }
}

const editProfile = async(req,res)=>{
try {
    
    let {name} = req.body
    let image;
    if(req.file){
        image = await uploadOnCloudinary(req.file.path)
    }
    let user = await User.findByIdAndUpdate(req.userId,{
        name,image
    },{new:true})
    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }
    res.status(200).json({success:true,message:"edit successfully",user})
} catch (error) {
    res.status(500).json({success:false, message:"edit profile error",error:error.message})
    console.log(error.message);
    
}
}

const findOtherUsers = async(req,res)=>{
    try {
        let users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        res.status(200).json({success:true,users})
    } catch (error) {
        res.status(500).status({success:false,message:"findOtherUsers Error",error:error.message})
    }
}

const searchUser = async (req,res)=>{
    try {
        let {query} = req.query
        if(!query){
            return res.status(400).json({success:false,message:"Query is required"})
        }
        let user = await User.find({$or:[
            {name:{$regex:query,$options:"i"}},
            {userName:{$regex:query,$options:"i"}}
        ]})
        if(!user){
            return res.status(400).json({success:false,message:"User not find"})
        }
        res.status(200).json({success:true,search:user})

    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            success:false,
            message:"search User Problem",
            error:error.message
        })
    }
}

export {getCurrentUser, editProfile,findOtherUsers, searchUser}