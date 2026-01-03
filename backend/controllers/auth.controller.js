import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import emailValidator from 'email-validator'

const signUp = async(req,res)=>{
try {
    const {userName,email,password} = req.body
    if(!userName || !email || !password){
        return res.status(404).json({success:false,message:"All field are required"})
    }
    const checkUserByUserName = await User.findOne({userName})
    if(checkUserByUserName){
        return res.status(400).json({success:false,message:"UserName Already exist"})
    }
    if(!emailValidator.validate(email)){
        return res.status(404).json({success:false,message:"please provide a valid email"})
    }
    const checkUserByEmail = await User.findOne({email})
    if(checkUserByEmail){
        return res.status(400).json({success:false,message:"Email Already exist"})
    }
    if(password.length<6){
        return res.status(400).json({success:false,message:"Password must be at least 6 Characters"})
    }
    const hashPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        userName,email,password:hashPassword
    })
    const token = genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:true
    })

    res.status(201).json({success:true,message:"User Created",user})
} catch (error) {
    res.status(500).json({success:false,message:"Sign Up Error",error:error.message})
}
}

const login = async(req,res)=>{
try {
    const {email,password} = req.body
    
    if(!email || !password){
        return res.status(404).json({success:false,message:"All field are required"})
    }
    
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({success:false,message:"User does not exist"})
    }
    if(password.length<6){
        return res.status(400).json({success:false,message:"Password must be at least 6 Characters"})
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(404).json({success:false,message:"Incorrect Password"})
    }
    const token = genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:true
    })

    res.status(200).json({success:true,message:"User successfully Login",user})
} catch (error) {
    res.status(500).json({success:false,message:"Sign Up Error",error:error.message})
}
}

const logout = async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({success:true,message:"Logout Successfully"})

    } catch (error) {
        res.status(500).json({success:false,message:`logout error ${error.message}`})
    }
}

export {signUp,login,logout}
