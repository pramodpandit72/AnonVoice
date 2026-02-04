import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/helpers';
import api from '../utils/api';

const CommentsSection = ({ postId, onCommentAdded }) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/comments/post/${postId}`, {
        content: newComment.trim()
      });
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/comments/post/${postId}`, {
        content: replyContent.trim(),
        parentCommentId: commentId
      });
      
      // Add reply to the parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data.comment]
          };
        }
        return comment;
      }));
      
      setReplyContent('');
      setReplyingTo(null);
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error posting reply:', error);
      alert(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'}`}>
        <div className="flex justify-center py-4">
          <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'}`}>
      {/* Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className={`w-full p-3 rounded border text-sm resize-none focus:outline-none focus:border-orange-500 ${
              theme === 'dark'
                ? 'bg-[#272729] border-[#343536] text-[#d7dadc] placeholder-[#818384]'
                : 'bg-white border-[#edeff1] text-[#1c1c1c] placeholder-[#878a8c]'
            }`}
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                newComment.trim() && !submitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
          <a href="/login" className="text-orange-500 hover:underline">Log in</a> to comment
        </p>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group">
              {/* Main Comment */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-user-secret text-white text-xs"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                      {comment.author}
                    </span>
                    <span className={theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}>
                      • {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={`text-xs font-bold ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'} hover:underline`}
                      >
                        <i className="fa-solid fa-reply mr-1"></i>
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className={`w-full p-2 rounded border text-sm resize-none focus:outline-none focus:border-orange-500 ${
                          theme === 'dark'
                            ? 'bg-[#272729] border-[#343536] text-[#d7dadc] placeholder-[#818384]'
                            : 'bg-white border-[#edeff1] text-[#1c1c1c] placeholder-[#878a8c]'
                        }`}
                        rows={2}
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim() || submitting}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={`mt-3 pl-4 border-l-2 ${theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'}`}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2 mt-2">
                          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-user-secret text-white" style={{ fontSize: '8px' }}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`font-medium ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                                {reply.author}
                              </span>
                              <span className={theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}>
                                • {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
