const jwt = require("jsonwebtoken");

// ✅ VERIFY TOKEN
const authMiddleware = (req, res, next) => {
  (async () => {
    try {
      const authHeader = req.header("Authorization");
      console.log("AUTH HEADER:", req.headers.authorization);

      if (!authHeader) {
        return res.status(401).json({ message: "No token, access denied" });
      }

      // 🔥 Extract token from "Bearer TOKEN"
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid Authorization format" });
      }

      const token = parts[1];

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server error: JWT_SECRET is not configured" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // contains id + role
      console.log("DECODED USER:", decoded);

      // Check if user is active
      const User = require("../models/User");
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  })();
};

// ✅ ADMIN CHECK
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  next();
};

module.exports = { authMiddleware, isAdmin };