import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB =async ()=>{
    try {
        mongoose.set("strictQuery", false);
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.log("Error connecting to database",error);
        process.exit(1);
    }
}