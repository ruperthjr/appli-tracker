import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightStartOnRectangleIcon,
  TrashIcon,
  QueueListIcon,
  ArrowUpRightIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { openDeleteModal } = useModal();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleDeleteAccount = () => {
    openDeleteModal();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold tracking-tight text-[#0a66c2] drop-shadow"
          >
            <HomeIcon className="w-6 h-6 mb-1 mr-1" />
          </Link>
          <Link
            to="/reviews"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <QueueListIcon className="w-4 h-4 inline mb-1 mr-1" />
            Public Reviews
          </Link>
          {isAuthenticated() ? (
            <div className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              <Link to="/dashboard">
                <ChartBarIcon className="w-4 h-4 inline mb-1 mr-1" />
                Dashboard
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center gap-6 space-x-2 sm:space-x-3">
          {isAuthenticated() ? (
            <>
              {/* <button>
                resume
                <ArrowUpOnSquareIcon className="w-4 h-4 inline mb-1 ml-1" />
              </button> */}
              <div className="relative user-menu">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white h-11 px-4 rounded-full focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircleIcon className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.firstName}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-60 px-1 py-1 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-lg rounded-2xl overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors rounded-t-2xl">
                          <p className="text-sm font-semibold text-white truncate">
                            Profile
                            <ArrowUpRightIcon className="w-4 h-4 inline mb-1 ml-1" />
                          </p>
                          <p className="text-xs text-white/70 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                      </Link>

                      <div className="py-1 mt-1 space-y-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center font-semibold gap-3 w-full px-4 py-2 text-sm text-white/90 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <ArrowRightStartOnRectangleIcon className="w-4 h-4" />{" "}
                          Logout
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-3 w-full px-4 py-2 font-semibold text-sm text-red-400 hover:bg-red-500/15 rounded-xl transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="h-11 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold flex items-center justify-center transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="h-11 px-4 bg-[#0a66c2] hover:bg-[#004182] text-slate-900 font-semibold rounded-full flex items-center justify-center transition-colors"
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
