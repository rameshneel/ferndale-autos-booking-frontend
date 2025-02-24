import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const slotOptions = [
  { value: "8:30", label: "8:30" },
  { value: "9:00", label: "9:00" },
  { value: "9:45", label: "9:45" },
  { value: "10:30", label: "10:30" },
  { value: "11:15", label: "11:15" },
  { value: "12:00", label: "12:00" },
  { value: "12:30", label: "12:30" },
  { value: "13:00", label: "13:00" },
  { value: "13:30", label: "13:30" },
  { value: "14:00", label: "14:00" },
  { value: "14:30", label: "14:30" },
  { value: "15:00", label: "15:00" },
  { value: "15:30", label: "15:30" },
  { value: "16:00", label: "16:00" },
  { value: "16:30", label: "16:30" },
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

    const url = block
      ? "http://localhost:4000/api/customers/blocktimeslots"
      : "http://localhost:4000/api/customers/unblocktimeslots";
    const slotTimes = selectedSlots.map((slot) => slot.value);

    try {
      setLoading(true);
      await axios.post(url, {
        date: selectedDate,
        slots: slotTimes,
      });

      toast.success(
        block ? "Slots blocked successfully" : "Slots unblocked successfully"
      );
      setSelectedSlots([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update slots. Try again.";
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
          className={`flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => blockTimeSlots(true)}
          disabled={loading}
        >
          <XCircleIcon className="h-5 w-5 mr-2" />
          {loading ? "Blocking..." : "Block Slots"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
