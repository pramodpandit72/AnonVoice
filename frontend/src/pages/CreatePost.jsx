import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { categories } from '../utils/helpers';

const CreatePost = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please write something to post');
      return;
    }

    if (content.length > 5000) {
      setError('Post is too long (max 5000 characters)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/posts', {
        content: content.trim(),
        category
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`card p-8 text-center ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
          <i className="fa-solid fa-lock text-4xl text-orange-500 mb-4"></i>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
            Login Required
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
            You need to be logged in to create a post.
          </p>
          <a href="/login" className="btn-primary inline-block">
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className={`card ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'}`}>
          <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
            <i className="fa-solid fa-pen-to-square text-orange-500 mr-2"></i>
            Create Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded text-red-500 text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
            }`}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.value !== 'all').map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-orange-500 text-white'
                      : theme === 'dark'
                        ? 'bg-[#272729] text-[#d7dadc] hover:bg-[#343536]'
                        : 'bg-[#f6f7f8] text-[#1c1c1c] hover:bg-[#edeff1]'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon}`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
            }`}>
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts anonymously..."
              className={`w-full p-4 rounded-lg border text-sm resize-none focus:outline-none focus:border-orange-500 min-h-[200px] ${
                theme === 'dark'
                  ? 'bg-[#272729] border-[#343536] text-[#d7dadc] placeholder-[#818384]'
                  : 'bg-white border-[#edeff1] text-[#1c1c1c] placeholder-[#878a8c]'
              }`}
              maxLength={5000}
            />
            <div className={`flex justify-between mt-1 text-xs ${
              theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'
            }`}>
              <span>
                <i className="fa-solid fa-info-circle mr-1"></i>
                Your identity is protected. Post anonymously.
              </span>
              <span className={content.length > 4500 ? 'text-orange-500' : ''}>
                {content.length}/5000
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                theme === 'dark'
                  ? 'text-[#d7dadc] hover:bg-[#272729]'
                  : 'text-[#1c1c1c] hover:bg-[#f6f7f8]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className={`px-6 py-2 rounded-full text-sm font-bold ${
                content.trim() && !submitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Posting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Card */}
      <div className={`card p-4 mt-4 ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
        <h3 className={`font-bold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
        }`}>
          <i className="fa-solid fa-lightbulb text-yellow-500"></i>
          Tips for a great post
        </h3>
        <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
          <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Be specific and provide context</li>
          <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Choose the right category</li>
          <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Keep it respectful and constructive</li>
          <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Avoid sharing personal information</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;
