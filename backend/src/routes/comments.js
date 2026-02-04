const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { auth, optionalAuth } = require('../middleware/auth');
const profanityFilter = require('../middleware/profanityFilter');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      postId: req.params.postId,
      isDeleted: false,
      parentCommentId: null // Only get top-level comments
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'anonymousUsername');

    // Get replies for each comment
    const commentIds = comments.map(c => c._id);
    const replies = await Comment.find({
      parentCommentId: { $in: commentIds },
      isDeleted: false
    })
      .sort({ createdAt: 1 })
      .populate('authorId', 'anonymousUsername');

    const repliesByParent = {};
    replies.forEach(reply => {
      const parentId = reply.parentCommentId.toString();
      if (!repliesByParent[parentId]) {
        repliesByParent[parentId] = [];
      }
      repliesByParent[parentId].push({
        id: reply._id,
        content: reply.content,
        author: reply.authorId?.anonymousUsername || 'Anonymous',
        likes: reply.likes,
        createdAt: reply.createdAt
      });
    });

    const total = await Comment.countDocuments({
      postId: req.params.postId,
      isDeleted: false,
      parentCommentId: null
    });

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      author: comment.authorId?.anonymousUsername || 'Anonymous',
      likes: comment.likes,
      createdAt: comment.createdAt,
      replies: repliesByParent[comment._id.toString()] || []
    }));

    res.json({
      comments: formattedComments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/post/:postId', auth, profanityFilter, async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Validate parent comment if replying
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment || parentComment.isDeleted) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      content: content.trim(),
      authorId: req.userId,
      postId: req.params.postId,
      parentCommentId: parentCommentId || null
    });

    await comment.save();

    // Update post comment count
    post.commentCount += 1;
    await post.save();

    await comment.populate('authorId', 'anonymousUsername');

    res.status(201).json({
      message: 'Comment added',
      comment: {
        id: comment._id,
        content: comment.content,
        author: comment.authorId.anonymousUsername,
        likes: comment.likes,
        createdAt: comment.createdAt,
        replies: []
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.isDeleted = true;
    await comment.save();

    // Update post comment count
    const post = await Post.findById(comment.postId);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await post.save();
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
