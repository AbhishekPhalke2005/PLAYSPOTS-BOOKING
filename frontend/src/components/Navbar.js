import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                PCMC Turf
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/turfs"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Find Turfs
            </Link>
            <Link
              to="/matches"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Find Players
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-match"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Create Match
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  My Bookings
                </Link>
                {user?.role === 'owner' && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 flex items-center space-x-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/turfs"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Turfs
            </Link>
            <Link
              to="/matches"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Players
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-match"
                  className="block py-2 text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Match
                </Link>
                <Link
                  to="/my-bookings"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <div className="border-t pt-2">
                  <p className="text-sm text-gray-600">Logged in as {user?.name}</p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
