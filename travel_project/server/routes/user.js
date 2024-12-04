import { json, Router } from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middleware/authMiddleware.js";

const user = Router();


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  userType: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);


const bookingSchema = new mongoose.Schema({
  
  buyername: {
    type: String,
    required: true,
  },
 
  persons: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

user.post("/register", async (req, res) => {
  try {
    const { username, password, email, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = new User({ username, password: hashedPassword, email, userType });
    await User.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
user.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed - User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed - Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.cookie("Authtoken", token);
    res.json({ status: true, message: "Login successful", userType: user.userType });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});






user.post("/booking", verifyToken, async (req, res) => {
  try {
    const { packageId } = req.params;
    const {  buyername,persons, date } = req.body;

    if (!buyername ||  !persons || !date) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

 

    // Create booking object
    const bookingData = {
      
      buyername ,
      persons,
      date,
    };

    // Save booking to database
    const newBooking = await Booking.create(bookingData);

    if (newBooking) {
      return res.status(201).send({
        success: true,
        message: "Package booked successfully!",
        booking: newBooking,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong during booking!",
      });
    }
  } catch (error) {
    console.error("Error in booking route:", error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
});



user.get("/viewbooking", async (req, res) => {
  try {
    const allbooking = await Booking.find({});
    if (allbooking.length > 0) {
      res.status(200).json(allbooking);
    } else {
      res.status(404).json({ message: "No booking added" });
    }
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});



user.get("/logout", (req, res) => {
  res.clearCookie("Authtoken");
  res.status(200).send("Logout successful");
  return res;
});

export { user };