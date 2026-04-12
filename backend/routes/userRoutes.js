const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// 🔹 Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save avatar images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// GET current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET current user's posts
router.get("/me/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET USER POSTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update current user profile
router.put("/me", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const { name, username, email, password, bio, avatar: avatarUrl } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username: username,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email: email,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already taken" });
      }
    }

    const userUpdate = {
      name,
      username,
      email,
      bio
    };

    // Handle avatar upload or URL
    if (req.file) {
      userUpdate.avatar = `/uploads/${req.file.filename}`;
    } else if (avatarUrl) {
      userUpdate.avatar = avatarUrl;
    }

    if (password) {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      userUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      userUpdate,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN ROUTES

// GET all users (admin only)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT deactivate/activate user (admin only)
router.put("/:id/status", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    console.error("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;