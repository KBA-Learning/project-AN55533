import express, { json } from "express";
import { adminRoute } from "./routes/admin.route.js";
import {userRoute} from "./routes/user.route.js";
import mongoose from "mongoose";
import { authenticate } from "./Middleware/auth.route.js";
// import userRoute from "./routes/user.route.js";
// import packageRoute from "./routes/package.route.js";
// import ratingRoute from "./routes/rating.route.js";
// import bookingRoute from "./routes/booking.route.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

const app = express();
dotenv.config();


app.use(cors({
    origin:"http://127.0.0.1:5500" ,
    credentials:true
}));



app.use(json());
app.use(cookieParser());
app.use('/', adminRoute);
app.use('/',userRoute);



const port = process.env.port;


app.listen(port ,()=>{
    console.log('server running',port);
})