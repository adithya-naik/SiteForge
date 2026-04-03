import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    require:true
  },
  email :{
    type :String,
    unique:true,
    require:true
  },
  avatar :{
    type : String
  },
  credits:{
    type:Number,
    default:100,
    min:0
  },
  plan:{
    type:String,
    enum:["free","pro","enterprise"],
    default:"free"
  }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User;