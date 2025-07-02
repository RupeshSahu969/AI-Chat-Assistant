import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react or use Heroicons

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-800">3D Viewer</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Documentation
            </Link>
            <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Support
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-700">Hi, {currentUser.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 transition-all duration-200">
            <Link to="/dashboard" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="#" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">
              Documentation
            </Link>
            <Link to="#" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">
              Support
            </Link>
            {currentUser ? (
              <>
                <span className="block text-gray-700">Hi, {currentUser.username}</span>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="w-full text-left text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
