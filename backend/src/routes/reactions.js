const express = require('express');
const Reaction = require('../models/Reaction');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Add or update reaction
router.post('/:postId', auth, async (req, res) => {
  try {
    const { type } = req.body;
    const { postId } = req.params;

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check for existing reaction
    const existingReaction = await Reaction.findOne({
      userId: req.userId,
      postId
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction (toggle off)
        await Reaction.deleteOne({ _id: existingReaction._id });
        
        // Update post counts
        if (type === 'like') {
          post.likes = Math.max(0, post.likes - 1);
        } else {
          post.dislikes = Math.max(0, post.dislikes - 1);
        }
        await post.save();

        return res.json({
          message: 'Reaction removed',
          likes: post.likes,
          dislikes: post.dislikes,
          userReaction: null
        });
      } else {
        // Change reaction type
        const oldType = existingReaction.type;
        existingReaction.type = type;
        await existingReaction.save();

        // Update post counts
        if (oldType === 'like') {
          post.likes = Math.max(0, post.likes - 1);
          post.dislikes += 1;
        } else {
          post.dislikes = Math.max(0, post.dislikes - 1);
          post.likes += 1;
        }
        await post.save();

        return res.json({
          message: 'Reaction updated',
          likes: post.likes,
          dislikes: post.dislikes,
          userReaction: type
        });
      }
    } else {
      // Create new reaction
      const reaction = new Reaction({
        userId: req.userId,
        postId,
        type
      });
      await reaction.save();

      // Update post counts
      if (type === 'like') {
        post.likes += 1;
      } else {
        post.dislikes += 1;
      }
      await post.save();

      return res.json({
        message: 'Reaction added',
        likes: post.likes,
        dislikes: post.dislikes,
        userReaction: type
      });
    }
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reaction for a post
router.get('/:postId', auth, async (req, res) => {
  try {
    const reaction = await Reaction.findOne({
      userId: req.userId,
      postId: req.params.postId
    });

    res.json({
      reaction: reaction ? reaction.type : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
