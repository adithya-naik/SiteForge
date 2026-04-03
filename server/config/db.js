import mongoose from "mongoose"

const dbConnect = async ()=>{
  try {
    mongoose.connect(process.env.MONGO_URL)
    console.log("DB Connected")
  } catch (error) {
    console.log("DB Error")
  }
}

export default dbConnect;