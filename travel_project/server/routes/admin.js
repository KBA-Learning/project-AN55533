import { Router } from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const admin = Router();

// Serve static files
admin.use("/Images", express.static(path.join(__dirname, "public/Images")));


// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/Images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// MongoDB Connection
mongoose
  .connect("mongodb://mongodb:27017/TRAVELSYSTEM")

  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Schemas and Models
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  userType: { type: String, required: true },
});
const Admin = mongoose.model("Admin", adminSchema);

const packageSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    packageDescription: { type: String, required: true },
    packageDestination: { type: String, required: true },
    packageDays: { type: Number, required: true },
    packageNights: { type: Number, required: true },
    packageAccommodation: { type: String, required: true },
    packageTransportation: { type: String, required: true },
    packagePrice: { type: Number, required: true },

    imageUrl: { type: String },
  },
  { timestamps: true }
);
const Package = mongoose.model("Package", packageSchema);

admin.post("/register", async (req, res) => {


  const { username, password, email } = req.body;

  console.log(username, password, email);

  try {

    let userType = 'admin';
    const empty = await Admin.find();

    if (empty.length > 0) {
      userType = 'user'
    } else {
      userType = 'admin'
    }

    console.log(userType);


    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword, email, userType });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

admin.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    if (!user) return res.status(401).json({ error: "Authentication failed - User does not exist" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Authentication failed - Incorrect password" });

    const token = jwt.sign({ userId: user._id, userType: user.userType }, "your-secret-key", { expiresIn: "1h" });

    res.cookie("Authtoken", token);
    res.json({ status: true, message: "Login successful", userType: user.userType });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

admin.post("/AddPackages", verifyToken, upload.single("packageImage"), async (req, res) => {
  try {
    if (req.userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packagePrice,

    } = req.body;

    const newPackage = new Package({
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packagePrice,
      imageUrl: `/Images/${req.file.filename}`, // Store image path
    });

    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ message: "Failed to add package" });
  }
});


admin.get("/viewpackage", async (req, res) => {
  try {
    const allPackages = await Package.find({});
    if (allPackages.length > 0) {
      res.status(200).json(allPackages);
    } else {
      res.status(404).json({ message: "No packages added" });
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});



admin.patch("/updatepackage/:id", verifyToken, async (req, res) => {
  const packageId = req.params.id;
  const {
    packageName,
    packageDescription,
    packageDestination,
    packageDays,
    packageNights,
    packageAccommodation,
    packageTransportation,
    packagePrice,
  } = req.body;

  // Ensure the user has admin privileges
  if (req.userType !== "admin") {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }

  try {
    // Validate package ID format
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: "Invalid package ID format" });
    }

    // Validate required fields
    if (!packageName || !packageDescription || !packageDestination || !packageAccommodation || !packageTransportation) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // Validate days and nights
    if (packageDays <= 0 || packageNights <= 0) {
      return res.status(400).json({ success: false, message: "Provide valid days and nights!" });
    }

    // Perform the update
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        packageName,
        packageDescription,
        packageDestination,
        packageDays,
        packageNights,
        packageAccommodation,
        packageTransportation,
        packagePrice,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate fields during update
      }
    );

    // Check if the package was found and updated
    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);

    // Return detailed error messages for validation failures
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Error updating package",
      error: error.message,
    });
  }
});




admin.delete("/deletepackage/:id", verifyToken, async (req, res) => {
  const packageId = req.params.id; // Change variable name for clarity
  try {
    if (req.userType === "admin") {
      const result = await Package.findOneAndDelete({ _id: packageId }); // Query by _id
      if (!result) {
        return res.status(404).json({ message: "Package not found" }); // Respond with JSON
      }
      res.json({ message: "Package deleted successfully" }); // Respond with JSON
    } else {
      res.status(403).json({ message: "Unauthorized" }); // Ensure unauthorized access is handled
    }
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package" }); // Respond with JSON
  }
});

admin.get("/user", verifyToken, async (req, res) => {
  try {
    const username = req.username; // Username from token
    const user = await admin.find({ username }); // Fetch user details from the database

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, username: user.username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});





admin.get("/logout", verifyToken, (req, res) => {
  try {
    res.clearCookie("Authtoken", { path: "/" }); 
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("An error occurred during logout");
  }
});




export { admin };
