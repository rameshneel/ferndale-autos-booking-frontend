import React from "react";
import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Confirm Deletion
        </h2>
        <p className="text-gray-300">
          Are you sure you want to delete this customer?
        </p>
        <div className="mt-6 flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmationModal;
// import React from 'react';
// import { motion } from 'framer-motion';

// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//     >
//       <motion.div
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: -50, opacity: 0 }}
//         className="bg-white p-6 rounded-lg"
//       >
//         <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
//         <p>Are you sure you want to delete this customer?</p>
//         <div className="mt-4 flex justify-end space-x-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-500 text-white rounded"
//           >
//             Delete
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default DeleteConfirmationModal;
