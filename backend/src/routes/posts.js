const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Reaction = require('../models/Reaction');
const { auth, optionalAuth } = require('../middleware/auth');
const profanityFilter = require('../middleware/profanityFilter');

const router = express.Router();

// Get all posts (feed) with pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (category && category !== 'all') {
      query.category = category;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'anonymousUsername')
      .populate({
        path: 'originalPostId',
        populate: { path: 'authorId', select: 'anonymousUsername' }
      });

    // Get user reactions if logged in
    let userReactions = {};
    if (req.userId) {
      const postIds = posts.map(p => p._id);
      const reactions = await Reaction.find({
        userId: req.userId,
        postId: { $in: postIds }
      });
      reactions.forEach(r => {
        userReactions[r.postId.toString()] = r.type;
      });
    }

    const total = await Post.countDocuments(query);

    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      author: post.authorId?.anonymousUsername || 'Anonymous',
      category: post.category,
      likes: post.likes,
      dislikes: post.dislikes,
      commentCount: post.commentCount,
      repostCount: post.repostCount,
      isRepost: post.isRepost,
      originalPost: post.originalPostId ? {
        id: post.originalPostId._id,
        content: post.originalPostId.content,
        author: post.originalPostId.authorId?.anonymousUsername || 'Anonymous'
      } : null,
      userReaction: userReactions[post._id.toString()] || null,
      createdAt: post.createdAt
    }));

    res.json({
      posts: formattedPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, profanityFilter, async (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ message: 'Content too long (max 5000 characters)' });
    }

    const post = new Post({
      content: content.trim(),
      authorId: req.userId,
      category: category || 'general'
    });

    await post.save();
    await post.populate('authorId', 'anonymousUsername');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        author: post.authorId.anonymousUsername,
        category: post.category,
        likes: post.likes,
        dislikes: post.dislikes,
        commentCount: post.commentCount,
        repostCount: post.repostCount,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'anonymousUsername')
      .populate({
        path: 'originalPostId',
        populate: { path: 'authorId', select: 'anonymousUsername' }
      });

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let userReaction = null;
    if (req.userId) {
      const reaction = await Reaction.findOne({
        userId: req.userId,
        postId: post._id
      });
      if (reaction) userReaction = reaction.type;
    }

    res.json({
      post: {
        id: post._id,
        content: post.content,
        author: post.authorId?.anonymousUsername || 'Anonymous',
        category: post.category,
        likes: post.likes,
        dislikes: post.dislikes,
        commentCount: post.commentCount,
        repostCount: post.repostCount,
        isRepost: post.isRepost,
        originalPost: post.originalPostId ? {
          id: post.originalPostId._id,
          content: post.originalPostId.content,
          author: post.originalPostId.authorId?.anonymousUsername || 'Anonymous'
        } : null,
        userReaction,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Repost
router.post('/:id/repost', auth, async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    
    if (!originalPost || originalPost.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create repost
    const repost = new Post({
      content: originalPost.content,
      authorId: req.userId,
      category: originalPost.category,
      isRepost: true,
      originalPostId: originalPost._id
    });

    await repost.save();

    // Increment repost count on original
    originalPost.repostCount += 1;
    await originalPost.save();

    await repost.populate('authorId', 'anonymousUsername');

    res.status(201).json({
      message: 'Reposted successfully',
      post: {
        id: repost._id,
        content: repost.content,
        author: repost.authorId.anonymousUsername,
        category: repost.category,
        isRepost: true,
        originalPostId: originalPost._id,
        createdAt: repost.createdAt
      }
    });
  } catch (error) {
    console.error('Repost error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.isDeleted = true;
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
