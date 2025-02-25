import React, { useCallback, useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Clock, CheckCircle2, Loader2 } from "lucide-react";
import {
  capturePayment,
  cancelPayment,
  createCustomer,
} from "../../services/api";

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const PayPalPaymentForm = ({ isOpen, closeModal, formData }) => {
  const PAYMENT_TIMEOUT = 10 * 60 * 1000;
  const PAYPAL_CLIENT_ID =
    "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5Y&currency=GBP";

  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [isLoading, setIsLoading] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [confirmationData, setConfirmationData] = useState(null);

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: { duration: 0.3 },
    },
  };

  useEffect(() => {
    let timer;
    if (isOpen && timeLeft > 0 && orderStatus !== "completed") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            handleCancel();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, orderStatus]);

  useEffect(() => {
    const initializeOrder = async () => {
      if (isOpen && !paypalOrderId) {
        setIsLoading(true);
        try {
          const response = await createCustomer(formData);
          if (response.data.success) {
            setPaypalOrderId(response.data.data.paypalOrderId);
            setOrderStatus("created");
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to create order",
            {
              position: "top-right",
            }
          );
          setOrderStatus("error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    initializeOrder();
  }, [isOpen, formData]);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      if (paypalOrderId) {
        await cancelPayment(paypalOrderId);
      }
      toast.info("Payment cancelled", {
        position: "top-right",
      });
      setOrderStatus("pending");
      setPaypalOrderId(null);
      closeModal();
    } catch (error) {
      toast.error("Failed to cancel payment", {
        position: "top-right",
      });
      setOrderStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    setIsLoading(true);
    setOrderStatus("processing");
    try {
      await capturePayment(details);
      setConfirmationData({
        ...formData,
        invoiceNumber: details.id,
        amount: details.purchase_units[0].amount.value,
      });
      setOrderStatus("completed");
      setTimeout(() => {
        closeModal();
        setOrderStatus("pending");
        setPaypalOrderId(null);
      }, 10000);
    } catch (error) {
      toast.error("Payment capture failed", {
        position: "top-right",
      });
      setOrderStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Close Button */}
              {/* Close Button (hidden when completed) */}
              {orderStatus !== "completed" && (
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {/* Header */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Complete Your Payment
              </h3>

              {/* Timer */}
              {orderStatus === "created" && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-indigo-600 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      Time remaining: {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                      initial={{ width: "100%" }}
                      animate={{
                        width: `${(timeLeft / PAYMENT_TIMEOUT) * 100}%`,
                      }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Payment Status */}
              {orderStatus === "completed" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
                >
                  <h1 className="text-2xl font-bold text-center mb-6">
                    Payment Confirmation
                  </h1>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6 text-center"
                  >
                    <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                    <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                    <p>
                      Thank you for your booking. Your invoice number is:{" "}
                      {confirmationData?.invoiceNumber}
                    </p>
                    <p>Total Amount Paid: £{confirmationData?.amount}</p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Return to Home
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {/* Loading State */}
                  {isLoading && (
                    <motion.div
                      className="flex justify-center py-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </motion.div>
                  )}

                  {/* PayPal Buttons */}
                  {orderStatus === "created" && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <PayPalScriptProvider
                        options={{ "client-id": PAYPAL_CLIENT_ID }}
                      >
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "pill",
                            label: "pay",
                            height: 48,
                          }}
                          createOrder={() => paypalOrderId}
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            await handlePaymentSuccess(details);
                          }}
                          onCancel={handleCancel}
                          disabled={isLoading}
                        />
                      </PayPalScriptProvider>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PayPalPaymentForm;

// import React, { useCallback, useEffect, useState } from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   X,
//   AlertCircle,
//   Clock,
//   CheckCircle2,
//   CheckCircleIcon,
// } from "lucide-react";
// import {
//   capturePayment,
//   cancelPayment,
//   createCustomer,
// } from "../../services/api";

// const formatTime = (ms) => {
//   const minutes = Math.floor(ms / 60000);
//   const seconds = ((ms % 60000) / 1000).toFixed(0);
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// };

// const PayPalPaymentForm = ({ isOpen, closeModal, formData }) => {
//   const PAYMENT_TIMEOUT = 10 * 60 * 1000;
//   const PAYPAL_CLIENT_ID =
//     "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5&currency=GBP";

//   const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
//   const [isLoading, setIsLoading] = useState(false);
//   const [paypalOrderId, setPaypalOrderId] = useState(null);
//   const [orderStatus, setOrderStatus] = useState("pending");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [confirmationData, setConfirmationData] = useState(null);

//   useEffect(() => {
//     let timer;
//     if (isOpen && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1000) {
//             handleCancel();
//             return 0;
//           }
//           return prev - 1000;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isOpen, timeLeft]);

//   useEffect(() => {
//     const initializeOrder = async () => {
//       if (isOpen && !paypalOrderId) {
//         setIsLoading(true);
//         try {
//           const response = await createCustomer(formData);
//           console.log("reponce data", response);

//           if (response.success) {
//             setPaypalOrderId(response.data.paypalOrderId);
//             setOrderStatus("created");
//           } else {
//             throw new Error(response.message);
//           }
//         } catch (error) {
//           console.log("eroror", error);

//           setErrorMessage(
//             error.response.data.message || "Failed to create order"
//           );
//           setOrderStatus("error");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     initializeOrder();
//   }, [isOpen, formData]);

//   const handleCancel = async () => {
//     setIsLoading(true);
//     try {
//       if (paypalOrderId) {
//         await cancelPayment(paypalOrderId);
//       }
//       setOrderStatus("pending");
//       setPaypalOrderId(null);
//       closeModal();
//     } catch (error) {
//       setErrorMessage("Failed to cancel payment");
//       setOrderStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (details) => {
//     setIsLoading(true);
//     setOrderStatus("processing");
//     try {
//       await capturePayment(details);
//       setOrderStatus("completed");
// setConfirmationData({
//   ...formData,
//   invoiceNumber: details.id,
//   amount: details.purchase_units[0].amount.value,
// });
// setTimeout(() => {
//   closeModal();
// }, 20000);
//     } catch (error) {
//       setErrorMessage("Payment capture failed");
//       setOrderStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
//             >
//               {/* Header */}
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="absolute right-0 top-0 pr-4 pt-4">
//                   <button
//                     onClick={handleCancel}
//                     className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
//                     disabled={isLoading}
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>

//                 <div className="text-center sm:text-left">
//                   <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-4">
//                     Complete Your Payment
//                   </h3>

//                   {/* Timer */}
// {orderStatus === "created" && (
//   <div className="mb-6">
//     <div className="flex items-center justify-center space-x-2 mb-2">
//       <Clock className="h-5 w-5 text-blue-600" />
//       <span className="text-sm font-medium text-gray-700">
//         Time remaining: {formatTime(timeLeft)}
//       </span>
//     </div>
//     <div className="w-full bg-gray-200 rounded-full h-2">
//       <div
//         className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
//         style={{
//           width: `${(timeLeft / PAYMENT_TIMEOUT) * 100}%`,
//         }}
//       />
//     </div>
//   </div>
// )}
// {/* Status Messages */}
// <div className="mb-6">
//   {orderStatus === "completed" && (
// <motion.div
//   initial={{ scale: 0.9, opacity: 0 }}
//   animate={{ scale: 1, opacity: 1 }}
//   transition={{ duration: 0.5 }}
//   className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
// >
//   <h1 className="text-2xl font-bold text-center mb-6">
//     Payment Confirmation
//   </h1>

//   <motion.div
//     initial={{ opacity: 0, x: 50 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -50 }}
//     className="space-y-6 text-center"
//   >
//     <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
//     <h2 className="text-2xl font-bold">
//       Booking Confirmed!
//     </h2>
//     <p>
//       Thank you for your booking. Your invoice number is:{" "}
//       {confirmationData?.invoiceNumber}
//     </p>
//     <p>Total Amount Paid: £{confirmationData?.amount}</p>
//     <button
//       onClick={() => navigate("/")}
//       className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//     >
//       Return to Home
//     </button>
//   </motion.div>
// </motion.div>
//     // <div className="flex items-center justify-center space-x-2 text-green-600">
//     //   <CheckCircle2 className="h-5 w-5" />
//     //   <span className="text-sm">Payment successful!</span>
//     // </div>
//   )}
// </div>
//                   {/* PayPal Button */}
//                   <div className="mt-4">
//                     {isLoading && (
//                       <motion.div
//                         className="flex justify-center items-center w-full h-full"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <div
//                           className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
//                           role="status"
//                         >
//                           <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-rect">
//                             Loading...
//                           </span>
//                         </div>
//                       </motion.div>
//                     )}

//                     {orderStatus === "created" && (
//                       <PayPalScriptProvider
//                         options={{ "client-id": PAYPAL_CLIENT_ID }}
//                       >
//                         <PayPalButtons
//                           style={{
//                             layout: "vertical",
//                             color: "blue",
//                             shape: "rect",
//                             label: "pay",
//                           }}
//                           createOrder={() => paypalOrderId}
//                           onApprove={async (data, actions) => {
//                             console.log("data", data);

//                             const details = await actions.order.capture();
//                             await handlePaymentSuccess(details);
//                           }}
//                           onCancel={handleCancel}
//                           disabled={isLoading}
//                         />
//                       </PayPalScriptProvider>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default PayPalPaymentForm;

// import React, { useCallback, useEffect, useState } from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { X, Clock, CheckCircle2, Loader2 } from "lucide-react";
// import {
//   capturePayment,
//   cancelPayment,
//   createCustomer,
// } from "../../services/api";

// const formatTime = (ms) => {
//   const minutes = Math.floor(ms / 60000);
//   const seconds = ((ms % 60000) / 1000).toFixed(0);
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// };

// const PayPalPaymentForm = ({ isOpen, closeModal, formData }) => {
//   const PAYMENT_TIMEOUT = 10 * 60 * 1000;
//   const PAYPAL_CLIENT_ID =
//     "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5Y&currency=GBP";

//   const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
//   const [isLoading, setIsLoading] = useState(false);
//   const [paypalOrderId, setPaypalOrderId] = useState(null);
//   const [orderStatus, setOrderStatus] = useState("pending");
//   const [confirmationData, setConfirmationData] = useState(null);

//   const modalVariants = {
//     hidden: { opacity: 0, y: -50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: 50,
//       transition: { duration: 0.3 },
//     },
//   };

//   useEffect(() => {
//     let timer;
//     if (isOpen && timeLeft > 0 && orderStatus !== "completed") {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1000) {
//             handleCancel();
//             return 0;
//           }
//           return prev - 1000;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isOpen, timeLeft, orderStatus]);

//   useEffect(() => {
//     const initializeOrder = async () => {
//       if (isOpen && !paypalOrderId) {
//         setIsLoading(true);
//         try {
//           const response = await createCustomer(formData);
//           if (response.data.success) {
//             setPaypalOrderId(response.data.data.paypalOrderId);
//             setOrderStatus("created");
//             // toast.success("Order created successfully!", {
//             //   position: "top-right",
//             //   autoClose: 3000,
//             // });
//           } else {
//             throw new Error(response.message);
//           }
//         } catch (error) {
//           toast.error(
//             error.response?.data?.message || "Failed to create order",
//             {
//               position: "top-right",
//             }
//           );
//           setOrderStatus("error");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     initializeOrder();
//   }, [isOpen, formData]);

//   const handleCancel = async () => {
//     setIsLoading(true);
//     try {
//       if (paypalOrderId) {
//         await cancelPayment(paypalOrderId);
//       }
//       toast.info("Payment cancelled", {
//         position: "top-right",
//       });
//       setOrderStatus("pending");
//       setPaypalOrderId(null);
//       closeModal();
//     } catch (error) {
//       toast.error("Failed to cancel payment", {
//         position: "top-right",
//       });
//       setOrderStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (details) => {
//     setIsLoading(true);
//     setOrderStatus("processing");
//     try {
//       await capturePayment(details);
//       // toast.success(
//       //   <div>
//       //     <strong>Payment Successful!</strong>
//       //     <p>Amount: £{details.purchase_units[0].amount.value}</p>
//       //     <p>Transaction ID: {details.id}</p>
//       //   </div>,
//       //   {
//       //     position: "top-center",
//       //     autoClose: 5000,
//       //     icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
//       //   }
//       // );
//       setConfirmationData({
//         ...formData,
//         invoiceNumber: details.id,
//         amount: details.purchase_units[0].amount.value,
//       });
//       setOrderStatus("completed");
//       setTimeout(() => {
//         closeModal();
//         setOrderStatus("pending");
//         setPaypalOrderId(null);
//       }, 10000);
//       // setTimeout(() => {
//       //   closeModal();
//       //   setOrderStatus("pending");
//       //   setPaypalOrderId(null);
//       // }, 50000);
//     } catch (error) {
//       toast.error("Payment capture failed", {
//         position: "top-right",
//       });
//       setOrderStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <motion.div
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={handleCancel}
//                 disabled={isLoading}
//                 className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
//               >
//                 <X className="h-5 w-5" />
//               </button>

//               {/* Header */}
//               <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 Complete Your Payment
//               </h3>

//               {/* Timer */}
//               {orderStatus === "created" && (
//                 <motion.div
//                   className="mb-6"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                 >
//                   <div className="flex items-center justify-center gap-2 mb-3">
//                     <Clock className="h-5 w-5 text-indigo-600 animate-pulse" />
//                     <span className="text-sm font-medium text-gray-700">
//                       Time remaining: {formatTime(timeLeft)}
//                     </span>
//                   </div>
//                   <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <motion.div
//                       className="absolute h-full bg-gradient-to-r from-indigo-500 to-blue-500"
//                       initial={{ width: "100%" }}
//                       animate={{
//                         width: `${(timeLeft / PAYMENT_TIMEOUT) * 100}%`,
//                       }}
//                       transition={{ ease: "linear" }}
//                     />
//                   </div>
//                 </motion.div>
//               )}

//               {/* Payment Status */}
//               {orderStatus === "completed" ? (
//                 // <motion.div
//                 //   initial={{ scale: 0.9, opacity: 0 }}
//                 //   animate={{ scale: 1, opacity: 1 }}
//                 //   className="text-center py-6"
//                 // >
//                 //   <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
//                 //   <h2 className="text-xl font-semibold text-gray-800 mb-2">
//                 //     Payment Confirmed!
//                 //   </h2>
//                 //   <p className="text-gray-600">Thank you for your payment</p>
//                 // </motion.div>
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
//                 >
//                   <h1 className="text-2xl font-bold text-center mb-6">
//                     Payment Confirmation
//                   </h1>

//                   <motion.div
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -50 }}
//                     className="space-y-6 text-center"
//                   >
//                     <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
//                     <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
//                     <p>
//                       Thank you for your booking. Your invoice number is:{" "}
//                       {confirmationData?.invoiceNumber}
//                     </p>
//                     <p>Total Amount Paid: £{confirmationData?.amount}</p>
//                     <button
//                       onClick={() => navigate("/")}
//                       className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//                     >
//                       Return to Home
//                     </button>
//                   </motion.div>
//                 </motion.div>
//               ) : (
//                 <>
//                   {/* Loading State */}
//                   {isLoading && (
//                     <motion.div
//                       className="flex justify-center py-6"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                     >
//                       <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
//                     </motion.div>
//                   )}

//                   {/* PayPal Buttons */}
//                   {orderStatus === "created" && !isLoading && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="mt-6"
//                     >
//                       <PayPalScriptProvider
//                         options={{ "client-id": PAYPAL_CLIENT_ID }}
//                       >
//                         <PayPalButtons
//                           style={{
//                             layout: "vertical",
//                             color: "blue",
//                             shape: "pill",
//                             label: "pay",
//                             height: 48,
//                           }}
//                           createOrder={() => paypalOrderId}
//                           onApprove={async (data, actions) => {
//                             const details = await actions.order.capture();
//                             await handlePaymentSuccess(details);
//                           }}
//                           onCancel={handleCancel}
//                           disabled={isLoading}
//                         />
//                       </PayPalScriptProvider>
//                     </motion.div>
//                   )}
//                 </>
//               )}
//             </motion.div>
//           </div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default PayPalPaymentForm;

// // import React, { useCallback, useEffect, useState } from "react";
// // import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import {
// //   X,
// //   AlertCircle,
// //   Clock,
// //   CheckCircle2,
// //   CheckCircleIcon,
// // } from "lucide-react";
// // import {
// //   capturePayment,
// //   cancelPayment,
// //   createCustomer,
// // } from "../../services/api";

// // const formatTime = (ms) => {
// //   const minutes = Math.floor(ms / 60000);
// //   const seconds = ((ms % 60000) / 1000).toFixed(0);
// //   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// // };

// // const PayPalPaymentForm = ({ isOpen, closeModal, formData }) => {
// //   const PAYMENT_TIMEOUT = 10 * 60 * 1000;
// //   const PAYPAL_CLIENT_ID =
// //     "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5&currency=GBP";

// //   const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [paypalOrderId, setPaypalOrderId] = useState(null);
// //   const [orderStatus, setOrderStatus] = useState("pending");
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [confirmationData, setConfirmationData] = useState(null);

// //   useEffect(() => {
// //     let timer;
// //     if (isOpen && timeLeft > 0) {
// //       timer = setInterval(() => {
// //         setTimeLeft((prev) => {
// //           if (prev <= 1000) {
// //             handleCancel();
// //             return 0;
// //           }
// //           return prev - 1000;
// //         });
// //       }, 1000);
// //     }
// //     return () => clearInterval(timer);
// //   }, [isOpen, timeLeft]);

// //   useEffect(() => {
// //     const initializeOrder = async () => {
// //       if (isOpen && !paypalOrderId) {
// //         setIsLoading(true);
// //         try {
// //           const response = await createCustomer(formData);
// //           console.log("reponce data", response);

// //           if (response.success) {
// //             setPaypalOrderId(response.data.paypalOrderId);
// //             setOrderStatus("created");
// //           } else {
// //             throw new Error(response.message);
// //           }
// //         } catch (error) {
// //           console.log("eroror", error);

// //           setErrorMessage(
// //             error.response.data.message || "Failed to create order"
// //           );
// //           setOrderStatus("error");
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       }
// //     };

// //     initializeOrder();
// //   }, [isOpen, formData]);

// //   const handleCancel = async () => {
// //     setIsLoading(true);
// //     try {
// //       if (paypalOrderId) {
// //         await cancelPayment(paypalOrderId);
// //       }
// //       setOrderStatus("pending");
// //       setPaypalOrderId(null);
// //       closeModal();
// //     } catch (error) {
// //       setErrorMessage("Failed to cancel payment");
// //       setOrderStatus("error");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handlePaymentSuccess = async (details) => {
// //     setIsLoading(true);
// //     setOrderStatus("processing");
// //     try {
// //       await capturePayment(details);
// //       setOrderStatus("completed");
// // setConfirmationData({
// //   ...formData,
// //   invoiceNumber: details.id,
// //   amount: details.purchase_units[0].amount.value,
// // });
// // setTimeout(() => {
// //   closeModal();
// // }, 20000);
// //     } catch (error) {
// //       setErrorMessage("Payment capture failed");
// //       setOrderStatus("error");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <div className="fixed inset-0 z-50 overflow-y-auto">
// //           <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
// //             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.95 }}
// //               className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
// //             >
// //               {/* Header */}
// //               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
// //                 <div className="absolute right-0 top-0 pr-4 pt-4">
// //                   <button
// //                     onClick={handleCancel}
// //                     className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
// //                     disabled={isLoading}
// //                   >
// //                     <X className="h-6 w-6" />
// //                   </button>
// //                 </div>

// //                 <div className="text-center sm:text-left">
// //                   <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-4">
// //                     Complete Your Payment
// //                   </h3>

// //                   {/* Timer */}
// // {orderStatus === "created" && (
// //   <div className="mb-6">
// //     <div className="flex items-center justify-center space-x-2 mb-2">
// //       <Clock className="h-5 w-5 text-blue-600" />
// //       <span className="text-sm font-medium text-gray-700">
// //         Time remaining: {formatTime(timeLeft)}
// //       </span>
// //     </div>
// //     <div className="w-full bg-gray-200 rounded-full h-2">
// //       <div
// //         className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
// //         style={{
// //           width: `${(timeLeft / PAYMENT_TIMEOUT) * 100}%`,
// //         }}
// //       />
// //     </div>
// //   </div>
// // )}
// // {/* Status Messages */}
// // <div className="mb-6">
// //   {orderStatus === "completed" && (
// // <motion.div
// //   initial={{ scale: 0.9, opacity: 0 }}
// //   animate={{ scale: 1, opacity: 1 }}
// //   transition={{ duration: 0.5 }}
// //   className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
// // >
// //   <h1 className="text-2xl font-bold text-center mb-6">
// //     Payment Confirmation
// //   </h1>

// //   <motion.div
// //     initial={{ opacity: 0, x: 50 }}
// //     animate={{ opacity: 1, x: 0 }}
// //     exit={{ opacity: 0, x: -50 }}
// //     className="space-y-6 text-center"
// //   >
// //     <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
// //     <h2 className="text-2xl font-bold">
// //       Booking Confirmed!
// //     </h2>
// //     <p>
// //       Thank you for your booking. Your invoice number is:{" "}
// //       {confirmationData?.invoiceNumber}
// //     </p>
// //     <p>Total Amount Paid: £{confirmationData?.amount}</p>
// //     <button
// //       onClick={() => navigate("/")}
// //       className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
// //     >
// //       Return to Home
// //     </button>
// //   </motion.div>
// // </motion.div>
// //     // <div className="flex items-center justify-center space-x-2 text-green-600">
// //     //   <CheckCircle2 className="h-5 w-5" />
// //     //   <span className="text-sm">Payment successful!</span>
// //     // </div>
// //   )}
// // </div>
// //                   {/* PayPal Button */}
// //                   <div className="mt-4">
// //                     {isLoading && (
// //                       <motion.div
// //                         className="flex justify-center items-center w-full h-full"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         transition={{ duration: 0.3 }}
// //                       >
// //                         <div
// //                           className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
// //                           role="status"
// //                         >
// //                           <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-rect">
// //                             Loading...
// //                           </span>
// //                         </div>
// //                       </motion.div>
// //                     )}

// //                     {orderStatus === "created" && (
// //                       <PayPalScriptProvider
// //                         options={{ "client-id": PAYPAL_CLIENT_ID }}
// //                       >
// //                         <PayPalButtons
// //                           style={{
// //                             layout: "vertical",
// //                             color: "blue",
// //                             shape: "rect",
// //                             label: "pay",
// //                           }}
// //                           createOrder={() => paypalOrderId}
// //                           onApprove={async (data, actions) => {
// //                             console.log("data", data);

// //                             const details = await actions.order.capture();
// //                             await handlePaymentSuccess(details);
// //                           }}
// //                           onCancel={handleCancel}
// //                           disabled={isLoading}
// //                         />
// //                       </PayPalScriptProvider>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           </div>
// //         </div>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// // export default PayPalPaymentForm;
