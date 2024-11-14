import {Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { authenticate } from '../Middleware/auth.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const adminRoute=Router();
// const secretKey = "hello";
const secretKey=process.env.SecretKey;

// Define User Schema
const adminSchema= new mongoose.Schema(
    {
         username: { type: String, required: true },
         email: { type: String, required: true, unique: true },
         password: { type: String, required: true },
         address: { type: String, required: true },
         phone: { type: String, required: true },
         userRole: { type: String }
    }
    )
const User=mongoose.model('admindetails',adminSchema); 


// const bookingSchema = new mongoose.Schema(
//   {
//     packageDetails: {
//       type:String ,
      
//       required: true,
//     },
//     buyer: {
//       type:String ,
      
//       required: true,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     persons: {
//       type: Number,
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       default: "Booked",
//     },
//   },
//   { timestamps: true }
// );

// const Booking = mongoose.model("Booking", bookingSchema);


const packageSchema = new mongoose.Schema({
  packageName: String,
  packageDescription: String,
  packageDestination: String,
  packageDays: Number,
  packageNights: Number,
  packageAccommodation: String,
  packageTransportation: String,
  packageMeals: String,
  packageActivities: String,
  packagePrice: Number,
  packageDiscountPrice: Number,
  packageOffer: Boolean

});


 export const Package = mongoose.model('Package', packageSchema);


mongoose.connect('mongodb://localhost:27017/Travel_accommadation')

adminRoute.get('/',(req,res)=>{
    res.send("Hello World");
})
 

 
 adminRoute.post('/adminsignup',async(req,res)=>{
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

 adminRoute.post('/adminlogin',async(req,res)=>{
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

adminRoute.post('/create-package', authenticate, async (req, res) => {
    const userRole = req.UserRole; // Use a more descriptive variable name
    console.log(userRole);

    const {
        packageName,
        packageDescription,
        packageDestination,
        packageDays,
        packageNights,
        packageAccommodation,
        packageTransportation,
        packageMeals,
        packageActivities,
        packagePrice,
        packageDiscountPrice,
        packageOffer
    } = req.body;

    try {
        if (userRole === "admin") {
           
            const existingPackage = await Package.findOne({ packageName });

            if (existingPackage) {
                return res.status(400).json({ message: "Package already exists" });
            }

            const newPackage = new Package({
                packageName,
                packageDescription,
                packageDestination,
                packageDays,
                packageNights,
                packageAccommodation,
                packageTransportation,
                packageMeals,
                packageActivities,
                packagePrice,
                packageDiscountPrice,
                packageOffer
            });

            
            await newPackage.save();

            return res.status(201).json({ message: 'Package created successfully', package: newPackage });
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.error("Error creating package:", error);
        return res.status(500).json({ message: "An error occurred while creating the package. Please check the details." });
    }
});






adminRoute.patch('/update-package', authenticate, async (req, res) => {
    const userRole = req.UserRole; // Use a more descriptive variable name
    console.log(userRole);
  const {
        packageName,
        newpackageDescription,
        newpackageDestination,
        newpackageDays,
        newpackageNights,
        newpackageAccommodation,
        newpackageTransportation,
        newpackageMeals,
        newpackageActivities,
        newpackagePrice,
        newpackageDiscountPrice,
        newpackageOffer } = req.body;

    try {
      
        if (userRole === "admin") {
           
            const result = await Package.updateOne(
                { PackageName: packageName },
                {
                    $set: {
                        PackageDescription:newpackageDescription,
                        PackageDestination: newpackageDestination,
                        PackageDays: newpackageDays,
                        packageNights:newpackageNights,
                        PackageAccommodation:newpackageAccommodation,
                        PackageTransportation:newpackageTransportation,
                        PackageMeals:newpackageMeals,
                        PackageActivities:newpackageActivities,
                        PackagePrice:newpackagePrice,
                        PackageDiscountPrice:newpackageDiscountPrice,
                        packageOffer:newpackageOffer
                    }
                }
            );

           

            res.status(201).json({ message: "Package Details Updated" });
        } else {
            res.status(400).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        // Error handling for any unexpected issues
        res.status(400).json({ message: "Check the Package Details" });
    }
});



// adminRoute.delete("/delete-package/:id", requireSignIn, isAdmin, deletePackage); {
  

// }


//  adminRoute.get('/get-packages',async(req,res)=>{
//     try{
//    const search= req.query.packageName; 
//    console.log(search);
//         const result = await Package.findOne({packageName:search})
//         console.log(result)
//         if (result) {

        
//             res.status(200).json(result);
//         }
//         else {
//             res.status(404).json({ message: "No Package found,Check the Package" })
//         }
//     }
//     catch (error) {
//         res.status(400).json({ message: "Check the input" })
//     }
//  })




// adminRoute.get("/get-package-data/:id",authenticate,(req,res)=>{
  

//    console.log(req.params.name); 
//  })
 
adminRoute.post('/book-package', authenticate, async (req, res) => {
  try {
    const { packageName, buyer, totalPrice, persons, date } = req.body;
      if (!packageName || !buyer || !totalPrice || !persons || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // const com = data.packageName;
    // Ensure the user can only book a package for themselves
  

    // Check if all required fields are provided
    // if (!packageName || !buyer || !totalPrice || !persons || !date) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required!",
    //   });
    // }

    // Validate if the package exists
    const validPackage = await Package.findOne({ packageName });

    if (!validPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }
    else // Create a new booking if the package is found
    {
      const newBooking = new Booking({
      buyer,
      totalPrice,
      persons,
      date,
       // Link the package to the booking
      });
    await newBooking.save();
    }

    

  

    // if (newBooking) {
    //   return res.status(201).json({
    //     success: true,
    //     message: "Package booked successfully!",
    //     booking: newBooking
    //   });
    // } else {
    //   return res.status(500).json({
    //     success: false,
    //     message: "Failed to book the package. Please try again.",
    //   });
    // }
   // Return success response
    return res.status(201).json({
      success: true,
      message: "Package booked successfully!",
      booking: newBooking
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

export { adminRoute };
  

// export default {adminRoute,userLogin};
 
