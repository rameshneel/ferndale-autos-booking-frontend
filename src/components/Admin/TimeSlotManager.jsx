import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, LockClosedIcon, LockOpenIcon, UserIcon } from '@heroicons/react/24/outline';
import { getAvailableTimeSlots, blockTimeSlots, unblockTimeSlots } from '../../services/api';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TimeSlotManager = ({ date }) => {
  function formatDateForBackend(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format 'YYYY-MM-DD'
}
const gobaldate=formatDateForBackend(date)

  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (date) {
      fetchTimeSlots(date);
    }
  }, [date]);

  const fetchTimeSlots = async (selectedDate) => {
    const datechange= formatDateForBackend(selectedDate)
    setLoading(true);
    setError(null);
    // const localFormattedDate =  selectedDate.toISOString().split('T')[0];
    try {
      const response = await getAvailableTimeSlots(datechange);
      // console.log("responce",response);
      
      if (response.data.statusCode=== 200 && response.data.success) {
        setTimeSlots(response.data.data);
      } else {
        throw new Error(response.message || 'Failed to fetch time slots');
      }
    } catch (error) {
      setError('Error fetching time slots: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (slot) => {
    setLoading(true);
    setError(null);
    const action = slot.status === 'Blocked' ? 'unblock' : 'block';
    
    try {
      if (slot.status === 'Blocked') {
        await unblockTimeSlots(gobaldate, [slot.time]);
        toast.success(`Slot ${slot.time} unblocked successfully!`);
      } else if (slot.status === 'Available') {
        await blockTimeSlots(gobaldate, [slot.time]);
        toast.success(`Slot ${slot.time} blocked successfully!`);
      }
      // Refetch the time slots to get the updated data
      await fetchTimeSlots(date);
    } catch (error) {
      toast.error(`Error ${action}ing time slot: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />;
      case 'Blocked':
        return <LockClosedIcon className="w-5 h-5 text-red-500 mr-2" />;
      case 'Booked':
        return <UserIcon className="w-5 h-5 text-blue-500 mr-2" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    // <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    //   {/* <h2 className="text-xl font-semibold p-4 bg-gray-100">
    //     Time Slots for {date.toLocaleDateString()}
    //   </h2> */}
    //   <div className="overflow-x-auto">
    //     <table className="w-full">
    //       <thead>
    //         <tr className="bg-gray-50">
    //           <th className="px-4 py-2 text-left">Time Slot</th>
    //           <th className="px-4 py-2 text-left">Status</th>
    //           <th className="px-4 py-2 text-left">Action</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {timeSlots.map((slot) => (
    //           <motion.tr
    //             key={slot.time}
    //             whileHover={{ backgroundColor: '#f3f4f6' }}
    //             className="border-b"
    //           >
    //             <td className="px-4 py-2">{slot.time}</td>
    //             <td className="px-4 py-2">
    //               <div className="flex items-center">
    //                 {getStatusIcon(slot.status)}
    //                 <span className="capitalize">{slot.status}</span>
    //               </div>
    //             </td>
    //             <td className="px-4 py-2">
    //               {slot.status !== 'Booked' && (
    //                 <motion.button
    //                   whileHover={{ scale: 1.05 }}
    //                   whileTap={{ scale: 0.95 }}
    //                   onClick={() => handleBlockUnblock(slot)}
    //                   className={`px-3 py-1 rounded-full text-sm ${
    //                     slot.status === 'Blocked'
    //                       ? 'bg-green-100 text-green-700 hover:bg-green-200'
    //                       : 'bg-red-100 text-red-700 hover:bg-red-200'
    //                   }`}
    //                   disabled={loading}
    //                 >
    //                   {slot.status === 'Blocked' ? (
    //                     <>
    //                       <LockOpenIcon className="w-4 h-4 inline mr-1" />
    //                       Unblock
    //                     </>
    //                   ) : (
    //                     <>
    //                       <LockClosedIcon className="w-4 h-4 inline mr-1" />
    //                       Block
    //                     </>
    //                   )}
    //                 </motion.button>
    //               )}
    //             </td>
    //           </motion.tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    //   <ToastContainer />
    // </div>
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Time Slot</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <motion.tr
              key={slot.time}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              className="border-b"
            >
              <td className="px-4 py-2">{slot.time}</td>
              <td className="px-4 py-2">
                <div className="flex items-center">
                  {getStatusIcon(slot.status)}
                  <span className="capitalize">{slot.status}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                {slot.status !== 'Booked' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBlockUnblock(slot)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      slot.status === 'Blocked'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                    disabled={loading} // Disable button during loading
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin w-4 h-4 inline mr-1">🔄</span> {/* Add loading spinner */}
                        Processing...
                      </>
                    ) : slot.status === 'Blocked' ? (
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
    <ToastContainer />
  </div>
  );
};

export default TimeSlotManager;

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { CheckCircleIcon, XCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
// import { getAvailableTimeSlots, blockTimeSlots, unblockTimeSlots } from '../../services/api';
// import { ToastContainer, toast } from "react-toastify"; 
// import 'react-toastify/dist/ReactToastify.css'; 

// const TimeSlotManager = ({ date }) => {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (date) {
//       fetchTimeSlots(date);
//     }
//   }, [date]);

//   const fetchTimeSlots = async (selectedDate) => {
//     setLoading(true);
//     setError(null);
//     const localFormattedDate = selectedDate.toLocaleDateString('en-CA');
//     try {
//       const response = await getAvailableTimeSlots(localFormattedDate);
//       // Update status based on fetched data
//       const updatedSlots = response.data.data.map(slot => ({
//         ...slot,
//         isBlocked: slot.status === 'Blocked', // Set isBlocked based on status
//       }));
//       setTimeSlots(updatedSlots);
//     } catch (error) {
//       setError('Error fetching time slots: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUnblock = async (slot) => {
//     setLoading(true);
//     setError(null);
//     const action = slot.isBlocked ? 'unblock' : 'block';
    
//     try {
//       if (slot.isBlocked) {
//         await unblockTimeSlots(date.toLocaleDateString('en-CA'), [slot.time]);
//         toast.success(`Slot ${slot.time} unblocked successfully!`);
//       } else {
//         await blockTimeSlots(date.toLocaleDateString('en-CA'), [slot.time]);
//         toast.success(`Slot ${slot.time} blocked successfully!`);
//       }
//       setTimeSlots(prevSlots =>
//         prevSlots.map(s =>
//           s.time === slot.time ? { ...s, isBlocked: !s.isBlocked } : s
//         )
//       );
//     } catch (error) {
//       toast.error(`Error ${action}ing time slot: ` + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <h2 className="text-xl font-semibold p-4 bg-gray-100">
//         Time Slots for {date.toLocaleDateString()}
//       </h2>
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
//             {timeSlots.map((slot) => {
//               return (
//                 <motion.tr
//                   key={slot.time}
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   className="border-b"
//                 >
//                   <td className="px-4 py-2">{slot.time}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       {slot.isBlocked && <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />}
//                       {!slot.isBlocked && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
//                       <span className="capitalize">{slot.isBlocked ? 'Blocked' : 'Available'}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     {slot.status !== 'Booked' && (
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleBlockUnblock(slot)}
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           slot.isBlocked
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-red-100 text-red-700 hover:bg-red-200'
//                         }`}
//                         disabled={loading}
//                       >
//                         {slot.isBlocked ? (
//                           <>
//                             <LockOpenIcon className="w-4 h-4 inline mr-1" />
//                             Unblock
//                           </>
//                         ) : (
//                           <>
//                             <LockClosedIcon className="w-4 h-4 inline mr-1" />
//                             Block
//                           </>
//                         )}
//                       </motion.button>
//                     )}
//                   </td>
//                 </motion.tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default TimeSlotManager;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { CheckCircleIcon, XCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
// import { getAvailableTimeSlots, blockTimeSlots, unblockTimeSlots } from '../../services/api';
// // import toast from 'react-hot-toast';
// import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer
// import 'react-toastify/dist/ReactToastify.css'; // Import toast from react-hot-toast

// const TimeSlotManager = ({ date }) => {

//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (date) {
//       fetchTimeSlots(date);
//     }
//   }, [date]);

//   const fetchTimeSlots = async (selectedDate) => {
//     setLoading(true);
//     setError(null);
//     const localFormattedDate = selectedDate.toLocaleDateString('en-CA');
//     // const UTC_date = selectedDate.toISOString().split('T')[0];
//     try {
//       const response = await getAvailableTimeSlots(localFormattedDate);
//       setTimeSlots(response.data.data || []);
//     } catch (error) {
//       setError('Error fetching time slots: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUnblock = async (slot) => {
//     setLoading(true);
//     setError(null);
//     const action = slot.isBlocked ? 'unblock' : 'block';
    
//     try {
//       if (slot.isBlocked) {
//         await unblockTimeSlots(date.toLocaleDateString('en-CA'), [slot.time]);
//         toast.success(`Slot ${slot.time} unblocked successfully!`);
//       } else {
//         await blockTimeSlots(date.toLocaleDateString('en-CA'), [slot.time]);
//         toast.success(`Slot ${slot.time} blocked successfully!`);
//       }
//       // Update the local state to reflect the change
//       setTimeSlots(prevSlots =>
//         prevSlots.map(s =>
//           s.time === slot.time ? { ...s, isBlocked: !s.isBlocked } : s
//         )
//       );
//     } catch (error) {
//       toast.error(`Error ${action}ing time slot: ` + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <h2 className="text-xl font-semibold p-4 bg-gray-100">
//         Time Slots for {date.toLocaleDateString()}
//       </h2>
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
//             {timeSlots.map((slot) => {
//               return (
//                 <motion.tr
//                   key={slot.time}
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   className="border-b"
//                 >
//                   <td className="px-4 py-2">{slot.time}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       {slot.status === 'Available' && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
//                       {slot.status === 'Booked' && <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />}
//                       {slot.status === 'Blocked' && <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />}
//                       <span className="capitalize">{slot.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     {slot.status !== 'Booked' && (
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleBlockUnblock(slot)}
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           slot.status === 'Blocked'
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-red-100 text-red-700 hover:bg-red-200'
//                         }`}
//                         disabled={loading}
//                       >
//                         {slot.status === 'Blocked' ? (
//                           <>
//                             <LockOpenIcon className="w-4 h-4 inline mr-1" />
//                             Unblock
//                           </>
//                         ) : (
//                           <>
//                             <LockClosedIcon className="w-4 h-4 inline mr-1" />
//                             Block
//                           </>
//                         )}
//                       </motion.button>
//                     )}
//                   </td>
//                 </motion.tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotManager;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { CheckCircleIcon, XCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
// import { getAvailableTimeSlots, blockTimeSlots, unblockTimeSlots } from '../../services/api';

// const TimeSlotManager = ({ date }) => {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     if (date) {
//       fetchTimeSlots(date);
//     }
//   }, [date]);

//   const fetchTimeSlots = async (selectedDate) => {
//     setLoading(true);
//     setError(null);
//     const UTC_date = selectedDate.toISOString().split('T')[0];
//     try {
//       const response = await getAvailableTimeSlots(UTC_date);
//       setTimeSlots(response.data.data || []);
//     } catch (error) {
//       setError('Error fetching time slots: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUnblock = async (slot) => {
//     setLoading(true);
//     setError(null);
//     const action = slot.isBlocked ? 'unblock' : 'block';
    
//     try {
//       if (slot.isBlocked) {
//         await unblockTimeSlots(date.toISOString().split('T')[0], [slot.time]);
//       } else {
//         await blockTimeSlots(date.toISOString().split('T')[0], [slot.time]);
//       }
//       // Update the local state to reflect the change
//       setTimeSlots(prevSlots =>
//         prevSlots.map(s =>
//           s.time === slot.time ? { ...s, isBlocked: !s.isBlocked } : s
//         )
//       );
//     } catch (error) {
//       setError(`Error ${action}ing time slot: ` + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const getSlotStatus = (slot) => {
//   //   if (slot.isBlocked) return 'blocked';
//   //   if (slot.bookedBy) return 'booked';
//   //   return 'available';
//   // };
//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <h2 className="text-xl font-semibold p-4 bg-gray-100">
//         Time Slots for {date.toLocaleDateString()}
//       </h2>
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
//             {timeSlots.map((slot) => { 
//               console.log("slotfdf",slot);
              
//               // const status = getSlotStatus(slot);
//               return (
//                 <motion.tr
//                   key={slot.time}
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   className="border-b"
//                 >
//                   <td className="px-4 py-2">{slot.time}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       {slot.status === 'Available' && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
//                       {slot.status === 'Booked' && <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />}
//                       {slot.status === 'Blocked' && <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />}
//                       <span className="capitalize">{slot.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     {slot.status !== 'Booked' && (
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleBlockUnblock(slot)}
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           slot.status === 'Blocked'
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-red-100 text-red-700 hover:bg-red-200'
//                         }`}
//                         disabled={loading}
//                       >
//                         {slot.status === 'Blocked' ? (
//                           <>
//                             <LockOpenIcon className="w-4 h-4 inline mr-1" />
//                             Unblock
//                           </>
//                         ) : (
//                           <>
//                             <LockClosedIcon className="w-4 h-4 inline mr-1" />
//                             Block
//                           </>
//                         )}
//                       </motion.button>
//                     )}
//                   </td>
//                 </motion.tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotManager;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { CheckCircleIcon, XCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

// const TimeSlotManager = ({ date }) => {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (date) {
//       fetchTimeSlots(date);
//     }
//   }, [date]);

//   const fetchTimeSlots = async (selectedDate) => {
//     setLoading(true);
//     setError(null);
//     const UTC_date = selectedDate.toISOString().split('T')[0];
//     try {
//       const response = await fetch(`http://localhost:4000/api/customers/available/slot?date=${UTC_date}`);
//       if (response.ok) {
//         const data = await response.json();
//         setTimeSlots(data.availableSlots || []);
//       } else {
//         setError('Failed to fetch time slots');
//       }
//     } catch (error) {
//       setError('Error fetching time slots: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUnblock = async (slot) => {
//     setLoading(true);
//     setError(null);
//     const action = slot.isBlocked ? 'unblock' : 'block';
//     try {
//       const response = await fetch('http://localhost:4000/api/admin/time-slots/block-unblock', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           date: date.toISOString().split('T')[0],
//           slot: slot.time,
//           action: action,
//         }),
//       });
//       if (response.ok) {
//         // Update the local state to reflect the change
//         setTimeSlots(prevSlots =>
//           prevSlots.map(s =>
//             s.time === slot.time ? { ...s, isBlocked: !s.isBlocked } : s
//           )
//         );
//       } else {
//         setError(`Failed to ${action} time slot`);
//       }
//     } catch (error) {
//       setError(`Error ${action}ing time slot: ` + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSlotStatus = (slot) => {
//     if (slot.isBlocked) return 'blocked';
//     if (slot.bookedBy) return 'booked';
//     return 'available';
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <h2 className="text-xl font-semibold p-4 bg-gray-100">
//         Time Slots for {date.toLocaleDateString()}
//       </h2>
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
//             {timeSlots.map((slot) => {
//               const status = getSlotStatus(slot);
//               return (
//                 <motion.tr
//                   key={slot.time}
//                   whileHover={{ backgroundColor: '#f3f4f6' }}
//                   className="border-b"
//                 >
//                   <td className="px-4 py-2">{slot.time}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       {status === 'available' && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />}
//                       {status === 'booked' && <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />}
//                       {status === 'blocked' && <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />}
//                       <span className="capitalize">{status}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     {status !== 'booked' && (
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleBlockUnblock(slot)}
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           status === 'blocked'
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-red-100 text-red-700 hover:bg-red-200'
//                         }`}
//                         disabled={loading}
//                       >
//                         {status === 'blocked' ? (
//                           <>
//                             <LockOpenIcon className="w-4 h-4 inline mr-1" />
//                             Unblock
//                           </>
//                         ) : (
//                           <>
//                             <LockClosedIcon className="w-4 h-4 inline mr-1" />
//                             Block
//                           </>
//                         )}
//                       </motion.button>
//                     )}
//                   </td>
//                 </motion.tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotManager;