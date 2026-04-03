import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use("/api/auth",authRouter)

const startServer = async () => {
   try {
     await dbConnect();
    app.listen(port, () => {
       console.log(`Server Started at ${port}`);
     });
   } catch (error) {
     console.error("Startup failed:", error.message);
     process.exit(1);
   }
 };
 
startServer();