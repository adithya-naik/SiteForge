import mongoose from 'mongoose';

const dbConnect = async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB Connected');
  } catch (error) {
    console.log(`DB Error ${error}`);
  }
};

export default dbConnect;