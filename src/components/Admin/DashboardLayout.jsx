

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDateRangeIcon,
  BellAlertIcon,
  UserIcon,
  BookmarkSquareIcon,
  ChevronDoubleDownIcon,
  CalendarIcon,
  
} from "@heroicons/react/24/outline";
import CustomerList from "./CustomerList";
import UserProfile from "./UserProfile";
import { useAuth } from '../../context/AuthContext';
import BookingbyAdminForm from "./BookingbyAdminForm";
import BookingCalendar from "./BookingCalendar";
import BookingManagement from "./BookingManagement";
import SlotManager from "./SlotManager";

const sidebarItems = [
  { name: "Booking", icon: CalendarDateRangeIcon, path: "/admin" },
  { name: "Profile", icon: UserIcon, path: "/admin/profile" },
  { name: "Customer Booking", icon: BookmarkSquareIcon, path: "/admin/booking/customer" },
  { name: "Customer Calender", icon: CalendarIcon, path: "/admin/booking/calender" },
  // { name: "Customer Slot", icon: BookmarkSquareIcon, path: "/admin/booking/slotmanager" }
];

export default function DashboardLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e) => {
    if (window.confirm("Are you sure you want to log out?")) {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error('Logout error:', err);
        setError("An error occurred during logout. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const renderPage = () => {
    switch (location.pathname) {
      case "/admin/booking":
        return <CustomerList />;
      case "/admin/profile":
        return <UserProfile />;
        case "/admin/booking/customer":
          return <BookingbyAdminForm/>;
          case "/admin/booking/calender":
            return <BookingManagement/>;
            case "/admin/booking/slotmanager":
              return <SlotManager/>;
      default:
        return <CustomerList />; // Default page
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">
            {/* Logo or Title */}
          </h1>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
                location.pathname === item.path
                  ? "bg-gray-800"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {sidebarItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center">
              {/* Notification Bell */}
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Notifications"
              >
                <BellAlertIcon className="h-6 w-6" />
              </button>

              {/* User Avatar and Dropdown */}
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    className="flex items-center bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    <UserIcon className="h-8 w-8 text-gray-400" />
                    <ChevronDoubleDownIcon className="ml-2 h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
