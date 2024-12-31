import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  Home, 
  Info, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  UserPlus,
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormsDropdownOpen, setIsFormsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFormsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavButton = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
    >
      {children}
    </Link>
  );

  const FormsDropdown = () => {
    const dropdownNavigate = useNavigate(); // Rename to avoid confusion
    
    const handleNavigation = (path) => {
      console.log('Navigation triggered to:', path);
      setIsFormsDropdownOpen(false);
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        console.log('Navigating to:', path);
        dropdownNavigate(path);
      }, 0);
    };
  
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsFormsDropdownOpen(!isFormsDropdownOpen)}
          className="px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          <Info size={18} />
          <span>Forms</span>
          <ChevronDown 
            size={16} 
            className={`transform transition-transform duration-200 ${
              isFormsDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
    
        {isFormsDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <div
              onClick={() => handleNavigation('/forms')}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Student Registration</span>
            </div>
            <div
              onClick={() => handleNavigation('/officer')}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              <ClipboardList size={16} />
              <span>Officer Form</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="/images/scoutslogo.png"
              alt="TNBSG Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wider">TNBSG</span>
              <span className="text-xs text-blue-200">Tamil Nadu Bharat Scouts & Guides</span>
            </div>
          </div>

          {/* Center Section - DateTime */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="bg-blue-800/50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Right Section - Navigation and Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center bg-blue-800/30 rounded-lg p-1">
              <NavButton to="/home">
                <Home size={18} />
                <span>Home</span>
              </NavButton>
              <FormsDropdown />
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-blue-700">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/home"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {/* Forms Section in Mobile Menu */}
            <div className="space-y-2">
              <div className="px-3 py-2 text-blue-200 font-medium flex items-center gap-2">
                <Info size={18} />
                <span>Forms</span>
              </div>
              <Link
                to="/forms"
                className="flex items-center gap-2 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus size={18} />
                <span>Student Registration</span>
              </Link>
              <Link
                to="/officer"
                className="flex items-center gap-2 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ClipboardList size={18} />
                <span>Officer Form</span>
              </Link>
            </div>

            <div className="px-3 py-2 rounded-lg bg-blue-800/30 flex items-center gap-2">
              <Clock size={18} className="text-blue-200" />
              <span className="text-sm">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;