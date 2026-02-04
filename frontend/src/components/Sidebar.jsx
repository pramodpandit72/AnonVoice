import { useTheme } from '../context/ThemeContext';
import { categories } from '../utils/helpers';

const Sidebar = ({ selectedCategory, onCategoryChange }) => {
  const { theme } = useTheme();

  const rules = [
    'Maintain anonymity - no personal info',
    'Be respectful - no hate speech',
    'No illegal content',
    'Report violations',
    'One account per person'
  ];

  return (
    <aside className="w-full space-y-4">
      {/* Categories Card */}
      <div className={`card p-4 ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
        <h3 className={`font-bold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
        }`}>
          <i className="fa-solid fa-layer-group text-orange-500"></i>
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-orange-500 text-white'
                  : theme === 'dark'
                    ? 'text-[#d7dadc] hover:bg-[#272729]'
                    : 'text-[#1c1c1c] hover:bg-[#f6f7f8]'
              }`}
            >
              <i className={`fa-solid ${cat.icon} w-4`}></i>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* About Card */}
      <div className={`card overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
        <div className="h-8 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <div className="p-4 -mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1a1a1b]">
              <i className="fa-solid fa-mask text-white text-lg"></i>
            </div>
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                AnonVoice
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
                a/anonymous
              </p>
            </div>
          </div>
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
            A safe space to express your opinions freely and anonymously. Your voice matters.
          </p>
          <div className={`flex justify-between text-sm py-2 border-t ${
            theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'
          }`}>
            <div className="text-center">
              <p className={`font-bold ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                <i className="fa-solid fa-users mr-1 text-orange-500"></i>
                Anonymous
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
                Members
              </p>
            </div>
            <div className="text-center">
              <p className={`font-bold ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
                <i className="fa-solid fa-circle text-green-500 text-xs mr-1"></i>
                Online
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
                Now
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Card */}
      <div className={`card p-4 ${theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
        <h3 className={`font-bold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
        }`}>
          <i className="fa-solid fa-shield-halved text-orange-500"></i>
          Community Rules
        </h3>
        <ol className="space-y-2">
          {rules.map((rule, index) => (
            <li 
              key={index}
              className={`flex items-start gap-2 text-sm ${
                theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
              }`}
            >
              <span className="font-bold text-orange-500 w-5">{index + 1}.</span>
              {rule}
            </li>
          ))}
        </ol>
      </div>

      {/* Footer */}
      <div className={`text-xs text-center py-4 ${
        theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'
      }`}>
        <p className="mb-2">
          <i className="fa-solid fa-shield-halved mr-1"></i>
          Privacy-first platform
        </p>
        <p>
          AnonVoice © 2026. Made with <i className="fa-solid fa-heart text-red-500"></i>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
