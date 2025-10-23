const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// protected route example:
router.get('/messages', verifyToken, (req, res) => {
  // req.user.userId is available now
  res.json({ message: `Hello user ${req.user.userId}, here are your messages.` });
});

module.exports = router;
