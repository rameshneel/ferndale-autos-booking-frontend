import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function RefundModal({
  isOpen,
  closeModal,
  booking,
  refundAmount,
  setRefundAmount,
  refundReason,
  setRefundReason,
  handleRefund,
  isProcessing,
  isSuccess,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Process Refund
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={closeModal}
              >
                <XCircleIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Refund Processed
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  The refund for order{" "}
                  {booking?.paymentMethod === "PayPal"
                    ? booking?.orderId
                    : booking?.molliePaymentId}{" "}
                  has been successfully processed.
                </p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-4">
                  Please confirm the refund details for order{" "}
                  {booking?.paymentMethod === "PayPal"
                    ? booking?.paypalOrderId
                    : booking?.molliePaymentId}
                  .
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="refundAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    id="refundAmount"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter refund amount"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="refundReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Refund Reason
                  </label>
                  <textarea
                    id="refundReason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter reason for refund"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={closeModal}
              >
                Cancel
              </motion.button>
              {!isSuccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleRefund}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm Refund"
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function RefundModal({ isOpen, closeModal, booking, refundAmount, setRefundAmount, refundReason, setRefundReason, handleRefund, isProcessing }) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
//           >
//             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//               Process Refund
//             </h3>
//             <div className="mt-2">
//               <p className="text-sm text-gray-500 mb-4">
//                 Please confirm the refund details for order {booking?.orderId}.
//               </p>
//               <div className="mb-4">
//                 <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-1">
//                   Refund Amount
//                 </label>
//                 <input
//                   type="number"
//                   id="refundAmount"
//                   value={refundAmount}
//                   onChange={(e) => setRefundAmount(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter refund amount"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="refundReason" className="block text-sm font-medium text-gray-700 mb-1">
//                   Refund Reason
//                 </label>
//                 <textarea
//                   id="refundReason"
//                   value={refundReason}
//                   onChange={(e) => setRefundReason(e.target.value)}
//                   rows={3}
//                   className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter reason for refund"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-end space-x-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleRefund}
//                 disabled={isProcessing}
//               >
//                 {isProcessing ? 'Processing...' : 'Confirm Refund'}
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// // RefundModal.js
// import React from 'react';
// import { Dialog, Transition } from '@headlessui/react';

// export default function RefundModal({ isOpen, closeModal, booking, refundAmount, setRefundAmount, refundReason, setRefundReason, handleRefund, isProcessing }) {
//   return (
//     <Transition appear show={isOpen} as={React.Fragment}>
//       <Dialog
//         as="div"
//         className="fixed inset-0 z-10 overflow-y-auto"
//         onClose={closeModal}
//       >
//         <div className="min-h-screen px-4 text-center">
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//           </Transition.Child>

//           <span
//             className="inline-block h-screen align-middle"
//             aria-hidden="true"
//           >
//             &#8203;
//           </span>
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
//               <Dialog.Title
//                 as="h3"
//                 className="text-lg font-medium leading-6 text-gray-900"
//               >
//                 Process Refund
//               </Dialog.Title>
//               <div className="mt-2">
//                 <p className="text-sm text-gray-500">
//                   Please confirm the refund details for order {booking?.orderId}.
//                 </p>
//                 <div className="mt-4">
//                   <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700">
//                     Refund Amount
//                   </label>
//                   <input
//                     type="number"
//                     id="refundAmount"
//                     value={refundAmount}
//                     onChange={(e) => setRefundAmount(e.target.value)}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Enter refund amount"
//                   />
//                 </div>
//                 <div className="mt-4">
//                   <label htmlFor="refundReason" className="block text-sm font-medium text-gray-700">
//                     Refund Reason
//                   </label>
//                   <textarea
//                     id="refundReason"
//                     value={refundReason}
//                     onChange={(e) => setRefundReason(e.target.value)}
//                     rows={3}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Enter reason for refund"
//                   />
//                 </div>
//               </div>

//               <div className="mt-4 flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
//                   onClick={handleRefund}
//                   disabled={isProcessing}
//                 >
//                   {isProcessing ? 'Processing...' : 'Confirm Refund'}
//                 </button>
//               </div>
//             </div>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
