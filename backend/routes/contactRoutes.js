const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// POST create contact message (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("CREATE CONTACT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all contact messages (admin only)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("GET CONTACTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT mark contact as read (admin only)
router.put("/:id/read", authMiddleware, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    contact.isRead = true;
    await contact.save();

    res.json({ message: "Message marked as read" });
  } catch (err) {
    console.error("MARK READ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE contact message (admin only)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    await contact.deleteOne();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;