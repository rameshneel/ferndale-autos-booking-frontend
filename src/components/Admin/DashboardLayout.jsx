import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Bookmark, Calendar, ChevronDown } from "lucide-react";
import CustomerList from "./CustomerList";
import BookingbyAdminForm from "./BookingbyAdminForm";
import BookingManagement from "./BookingManagement";
import SlotManager from "./SlotManager";
import UserProfile from "./UserProfile";
import { logout } from "../../services/api";
import logo from "../../assets/logo-dark.png";

const sidebarItems = [
  { name: "Booking", icon: Calendar, path: "/admin" },
  { name: "Customer Booking", icon: Bookmark, path: "/admin/booking/customer" },
  {
    name: "Customer Calendar",
    icon: Calendar,
    path: "/admin/booking/calender",
  },
];

const DashboardLayout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e) => {
    if (window.confirm("Are you sure you want to log out?")) {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout error:", err);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const renderPage = () => {
    switch (location.pathname) {
      case "/admin":
        return <CustomerList />;
      case "/admin/booking/customer":
        return <BookingbyAdminForm />;
      case "/admin/booking/calender":
        return <BookingManagement />;
      case "/admin/booking/slotmanager":
        return <SlotManager />;
      default:
        return <CustomerList />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans text-gray-200">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 shadow-xl"
      >
        <div className="p-6">
          <h1 className="text-2xl font-semibold tracking-wide text-teal-400">
            <img src={logo} alt="logo" />
          </h1>
        </div>
        <nav className="mt-8 space-y-2 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-teal-300"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl truncate">
              {sidebarItems.find((item) => item.path === location.pathname)
                ?.name || "Dashboard"}
            </h2>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 text-gray-400 hover:text-teal-400 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
              </motion.button>
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-400 focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="h-8 w-8 text-gray-400" />
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-gray-700 ring-1 ring-gray-600"
                    >
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-teal-300"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-teal-300"
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
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">{renderPage()}</div>
        </main>
      </div>

      {/* UserProfile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setIsProfileModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <UserProfile onClose={() => setIsProfileModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Bell, User, Bookmark, Calendar, ChevronDown } from "lucide-react";
// import CustomerList from "./CustomerList";
// import BookingbyAdminForm from "./BookingbyAdminForm";
// import BookingManagement from "./BookingManagement";
// import SlotManager from "./SlotManager";
// import UserProfile from "./UserProfile";
// import { logout } from "../../services/api";

// const sidebarItems = [
//   { name: "Booking", icon: Calendar, path: "/admin" },
//   { name: "Customer Booking", icon: Bookmark, path: "/admin/booking/customer" },
//   {
//     name: "Customer Calendar",
//     icon: Calendar,
//     path: "/admin/booking/calender",
//   },
// ];

// const DashboardLayout = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async (e) => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       e.preventDefault();
//       setError("");
//       setLoading(true);
//       try {
//         await logout();
//         navigate("/login");
//       } catch (err) {
//         console.error("Logout error:", err);
//         setError("An error occurred during logout. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsProfileOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isProfileOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isProfileOpen]);

//   const renderPage = () => {
//     switch (location.pathname) {
//       case "/admin":
//         return <CustomerList />;
//       case "/admin/booking/customer":
//         return <BookingbyAdminForm />;
//       case "/admin/booking/calender":
//         return <BookingManagement />;
//       case "/admin/booking/slotmanager":
//         return <SlotManager />;
//       default:
//         return <CustomerList />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-sans">
//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: -250 }}
//         animate={{ x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl"
//       >
//         <div className="p-6">
//           <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
//         </div>
//         <nav className="mt-8 space-y-2 px-3">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
//                 location.pathname === item.path
//                   ? "bg-gray-700 text-white shadow-md"
//                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
//               }`}
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               <span className="text-sm font-medium">{item.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </motion.div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl truncate">
//               {sidebarItems.find((item) => item.path === location.pathname)
//                 ?.name || "Dashboard"}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 aria-label="Notifications"
//               >
//                 <Bell className="h-6 w-6" />
//               </motion.button>
//               <div className="relative" ref={dropdownRef}>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   className="flex items-center space-x-2 text-gray-700 focus:outline-none"
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 >
//                   <User className="h-8 w-8 text-gray-600" />
//                   <ChevronDown className="h-5 w-5 text-gray-600" />
//                 </motion.button>
//                 <AnimatePresence>
//                   {isProfileOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200"
//                     >
//                       <button
//                         onClick={() => {
//                           setIsProfileModalOpen(true);
//                           setIsProfileOpen(false);
//                         }}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Profile
//                       </button>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto bg-gray-50">
//           <div className="container mx-auto px-6 py-8">{renderPage()}</div>
//         </main>
//       </div>

//       {/* UserProfile Modal */}
//       <AnimatePresence>
//         {isProfileModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={() => setIsProfileModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 50 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 50 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <UserProfile onClose={() => setIsProfileModalOpen(false)} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default DashboardLayout;

// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Bell, User, Bookmark, Calendar, ChevronDown } from "lucide-react";
// import CustomerList from "./CustomerList";
// import UserProfile from "./UserProfile";
// import BookingbyAdminForm from "./BookingbyAdminForm";
// import BookingManagement from "./BookingManagement";
// import SlotManager from "./SlotManager";
// import { logout } from "../../services/api";

// const sidebarItems = [
//   { name: "Booking", icon: Calendar, path: "/admin" },
//   { name: "Profile", icon: User, path: "/admin/profile" },
//   {
//     name: "Customer Booking",
//     icon: Bookmark,
//     path: "/admin/booking/customer",
//   },
//   {
//     name: "Customer Calendar",
//     icon: Calendar,
//     path: "/admin/booking/calender",
//   },
// ];

// export default function DashboardLayout() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async (e) => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       e.preventDefault();
//       setError("");
//       setLoading(true);

//       try {
//         await logout();
//         navigate("/login");
//       } catch (err) {
//         console.error("Logout error:", err);
//         setError("An error occurred during logout. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsProfileOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isProfileOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isProfileOpen]);

//   const renderPage = () => {
//     switch (location.pathname) {
//       case "/admin/booking":
//         return <CustomerList />;
//       case "/admin/profile":
//         return <UserProfile />;
//       case "/admin/booking/customer":
//         return <BookingbyAdminForm />;
//       case "/admin/booking/calender":
//         return <BookingManagement />;
//       case "/admin/booking/slotmanager":
//         return <SlotManager />;
//       default:
//         return <CustomerList />; // Default page
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white">
//         <div className="p-6">
//           <h1 className="text-2xl font-medium">Dashboard</h1>
//         </div>
//         <nav className="mt-8">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`flex items-center px-4 py-3 mt-2 rounded-md ${
//                 location.pathname === item.path
//                   ? "bg-gray-700"
//                   : "hover:bg-gray-600"
//               } text-gray-100`}
//             >
//               <item.icon className="w-6 h-6 mr-3" />
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
//             <h2 className="text-2xl font-medium text-gray-900 sm:text-3xl sm:truncate">
//               {sidebarItems.find((item) => item.path === location.pathname)
//                 ?.name || "Dashboard"}
//             </h2>
//             <div className="flex items-center space-x-4">
//               {/* Notification Bell */}
//               <button
//                 className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
//                 aria-label="Notifications"
//               >
//                 <Bell className="h-6 w-6" />
//               </button>

//               {/* User Avatar and Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   className="flex items-center bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   aria-haspopup="true"
//                   aria-expanded={isProfileOpen}
//                 >
//                   <User className="h-8 w-8 text-gray-600" />
//                   <ChevronDown className="ml-2 h-5 w-5 text-gray-600" />
//                 </button>
//                 <AnimatePresence>
//                   {isProfileOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5"
//                     >
//                       <Link
//                         to="/admin/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Edit Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
//           <div className="container mx-auto px-6 py-8">{renderPage()}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CalendarDateRangeIcon,
//   BellAlertIcon,
//   UserIcon,
//   BookmarkSquareIcon,
//   ChevronDoubleDownIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline";
// import CustomerList from "./CustomerList";
// import UserProfile from "./UserProfile";
// import BookingbyAdminForm from "./BookingbyAdminForm";
// import BookingManagement from "./BookingManagement";
// import SlotManager from "./SlotManager";
// import { logout } from "../../services/api";

// const sidebarItems = [
//   { name: "Booking", icon: CalendarDateRangeIcon, path: "/admin" },
//   { name: "Profile", icon: UserIcon, path: "/admin/profile" },
//   {
//     name: "Customer Booking",
//     icon: BookmarkSquareIcon,
//     path: "/admin/booking/customer",
//   },
//   {
//     name: "Customer Calender",
//     icon: CalendarIcon,
//     path: "/admin/booking/calender",
//   },
// ];

// export default function DashboardLayout() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async (e) => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       e.preventDefault();
//       setError("");
//       setLoading(true);

//       try {
//         await logout();
//         navigate("/login");
//       } catch (err) {
//         console.error("Logout error:", err);
//         setError("An error occurred during logout. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsProfileOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isProfileOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isProfileOpen]);

//   const renderPage = () => {
//     switch (location.pathname) {
//       case "/admin/booking":
//         return <CustomerList />;
//       case "/admin/profile":
//         return <UserProfile />;
//       case "/admin/booking/customer":
//         return <BookingbyAdminForm />;
//       case "/admin/booking/calender":
//         return <BookingManagement />;
//       case "/admin/booking/slotmanager":
//         return <SlotManager />;
//       default:
//         return <CustomerList />; // Default page
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold">{/* Logo or Title */}</h1>
//         </div>
//         <nav className="mt-8">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
//                 location.pathname === item.path
//                   ? "bg-gray-800"
//                   : "hover:bg-gray-700"
//               }`}
//             >
//               <item.icon className="w-6 h-6 mr-3" />
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//               {sidebarItems.find((item) => item.path === location.pathname)
//                 ?.name || "Dashboard"}
//             </h2>
//             <div className="flex items-center">
//               {/* Notification Bell */}
//               <button
//                 className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 aria-label="Notifications"
//               >
//                 <BellAlertIcon className="h-6 w-6" />
//               </button>

//               {/* User Avatar and Dropdown */}
//               <div className="ml-3 relative" ref={dropdownRef}>
//                 <div>
//                   <button
//                     className="flex items-center bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     aria-haspopup="true"
//                     aria-expanded={isProfileOpen}
//                   >
//                     <UserIcon className="h-8 w-8 text-gray-400" />
//                     <ChevronDoubleDownIcon className="ml-2 h-5 w-5 text-gray-400" />
//                   </button>
//                 </div>
//                 <AnimatePresence>
//                   {isProfileOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
//                     >
//                       <Link
//                         to="/admin/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Edit Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//           <div className="container mx-auto px-6 py-8">{renderPage()}</div>
//         </main>
//       </div>
//     </div>
//   );
// }
