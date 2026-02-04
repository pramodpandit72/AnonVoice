const express = require('express');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create report
router.post('/', auth, async (req, res) => {
  try {
    const { postId, commentId, reason, description } = req.body;

    if (!postId && !commentId) {
      return res.status(400).json({ message: 'Must specify post or comment to report' });
    }

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    const report = new Report({
      reporterId: req.userId,
      postId: postId || undefined,
      commentId: commentId || undefined,
      reason,
      description: description?.trim() || ''
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted. Thank you for helping keep the community safe.'
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
