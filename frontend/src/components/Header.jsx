import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/facilities", label: "Facilities" },
    { path: "/programs", label: "Programs" },
    { path: "/news", label: "News" },
    { path: "/gallery", label: "Gallery" },
    { path: "/projects", label: "Projects" },
  ];

  const adminNavItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/programs", label: "Programs" },
    { path: "/admin/gallery", label: "Gallery" },
    { path: "/admin/projects", label: "Projects" },
    { path: "/admin/staff", label: "Staff Management" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors"
              onClick={closeMobileMenu}
            >
              CENTRE FOR EMPOWERMENT OF WOMEN
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons / Profile Menu */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                    {user?.name?.[0] || "A"}
                  </div>
                  <span className="hidden md:inline text-sm">
                    {user?.name || "Admin"}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>

                    {/* Admin Links */}
                    <div className="px-2 py-2 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 px-2 py-1">
                        Admin
                      </p>
                      {adminNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-none"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            text={
              isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )
            }
          />
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-base font-medium transition-colors rounded-lg ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-3 bg-blue-50 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-gray-600 px-3">
                        Admin
                      </p>
                      {adminNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg block"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 border border-red-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      onClick={closeMobileMenu}
                    >
                      <LogIn className="w-4 h-4" />
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
