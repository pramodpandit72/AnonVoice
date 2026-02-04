import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={`sticky top-0 z-40 h-12 flex items-center px-4 border-b ${
      theme === 'dark' 
        ? 'bg-[#1a1a1b] border-[#343536]' 
        : 'bg-white border-[#ccc]'
    }`}>
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-mask text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl hidden sm:block">
            <span className="text-orange-500">Anon</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Voice</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
            theme === 'dark'
              ? 'bg-[#272729] border-[#343536] hover:border-[#d7dadc]'
              : 'bg-[#f6f7f8] border-[#f6f7f8] hover:border-[#0079d3]'
          }`}>
            <i className={`fa-solid fa-search text-sm ${
              theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
            }`}></i>
            <input
              type="text"
              placeholder="Search AnonVoice"
              className={`bg-transparent outline-none w-full text-sm ${
                theme === 'dark' ? 'placeholder-[#818384]' : 'placeholder-[#878a8c]'
              }`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-10 ${
              theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'}`}></i>
          </button>

          {isAuthenticated ? (
            <>
              {/* Create Post */}
              <Link
                to="/create"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                  theme === 'dark'
                    ? 'border-[#343536] hover:bg-[#272729]'
                    : 'border-[#0079d3] text-[#0079d3] hover:bg-[#f6f7f8]'
                }`}
              >
                <i className="fa-solid fa-plus text-sm"></i>
                <span className="text-sm font-medium">Create</span>
              </Link>

              {/* User Menu */}
              <div className="relative group">
                <button className={`flex items-center gap-2 px-2 py-1 rounded border ${
                  theme === 'dark'
                    ? 'border-[#343536] hover:border-[#d7dadc]'
                    : 'border-[#ccc] hover:border-[#878a8c]'
                }`}>
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-user-secret text-white text-xs"></i>
                  </div>
                  <span className={`text-xs font-medium hidden md:block ${
                    theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
                  }`}>
                    {user?.anonymousUsername || 'Anonymous'}
                  </span>
                  <i className={`fa-solid fa-chevron-down text-xs ${
                    theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'
                  }`}></i>
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                  theme === 'dark'
                    ? 'bg-[#272729] border-[#343536]'
                    : 'bg-white border-[#ccc]'
                }`}>
                  <div className={`px-4 py-2 border-b ${
                    theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'
                  }`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'}`}>
                      Logged in as
                    </p>
                    <p className="text-sm font-medium truncate">
                      {user?.anonymousUsername}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      theme === 'dark'
                        ? 'hover:bg-[#1a1a1b] text-[#d7dadc]'
                        : 'hover:bg-[#f6f7f8] text-[#1c1c1c]'
                    }`}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-[#d7dadc] text-[#d7dadc] hover:bg-[#d7dadc] hover:text-[#1a1a1b]'
                    : 'border-[#0079d3] text-[#0079d3] hover:bg-[#0079d3] hover:text-white'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
