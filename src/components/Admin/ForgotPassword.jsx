import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgetPassword } from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgetPassword(email); // Call the actual API function
      setMessage("Password reset link has been sent to your email.");
      toast.success("Password reset link has been sent to your email.");
      setTimeout(() => navigate("/login"), 2000); // Navigate after showing success
    } catch (error) {
      console.error("Error requesting password reset:", error);
      const errorMsg =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again later.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-200">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-400 transition-all"
          >
            Send Reset Link
          </motion.button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`mt-4 text-sm text-center ${
              message.includes("error") ? "text-red-400" : "text-teal-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer
// import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
// import { forgetPassword } from "../../services/api";

// // Example API function to simulate an API call (replace with your actual API function)
// const apiRequestToResetPassword = async (email) => {
//  await forgetPassword(email);
//   return new Promise((resolve) =>
//     setTimeout(() => resolve({ success: true }), 1000)
//   );
// };

// // The ForgotPassword component
// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   // Function to handle the form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Call the API request function
//       const response = await apiRequestToResetPassword(email);

//       if (response.success) {
//         setMessage("Password reset link has been sent to your email.");
//         toast.success("Password reset link has been sent to your email.");
//         setTimeout(() => navigate("/login"), 2000); // Navigate after showing the success message
//       } else {
//         setMessage(response.message || "An error occurred while sending the password reset link.");
//         toast.error(response.message || "An error occurred while sending the password reset link.");
//       }
//     } catch (error) {
//       console.error("Error requesting password reset:", error);
//       setMessage("An unexpected error occurred. Please try again later.");
//       toast.error(
//         error.response?.data?.message ||
//         "An unexpected error occurred. Please try again later."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white p-8 rounded-lg shadow-2xl w-96"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//           Forgot Password
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
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
//               required
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Send Reset Link
//           </motion.button>
//         </form>
//         {message && (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="mt-4 text-sm text-center text-gray-600"
//           >
//             {message}
//           </motion.p>
//         )}
//       </motion.div>
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// }
