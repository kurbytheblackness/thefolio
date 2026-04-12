require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolioDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

// ✅ SERVER (LAST lagi)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// note: postRoutes already mounted once above
// app.use("/api/posts", require("./routes/postRoutes"));