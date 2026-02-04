import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { theme } = useTheme();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-8 ${
      theme === 'dark' ? 'bg-[#030303]' : 'bg-[#fafbfc]'
    }`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fa-solid fa-user-plus text-white text-3xl"></i>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Create Account
          </h1>
          <p className={theme === 'dark' ? 'text-[#818384]' : 'text-gray-500'}>
            Join the anonymous community today
          </p>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl p-8 shadow-lg ${
          theme === 'dark' 
            ? 'bg-[#1a1a1b]' 
            : 'bg-white'
        }`}>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-[#d7dadc]' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <i className={`fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-[#818384]' : 'text-gray-400'
                }`}></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border text-sm transition-all focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-[#272729] border-[#343536] text-white placeholder-[#818384] focus:border-purple-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-[#d7dadc]' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <i className={`fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-[#818384]' : 'text-gray-400'
                }`}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border text-sm transition-all focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-[#272729] border-[#343536] text-white placeholder-[#818384] focus:border-purple-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-[#818384] hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-[#d7dadc]' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <i className={`fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-[#818384]' : 'text-gray-400'
                }`}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border text-sm transition-all focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-[#272729] border-[#343536] text-white placeholder-[#818384] focus:border-purple-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-500 rounded"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-[#818384]' : 'text-gray-500'}`}>
                  I agree to the{' '}
                  <a href="#" className="text-purple-500 hover:underline font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-500 hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all mt-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#343536]' : 'bg-gray-200'}`}></div>
            <span className={`text-sm ${theme === 'dark' ? 'text-[#818384]' : 'text-gray-400'}`}>or</span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#343536]' : 'bg-gray-200'}`}></div>
          </div>

          <div className="mt-6 text-center">
            <p className={theme === 'dark' ? 'text-[#818384]' : 'text-gray-500'}>
              Already have an account?{' '}
              <Link to="/login" className="text-purple-500 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
