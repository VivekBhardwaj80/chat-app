import jwt from 'jsonwebtoken'
const isAuth = async(req,res,next)=>{
    try {
        let token = req.cookies.token;
        
        if(!token){
            return res.status(400).json({success:false,message:"Unauthorized User"})
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!verifyToken){
            return res.status(400).json({success:false,message:"Unauthorized User"})
        }
        req.userId = verifyToken.id
        next()
    } catch (error) {
        console.log((error.message));
        res.status(500).json({success:false,message:"isAuth Error"})
    }
}

export default isAuth