import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateAccount } from "../../services/api";
import { X } from "lucide-react";

const UserProfile = ({ onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateAccount(fullName, email, mobileNo);
      if (response.status === 200) {
        toast.success(response.data.message || "Profile updated successfully!");
        onClose();
      } else {
        toast.error(response.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-200">Update Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-gray-400 hover:text-teal-400"
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
              placeholder="Enter your mobile number"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
          >
            Update Profile
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default UserProfile;

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { updateAccount } from "../../services/api";
// import { X } from "lucide-react";

// const UserProfile = ({ onClose }) => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobileNo, setMobileNo] = useState("");

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await updateAccount(fullName, email, mobileNo);
//       if (response.status === 200) {
//         toast.success(response.data.message || "Profile updated successfully!");
//         onClose();
//       } else {
//         toast.error(response.message || "Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     }
//   };

//   return (
//     <div className="relative">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="space-y-6"
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="h-6 w-6" />
//           </motion.button>
//         </div>
//         <form onSubmit={handleUpdate} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
//               placeholder="Enter your full name"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
//               placeholder="Enter your email"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Mobile Number
//             </label>
//             <input
//               type="tel"
//               value={mobileNo}
//               onChange={(e) => setMobileNo(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
//               placeholder="Enter your mobile number"
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
//           >
//             Update Profile
//           </motion.button>
//         </form>
//       </motion.div>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// };

// export default UserProfile;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
// import "react-toastify/dist/ReactToastify.css";
// import { updateAccount } from "../../services/api";

// export default function UserProfile() {
//   const [fullName, setfullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobileNo, setMobileNo] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await updateAccount(fullName, email, mobileNo);
//       if (response.status === 200) {
//         toast.success(response.data.message);
//         // navigate("/admin/booking");
//       } else {
//         toast.error(
//           response.message || "An error occurred while checking the customer."
//         );
//       }
//     } catch (error) {
//       // if(error.response.data.message==="Unauthorized request"){
//       //   navigate('/login')
//       // }
//       console.error("Error:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "An unexpected error occurred. Please try again later."
//       );
//     }
//   };
//   // const handleFileChange = (e) => {
//   //   setAvatar(e.target.files[0]);
//   // };

//   return (
//     <div className="flex flex-col items-center">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//           Update Profile
//         </h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label
//               htmlFor="fullName"
//               className="block text-sm font-medium text-gray-700"
//             >
//               full Name
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               value={fullName}
//               onChange={(e) => setfullName(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
//                 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
//                 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="mobileNo"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Mobile Number
//             </label>
//             <input
//               type="tel"
//               id="mobileNo"
//               value={mobileNo}
//               onChange={(e) => setMobileNo(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
//                 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
//             />
//           </div>
//           {/* <div>
//             <label
//               htmlFor="avatar"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Avatar
//             </label>
//             <input
//               type="file"
//               id="avatar"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
//                 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
//             />
//           </div> */}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Update
//           </motion.button>
//         </form>
//       </motion.div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }
