import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo, formatNumber, copyToClipboard, getShareUrl } from '../utils/helpers';
import api from '../utils/api';
import ReportModal from './ReportModal';
import CommentsSection from './CommentsSection';

const PostCard = ({ post, onUpdate }) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [localPost, setLocalPost] = useState(post);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      alert('Please login to react to posts');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await api.post(`/reactions/${localPost.id}`, { type });
      setLocalPost(prev => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
        userReaction: response.data.userReaction
      }));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepost = async () => {
    if (!isAuthenticated) {
      alert('Please login to repost');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await api.post(`/posts/${localPost.id}/repost`);
      setLocalPost(prev => ({
        ...prev,
        repostCount: prev.repostCount + 1
      }));
      alert('Reposted successfully!');
    } catch (error) {
      console.error('Repost error:', error);
      alert('Failed to repost');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = getShareUrl(localPost.id);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const voteScore = localPost.likes - localPost.dislikes;

  return (
    <>
      <article className={`card mb-2 hover:border-[#898989] ${
        theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'
      }`}>
        <div className="flex">
          {/* Vote Section */}
          <div className={`w-10 flex flex-col items-center py-2 rounded-l ${
            theme === 'dark' ? 'bg-[#161617]' : 'bg-[#f8f9fa]'
          }`}>
            <button
              onClick={() => handleReaction('like')}
              disabled={isLoading}
              className={`vote-btn ${localPost.userReaction === 'like' ? 'active-like' : ''}`}
              title="Upvote"
            >
              <i className={`fa-solid fa-arrow-up ${
                localPost.userReaction === 'like' 
                  ? 'text-orange-500' 
                  : theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
              }`}></i>
            </button>
            <span className={`text-xs font-bold my-1 ${
              voteScore > 0 ? 'text-orange-500' : 
              voteScore < 0 ? 'text-blue-500' :
              theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
            }`}>
              {formatNumber(voteScore)}
            </span>
            <button
              onClick={() => handleReaction('dislike')}
              disabled={isLoading}
              className={`vote-btn ${localPost.userReaction === 'dislike' ? 'active-dislike' : ''}`}
              title="Downvote"
            >
              <i className={`fa-solid fa-arrow-down ${
                localPost.userReaction === 'dislike' 
                  ? 'text-blue-500' 
                  : theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
              }`}></i>
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-2">
            {/* Post Header */}
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className={`category-pill category-${localPost.category}`}>
                {localPost.category}
              </span>
              <span className={theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}>
                Posted by
              </span>
              <span className={`font-medium ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                <i className="fa-solid fa-user-secret mr-1"></i>
                {localPost.author}
              </span>
              <span className={theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}>
                • {formatTimeAgo(localPost.createdAt)}
              </span>
              {localPost.isRepost && (
                <span className="text-orange-500">
                  <i className="fa-solid fa-retweet mr-1"></i>
                  Repost
                </span>
              )}
            </div>

            {/* Original Post Reference (for reposts) */}
            {localPost.isRepost && localPost.originalPost && (
              <div className={`mb-2 p-2 rounded border-l-4 border-orange-500 ${
                theme === 'dark' ? 'bg-[#272729]' : 'bg-[#f6f7f8]'
              }`}>
                <p className="text-xs text-[#818384] mb-1">
                  <i className="fa-solid fa-quote-left mr-1"></i>
                  Originally by {localPost.originalPost.author}
                </p>
              </div>
            )}

            {/* Post Content */}
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
              theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
            }`}>
              {localPost.content}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <button
                onClick={() => setShowComments(!showComments)}
                className="action-btn"
              >
                <i className="fa-regular fa-comment"></i>
                <span>{formatNumber(localPost.commentCount)} Comments</span>
              </button>

              <button onClick={handleShare} className="action-btn">
                <i className="fa-solid fa-share"></i>
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button onClick={handleRepost} className="action-btn" disabled={isLoading}>
                <i className="fa-solid fa-retweet"></i>
                <span>Repost ({formatNumber(localPost.repostCount)})</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="action-btn"
              >
                <i className="fa-regular fa-flag"></i>
                <span>Report</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <CommentsSection 
                postId={localPost.id} 
                onCommentAdded={() => {
                  setLocalPost(prev => ({
                    ...prev,
                    commentCount: prev.commentCount + 1
                  }));
                }}
              />
            )}
          </div>
        </div>
      </article>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          postId={localPost.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
};

export default PostCard;
