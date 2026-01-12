import 'dotenv/config';

import mongoose from "mongoose";

export async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to mongoDB");

    }
    catch(err){
        console.log("failed to connect to mongoDB",err);
        
    }
}