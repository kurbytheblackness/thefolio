const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

const { authMiddleware, isAdmin } = require("../middleware/auth");
// CREATE POST

// 🔹 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      userId: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await newPost.save();
    res.json(newPost);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
    .populate("userId", "username")
    .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post or is admin
    if (post.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.title = title || post.title;
    post.content = content || post.content;

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();

    res.json(post);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // 🔥 FIX: ensure likes array exists
    if (!post.likes) {
      post.likes = [];
    }

    // 🔁 TOGGLE LIKE
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);

  } catch (err) {
    console.error("LIKE ERROR:", err); // 👈 add this
    res.status(500).json({ message: "Server error" });
  }
});

// 💬 ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId: req.user.id,
      text
    };

    post.comments.push(newComment);
    await post.save();

    // 🔹 Populate username only for the new comment
    const populatedComment = await Post.findById(post._id)
      .populate({
        path: "comments.userId",
        select: "username"
      });

    // 🔹 Return the last comment (the one we just added)
    const commentToReturn = populatedComment.comments[populatedComment.comments.length - 1];

    res.json(commentToReturn);

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 💬 GET comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments.userId", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);

  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 💬 DELETE comment
router.delete("/:postId/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only admin or comment owner can delete
    const commentUserId = comment.userId?._id ? comment.userId._id : comment.userId;

    if (!commentUserId) {
      console.error("DELETE COMMENT ERROR: comment.userId missing", { postId, commentId, comment });
      return res.status(500).json({ message: "Comment owner data missing" });
    }

    if (req.user.role !== "admin" && commentUserId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // 🔥 FIX: use pull() instead of remove() for subdocuments
    post.comments.pull(commentId);
    await post.save();

    res.json({ message: "Comment deleted", commentId });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;