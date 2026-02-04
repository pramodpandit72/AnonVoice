import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import TrendingSidebar from '../components/TrendingSidebar';
import api from '../utils/api';

const Home = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('new');

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      // Only show loading spinner on initial load, not on category switch
      if (posts.length === 0) {
        setLoading(true);
      }
      const response = await api.get('/posts', {
        params: {
          page: pageNum,
          limit: 20,
          category: selectedCategory === 'all' ? undefined : selectedCategory
        }
      });

      if (reset) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      
      setHasMore(pageNum < response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, posts.length]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [selectedCategory, fetchPosts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="flex gap-6">
        {/* Left Sidebar - Categories & About */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-16">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        {/* Main Content - Posts Feed */}
        <main className="flex-1 min-w-0 max-w-2xl">
          {/* Create Post Card */}
          <div className={`rounded-lg border p-3 mb-4 flex items-center gap-3 ${
            theme === 'dark' ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-[#ccc]'
          }`}>
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-user-secret text-white"></i>
            </div>
            <Link
              to={isAuthenticated ? '/create' : '/login'}
              className={`flex-1 px-4 py-2.5 rounded-md border text-sm transition-all ${
                theme === 'dark'
                  ? 'bg-[#272729] border-[#343536] text-[#818384] hover:border-[#d7dadc] hover:bg-[#1a1a1b]'
                  : 'bg-[#f6f7f8] border-[#edeff1] text-[#878a8c] hover:border-[#0079d3] hover:bg-white'
              }`}
            >
              Create Post
            </Link>
            <button
              className={`p-2.5 rounded-md transition-colors ${
                theme === 'dark' ? 'hover:bg-[#272729]' : 'hover:bg-[#f6f7f8]'
              }`}
            >
              <i className={`fa-solid fa-image text-xl ${
                theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
              }`}></i>
            </button>
            <button
              className={`p-2.5 rounded-md transition-colors ${
                theme === 'dark' ? 'hover:bg-[#272729]' : 'hover:bg-[#f6f7f8]'
              }`}
            >
              <i className={`fa-solid fa-link text-xl ${
                theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
              }`}></i>
            </button>
          </div>

          {/* Sort Options */}
          <div className={`rounded-lg border p-2 mb-4 flex items-center gap-1 ${
            theme === 'dark' ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-[#ccc]'
          }`}>
            {[
              { value: 'new', label: 'New', icon: 'fa-clock' },
              { value: 'hot', label: 'Hot', icon: 'fa-fire' },
              { value: 'top', label: 'Top', icon: 'fa-arrow-up' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  sortBy === option.value
                    ? theme === 'dark' 
                      ? 'bg-[#272729] text-orange-500' 
                      : 'bg-[#f6f7f8] text-orange-500'
                    : theme === 'dark'
                      ? 'text-[#818384] hover:bg-[#272729]'
                      : 'text-[#878a8c] hover:bg-[#f6f7f8]'
                }`}
              >
                <i className={`fa-solid ${option.icon}`}></i>
                {option.label}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {loading && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <i className="fa-solid fa-spinner fa-spin text-5xl text-orange-500 mb-4"></i>
              <p className={`text-lg ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
                Loading posts...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className={`rounded-lg border p-12 text-center ${
              theme === 'dark' ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-[#ccc]'
            }`}>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-pen-to-square text-white text-3xl"></i>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
              }`}>
                No posts yet
              </h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
                Be the first to share your thoughts anonymously!
              </p>
              <Link
                to={isAuthenticated ? '/create' : '/login'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
                Create First Post
              </Link>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {loading && (
                <div className="flex justify-center py-4">
                  <i className="fa-solid fa-spinner fa-spin text-2xl text-orange-500"></i>
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'
                }`}>
                  <i className="fa-solid fa-check-circle text-green-500 text-2xl mb-2"></i>
                  <p className="font-medium">You've seen all posts!</p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Right Sidebar - Trending */}
        <aside className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-16">
            <TrendingSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
