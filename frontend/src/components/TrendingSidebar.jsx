import { useTheme } from '../context/ThemeContext';

const TrendingSidebar = () => {
  const { theme } = useTheme();

  // Mock trending posts data
  const trendingPosts = [
    { id: 1, title: 'Government announces new education policy reforms', category: 'government', votes: 2547, comments: 342 },
    { id: 2, title: 'Anonymous users speak out about workplace issues', category: 'social', votes: 1893, comments: 256 },
    { id: 3, title: 'New privacy laws being discussed in parliament', category: 'politics', votes: 1654, comments: 189 },
    { id: 4, title: 'Students share their honest opinions on college fees', category: 'education', votes: 1432, comments: 167 },
    { id: 5, title: 'Local community raises concerns about infrastructure', category: 'general', votes: 987, comments: 98 },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      politics: 'bg-red-500',
      government: 'bg-blue-500',
      education: 'bg-green-500',
      social: 'bg-purple-500',
      general: 'bg-gray-500'
    };
    return colors[category] || colors.general;
  };

  return (
    <aside className="w-full space-y-4">
      {/* Trending Posts Card */}
      <div className={`rounded-lg border overflow-hidden ${
        theme === 'dark' ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-[#ccc]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
          <h3 className="font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-fire-flame-curved"></i>
            Trending Today
          </h3>
        </div>

        {/* Trending List */}
        <div className="divide-y divide-gray-200 dark:divide-[#343536]">
          {trendingPosts.map((post, index) => (
            <div
              key={post.id}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-[#272729]' : 'hover:bg-[#f6f7f8]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getCategoryColor(post.category)}`}></span>
                    <span className={`text-xs capitalize ${
                      theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  <p className={`text-sm font-medium line-clamp-2 ${
                    theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
                  }`}>
                    {post.title}
                  </p>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${
                    theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
                  }`}>
                    <span>
                      <i className="fa-solid fa-arrow-up mr-1"></i>
                      {post.votes.toLocaleString()}
                    </span>
                    <span>
                      <i className="fa-regular fa-comment mr-1"></i>
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className={`px-4 py-3 border-t ${
          theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'
        }`}>
          <button className="text-orange-500 text-sm font-bold hover:underline w-full text-center">
            View All Trending
          </button>
        </div>
      </div>

      {/* Top Communities */}
      <div className={`rounded-lg border overflow-hidden ${
        theme === 'dark' ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-[#ccc]'
      }`}>
        <div className={`px-4 py-3 border-b ${
          theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'
        }`}>
          <h3 className={`font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
          }`}>
            <i className="fa-solid fa-chart-line text-green-500"></i>
            Popular Topics
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {[
            { name: 'Government Policies', count: '12.5K', icon: 'fa-landmark', color: 'text-blue-500' },
            { name: 'Education System', count: '8.2K', icon: 'fa-graduation-cap', color: 'text-green-500' },
            { name: 'Social Issues', count: '6.8K', icon: 'fa-users', color: 'text-purple-500' },
            { name: 'Politics', count: '5.4K', icon: 'fa-building-columns', color: 'text-red-500' },
          ].map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${topic.icon} ${topic.color} w-5`}></i>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
                }`}>
                  {topic.name}
                </span>
              </div>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
              }`}>
                {topic.count} posts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`text-xs px-4 py-3 ${
        theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'
      }`}>
        <div className="flex flex-wrap gap-2 mb-3">
          <a href="#" className="hover:underline">About</a>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>•</span>
          <a href="#" className="hover:underline">Help</a>
        </div>
        <p>AnonVoice © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default TrendingSidebar;
