import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logout, setAdmin, setUser } from "../store/authSlice";
import { ClipLoader } from "react-spinners";

const apiUrl = "mernstackbackend-production-86ac.up.railway.app";

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, user, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      checkUserStatus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        if (data.user.role === "admin") {
          dispatch(setAdmin(true));
        }
      } else {
        dispatch(setAdmin(false));
      }
    } catch (error) {
      console.error("Status check failed:", error);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        dispatch(logout());
        window.location.href = "/";
      }
    } catch (error) {
      console.log("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="bg-[#222d52] text-[#fdffff] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#fdffff] relative">
            TaskifyX
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#d2b68a] to-transparent"></span>
            </span>
          </Link>

         

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            
    

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 hover:bg-[#000000]/20 rounded-full transition-colors"
                >
                  {user?.image ? (
                    <img src={user.image} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-[#fdffff]" />
                  )}
                  <ChevronDown className="h-4 w-4 text-[#fdffff]" />
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#000000]/20 rounded-full transition-colors"
                  >
                    <User className="h-5 w-5 text-[#fdffff]" />
                    <span className="hidden md:inline text-[#fdffff]">Login</span>
                    <ChevronDown className="h-4 w-4 text-[#fdffff]" />
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#222d52] rounded-md shadow-lg py-1 z-50 border border-[#d2b68a]/20">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-[#fdffff] hover:bg-[#000000]/20"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-[#fdffff] hover:bg-[#000000]/20"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Logged In User Dropdown */}
              {showProfileDropdown && isLoggedIn && (
                <div className="absolute right-0 mt-2 w-48 bg-[#222d52] rounded-md shadow-lg py-1 z-50 border border-[#d2b68a]/20">
                  <div className="px-4 py-2 border-b border-[#d2b68a]/20">
                    <p className="text-sm font-medium text-[#fdffff]">{user?.username}</p>
                    <p className="text-xs text-[#eee5d9]">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-[#fdffff] hover:bg-[#000000]/20"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-[#fdffff] hover:bg-[#000000]/20"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logoutUser}
                    className="flex items-center justify-center px-4 py-2 text-[#eee5d9] hover:text-[#d2b68a] transition-colors duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader color="#d2b68a" size={20} />
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-[#000000]/20 rounded-full transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5 text-[#fdffff]" /> : <Menu className="h-5 w-5 text-[#fdffff]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-[#222d52] border-t border-[#d2b68a]/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
             
             
              
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-[#000000]/20 text-[#eee5d9]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
