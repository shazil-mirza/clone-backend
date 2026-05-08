import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import { app } from "./app.js";
dotenv.config({
    path: "./.env"
});
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error starting the server",error);
        throw error;
    });
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error)=>{
    console.log("Error connecting to database",error);
})