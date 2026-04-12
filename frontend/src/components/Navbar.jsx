import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600" onClick={closeMenu}>
          🛒 CampusCart
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              {/* ✅ Make name clickable → goes to profile */}
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-gray-500 hover:text-blue-600 transition"
              >
                Hi, {user.name.split(" ")[0]} 👋
              </button>

              <Link
                to="/add-listing"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                + Sell
              </Link>

              <Link
                to="/my-listings"
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
              >
                My Listings
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-md animate-[slideDown_0.2s_ease-out]">
          {user ? (
            <>
              <button
                onClick={() => { navigate("/profile"); closeMenu(); }}
                className="block w-full text-left text-sm text-gray-500 hover:text-blue-600 pb-2 border-b border-gray-100 transition"
              >
                Hi, {user.name.split(" ")[0]} 👋
              </button>

              <Link
                to="/add-listing"
                onClick={closeMenu}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
              >
                + Sell Item
              </Link>

              <Link
                to="/my-listings"
                onClick={closeMenu}
                className="block text-sm text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              >
                📋 My Listings
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm text-red-500 hover:text-red-600 font-medium py-2 transition"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-sm text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;