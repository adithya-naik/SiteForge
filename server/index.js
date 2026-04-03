import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port,()=>{
  console.log(`Server Started at ${port}`);
  dbConnect();
})