const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware"); // adjust path if needed

// GET /api/users — return all users except current one
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select("username _id");
    res.json({ users });
  } catch (err) {
    console.error("Error loading users:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

module.exports = router;
