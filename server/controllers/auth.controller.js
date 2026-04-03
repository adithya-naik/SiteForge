import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const googleAuth = async (req,res)=>{
  try {
    const {name,email,avatar} = req.body
    
    if(!email){
      return res.status(400).json({
        message : "Email is required"
      })
    }

    let user = await User.findOne({email})
    if(!user){
      user = await User.create({name,email,avatar})
    }

    const token = jwt.sign({id:user._id},process.env.JWTSECRET,{expiresIn:"7d"})
    
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      // secure:true,
      sameSite:"strict",
      // sameSite:"none",
      maxAge:7*24*60*60*1000
    })

    return res.status(200).json({
      user
    })

  } catch (error) {
    return res.status(500).json({
      message : `Google Auth Error : ${error}`
    })
  }
}

export const logOut = async (req,res)=>{
  try {
    return res.clearCookie("token",{
      httpOnly:true,
      secure:false,
      // secure:true,
      sameSite:"strict",
      // sameSite:"none",
    })
  } catch (error) {
    return res.status(500).json({
      message : `Logout Error : ${error}`
    })
  }
}