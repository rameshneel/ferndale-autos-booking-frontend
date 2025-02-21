import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getResetPasswordToken } from "../../services/api"; // Ensure this path is correct

export default function VerifyToken() {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Perform the actual API call to verify the token
        const response = await getResetPasswordToken(token);

        if (response.status===200) {
          setIsValid(true);
          setTimeout(() => navigate(`/reset-password/${token}`), 1000); // Redirect after showing the success message
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center"
      >
        {isValid === null && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto"
          ></motion.div>
        )}
        {isValid === true && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Token Verified!
            </h2>
            <p className="mt-2 text-gray-600">
              Redirecting to reset password...
            </p>
          </motion.div>
        )}
        {isValid === false && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Invalid Token
            </h2>
            <p className="mt-2 text-gray-600">
              The token is invalid or has expired.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/forgot-password")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Request New Link
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getResetPasswordToken } from "../../services/api";

// export default function VerifyToken() {
//   const [isValid, setIsValid] = useState(null);
//   const navigate = useNavigate();
//   const { token } = useParams();

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         getResetPasswordToken(token)
//         await new Promise((resolve) => setTimeout(resolve, 2000));

//         // Simulate token verification
//         const isTokenValid = token && token.length === 32;

//         setIsValid(isTokenValid);

//         if (isTokenValid) {
//           setTimeout(() => navigate(`/reset-password/${token}`), 1000);
//         }
//       } catch (error) {
//         setIsValid(false);
//       }
//     };

//     verifyToken();
//   }, [token, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center"
//       >
//         {isValid === null && (
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto"
//           ></motion.div>
//         )}
//         {isValid === true && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 260, damping: 20 }}
//           >
//             <svg
//               className="w-16 h-16 text-green-500 mx-auto"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 13l4 4L19 7"
//               ></path>
//             </svg>
//             <h2 className="text-2xl font-bold mt-4 text-gray-800">
//               Token Verified!
//             </h2>
//             <p className="mt-2 text-gray-600">
//               Redirecting to reset password...
//             </p>
//           </motion.div>
//         )}
//         {isValid === false && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 260, damping: 20 }}
//           >
//             <svg
//               className="w-16 h-16 text-red-500 mx-auto"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               ></path>
//             </svg>
//             <h2 className="text-2xl font-bold mt-4 text-gray-800">
//               Invalid Token
//             </h2>
//             <p className="mt-2 text-gray-600">
//               The token is invalid or has expired.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/forgot-password")}
//               className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Request New Link
//             </motion.button>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }
