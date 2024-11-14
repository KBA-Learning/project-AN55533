import {Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Package } from './admin.route.js';

import { authenticate } from '../Middleware/auth.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const userRoute=Router();
const secretKey=process.env.SecretKey;


const userSchema= new mongoose.Schema(
    {
         username: { type: String, required: true },
         email: { type: String, required: true, unique: true },
         password: { type: String, required: true },
         address: { type: String, required: true },
         phone: { type: String, required: true },
         userRole: { type: String }
    }
    )
const User = mongoose.model('Userdetails', userSchema); 



userRoute.post('/usersignup',async(req,res)=>{
     try{
      

        const { Username, Email, Password,Address,Phone,UserRole } = req.body;
        // const data1= JSON.parse(data);
        console.log(Username);
        const newPassword = await bcrypt.hash(Password, 10)

        console.log(newPassword);
        const existingUser=await User.findOne({userName:Username})
        if (existingUser) {
            res.status(400).json({ message: "Username already exist" });
        }
        else {
             // Create a new user
       const newUser = new User({
        username: Username,
        email: Email,
        password: newPassword,
        address: Address,
        phone: Phone,
        userRole:UserRole
      });
       // Save user to MongoDB
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
           
        }
    }
 
    
    catch (error) {
        res.status(500).json(error);
    }
 
 })


 userRoute.post('/userlogin',async(req,res)=>{
    const { Email, Password } = req.body;
        const result = await User.findOne({email:Email})
        console.log(result);


        if (!result) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            console.log(Password);
            console.log(result.password);


            const isvalid =await bcrypt.compare(Password,result.password);
            console.log(isvalid);
            if(isvalid){
               const token= jwt.sign({Email:result.email,UserRole:result.userRole},secretKey,{expiresIn:'1h'})
               console.log(token);
               res.cookie('authToken',token,{
                httpOnly:true,
                
               });
             res.status(200).json({token});
            }
        }

 })

 

userRoute.get('/get-packages', async (req, res) => {
  try {
    const packages = await Package.find();
    if (packages.length > 0) {
      return res.status(200).json(packages);
    } else {
      return res.status(404).json({ message: "No packages found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});


export { userRoute };