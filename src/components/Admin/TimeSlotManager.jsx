import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  getAvailableTimeSlots,
  blockTimeSlots,
  unblockTimeSlots,
} from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimeSlotManager = ({ date }) => {
  function formatDateForBackend(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const gobaldate = formatDateForBackend(date);

  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (date) {
      fetchTimeSlots(date);
    }
  }, [date]);

  const fetchTimeSlots = async (selectedDate) => {
    const datechange = formatDateForBackend(selectedDate);
    setLoading(true);
    setError(null);
    try {
      const response = await getAvailableTimeSlots(datechange);
      if (response.data.statusCode === 200 && response.data.success) {
        setTimeSlots(response.data.data);
      } else {
        throw new Error(response.message || "Failed to fetch time slots");
      }
    } catch (error) {
      setError("Error fetching time slots: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (slot) => {
    setLoading(true);
    setError(null);
    const action = slot.status === "Blocked" ? "unblock" : "block";

    try {
      if (slot.status === "Blocked") {
        await unblockTimeSlots(gobaldate, [slot.time]);
        toast.success(`Slot ${slot.time} unblocked successfully!`);
      } else if (slot.status === "Available") {
        await blockTimeSlots(gobaldate, [slot.time]);
        toast.success(`Slot ${slot.time} blocked successfully!`);
      }
      await fetchTimeSlots(date);
    } catch (error) {
      toast.error(`Error ${action}ing time slot: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return <CheckCircleIcon className="w-5 h-5 text-teal-400 mr-2" />;
      case "Blocked":
        return <LockClosedIcon className="w-5 h-5 text-red-400 mr-2" />;
      case "Booked":
        return <UserIcon className="w-5 h-5 text-blue-400 mr-2" />;
      default:
        return null;
    }
  };

  if (loading)
    return <div className="text-center py-4 text-gray-400">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-400">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left text-gray-300">Time Slot</th>
              <th className="px-4 py-2 text-left text-gray-300">Status</th>
              <th className="px-4 py-2 text-left text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <motion.tr
                key={slot.time}
                whileHover={{ backgroundColor: "#374151" }} // gray-700
                className="border-b border-gray-700"
              >
                <td className="px-4 py-2 text-gray-200">{slot.time}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center text-gray-200">
                    {getStatusIcon(slot.status)}
                    <span className="capitalize">{slot.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  {slot.status !== "Booked" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBlockUnblock(slot)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        slot.status === "Blocked"
                          ? "bg-teal-600 text-white hover:bg-teal-500"
                          : "bg-red-600 text-white hover:bg-red-500"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="animate-spin w-4 h-4 inline mr-1">
                          🔄
                        </span>
                      ) : slot.status === "Blocked" ? (
                        <>
                          <LockOpenIcon className="w-4 h-4 inline mr-1" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="w-4 h-4 inline mr-1" />
                          Block
                        </>
                      )}
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default TimeSlotManager;
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   LockClosedIcon,
//   LockOpenIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline";
// import {
//   getAvailableTimeSlots,
//   blockTimeSlots,
//   unblockTimeSlots,
// } from "../../services/api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const TimeSlotManager = ({ date }) => {
//   function formatDateForBackend(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`; // Format 'YYYY-MM-DD'
//   }
//   const gobaldate = formatDateForBackend(date);

//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     if (date) {
//       fetchTimeSlots(date);
//     }
//   }, [date]);

//   const fetchTimeSlots = async (selectedDate) => {
//     const datechange = formatDateForBackend(selectedDate);
//     setLoading(true);
//     setError(null);
//     // const localFormattedDate =  selectedDate.toISOString().split('T')[0];
//     try {
//       const response = await getAvailableTimeSlots(datechange);
//       // console.log("responce",response);

//       if (response.data.statusCode === 200 && response.data.success) {
//         setTimeSlots(response.data.data);
//       } else {
//         throw new Error(response.message || "Failed to fetch time slots");
//       }
//     } catch (error) {
//       setError("Error fetching time slots: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUnblock = async (slot) => {
//     setLoading(true);
//     setError(null);
//     const action = slot.status === "Blocked" ? "unblock" : "block";

//     try {
//       if (slot.status === "Blocked") {
//         await unblockTimeSlots(gobaldate, [slot.time]);
//         toast.success(`Slot ${slot.time} unblocked successfully!`);
//       } else if (slot.status === "Available") {
//         await blockTimeSlots(gobaldate, [slot.time]);
//         toast.success(`Slot ${slot.time} blocked successfully!`);
//       }
//       // Refetch the time slots to get the updated data
//       await fetchTimeSlots(date);
//     } catch (error) {
//       toast.error(`Error ${action}ing time slot: ` + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Available":
//         return <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />;
//       case "Blocked":
//         return <LockClosedIcon className="w-5 h-5 text-red-500 mr-2" />;
//       case "Booked":
//         return <UserIcon className="w-5 h-5 text-blue-500 mr-2" />;
//       default:
//         return null;
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error)
//     return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-4 py-2 text-left">Time Slot</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {timeSlots.map((slot) => (
//               <motion.tr
//                 key={slot.time}
//                 whileHover={{ backgroundColor: "#f3f4f6" }}
//                 className="border-b"
//               >
//                 <td className="px-4 py-2">{slot.time}</td>
//                 <td className="px-4 py-2">
//                   <div className="flex items-center">
//                     {getStatusIcon(slot.status)}
//                     <span className="capitalize">{slot.status}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-2">
//                   {slot.status !== "Booked" && (
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleBlockUnblock(slot)}
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         slot.status === "Blocked"
//                           ? "bg-green-100 text-green-700 hover:bg-green-200"
//                           : "bg-red-100 text-red-700 hover:bg-red-200"
//                       }`}
//                       disabled={loading} // Disable button during loading
//                     >
//                       {loading ? (
//                         <>
//                           <span className="animate-spin w-4 h-4 inline mr-1">
//                             🔄
//                           </span>{" "}
//                           {/* Add loading spinner */}
//                           Processing...
//                         </>
//                       ) : slot.status === "Blocked" ? (
//                         <>
//                           <LockOpenIcon className="w-4 h-4 inline mr-1" />
//                           Unblock
//                         </>
//                       ) : (
//                         <>
//                           <LockClosedIcon className="w-4 h-4 inline mr-1" />
//                           Block
//                         </>
//                       )}
//                     </motion.button>
//                   )}
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default TimeSlotManager;
