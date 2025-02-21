import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize toast notifications
// toast.configure();

const slotOptions = [
  { value: "9:00-9:45 AM", label: "9:00-9:45 AM" },
  { value: "9:45-10:30 AM", label: "9:45-10:30 AM" },
  { value: "10:30-11:15 AM", label: "10:30-11:15 AM" },
  { value: "11:15-12:00 PM", label: "11:15-12:00 PM" },
  { value: "12:00-12:45 PM", label: "12:00-12:45 PM" },
  { value: "12:45-1:30 PM", label: "12:45-1:30 PM" },
  { value: "1:30-2:15 PM", label: "1:30-2:15 PM" },
  { value: "2:15-3:00 PM", label: "2:15-3:00 PM" },
];

const allOptions = [{ value: "all", label: "Select All" }, ...slotOptions];

const TimeSlotManager = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (options) => {
    const selected = options.some((option) => option.value === "all")
      ? slotOptions
      : options;
    setSelectedSlots(selected);
  };

  const blockTimeSlots = async (block = true) => {
    if (!selectedDate || selectedSlots.length === 0) {
      toast.error("Please select a date and time slots.");
      return;
    }

    const url = block ? "http://localhost:4000/api/customers/blocktimeslots" : "http://localhost:4000/api/customers/unblocktimeslots";
    const slotTimes = selectedSlots.map((slot) => slot.value);

    try {
      setLoading(true);
      await axios.post(url, {
        date: selectedDate,
        slots: slotTimes,
      });

      toast.success(block ? "Slots blocked successfully" : "Slots unblocked successfully");
      setSelectedSlots([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update slots. Try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Time Slots</h2>

      {/* Date Picker */}
      <motion.div whileHover={{ scale: 1.05 }} className="mb-5">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          placeholderText="Select a date"
        />
      </motion.div>

      {/* Slot Selector */}
      <motion.div whileHover={{ scale: 1.05 }} className="mb-5">
        <Select
          options={allOptions}
          isMulti
          value={selectedSlots}
          onChange={handleSelectChange}
          placeholder="Select time slots or Select All"
          classNamePrefix="react-select"
        />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => blockTimeSlots(true)}
          disabled={loading}
        >
          <XCircleIcon className="h-5 w-5 mr-2" />
          {loading ? "Blocking..." : "Block Slots"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => blockTimeSlots(false)}
          disabled={loading}
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {loading ? "Unblocking..." : "Unblock Slots"}
        </motion.button>
      </div>
    </div>
  );
};

export default TimeSlotManager;




// import React, { useState } from "react";
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
// import { motion } from "framer-motion";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Mock slots data
// const slotOptions = [
//   { value: "9:00-9:45 AM", label: "9:00-9:45 AM" },
//   { value: "9:45-10:30 AM", label: "9:45-10:30 AM" },
//   { value: "10:30-11:15 AM", label: "10:30-11:15 AM" },
//   { value: "11:15-12:00 PM", label: "11:15-12:00 PM" },
//   { value: "12:00-12:45 PM", label: "12:00-12:45 PM" },
//   { value: "12:45-1:30 PM", label: "12:45-1:30 PM" },
//   { value: "1:30-2:15 PM", label: "1:30-2:15 PM" },
//   { value: "2:15-3:00 PM", label: "2:15-3:00 PM" },
// ];

// const SlotManager = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlots, setSelectedSlots] = useState([]);
//   const [blockedSlots, setBlockedSlots] = useState([]);

//   const handleBlockSlots = () => {
//     setBlockedSlots([...blockedSlots, ...selectedSlots]);
//     setSelectedSlots([]);
//   };

//   const handleUnblockSlots = () => {
//     setBlockedSlots(blockedSlots.filter(slot => !selectedSlots.includes(slot)));
//     setSelectedSlots([]);
//   };

//   return (
//     <div className="p-5 max-w-md mx-auto bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Manage Time Slots</h2>

//       {/* Date Picker */}
//       <motion.div whileHover={{ scale: 1.05 }} className="mb-4">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//           placeholderText="Select a date"
//         />
//       </motion.div>

//       {/* Slot Selector */}
//       <motion.div whileHover={{ scale: 1.05 }} className="mb-4">
//         <Select
//           options={slotOptions}
//           isMulti
//           value={selectedSlots}
//           onChange={setSelectedSlots}
//           placeholder="Select time slots"
//         />
//       </motion.div>

//       {/* Buttons to Block/Unblock */}
//       <div className="flex justify-between">
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
//           onClick={handleBlockSlots}
//         >
//           <XCircleIcon className="h-5 w-5 mr-2" />
//           Block Slots
//         </motion.button>

//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
//           onClick={handleUnblockSlots}
//         >
//           <CheckCircleIcon className="h-5 w-5 mr-2" />
//           Unblock Slots
//         </motion.button>
//       </div>

//       {/* Blocked Slots Display */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold">Blocked Slots</h3>
//         <ul className="list-disc ml-5 mt-2">
//           {blockedSlots.length > 0 ? (
//             blockedSlots.map((slot, index) => (
//               <motion.li
//                 key={index}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="text-red-600"
//               >
//                 {slot.label}
//               </motion.li>
//             ))
//           ) : (
//             <p>No blocked slots</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SlotManager;
