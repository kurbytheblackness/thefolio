const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // ✅ ADD THIS
const User = require("../models/User");

// ✅ LOGIN (FIXED)
// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const lookupTerm = (email || "").trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: lookupTerm },
        { username: lookupTerm }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found. Please check your email/username or register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 CREATE TOKEN
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // ✅ ADD ROLE HERE
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server error: JWT_SECRET is not set" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, dob } = req.body;

    const existingUser = await User.findOne({ email: (email || "").trim().toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email: (email || "").trim().toLowerCase(),
      password: hashedPassword,
      dob
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

});

// TEMPORARY ROUTE: Make user admin (remove after use)
router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: (email || "").trim().toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User promoted to admin", user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error("MAKE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;