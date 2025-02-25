import React, { useState, useMemo, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const BookingCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    onDateSelect(today);
  }, []);

  const { daysInMonth, firstDayOfMonth, nextMonthDays } = useMemo(() => {
    const days = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const totalSlots = 42;
    const remainingSlots = totalSlots - (firstDay + days);
    return {
      daysInMonth: days,
      firstDayOfMonth: firstDay,
      nextMonthDays: remainingSlots > 0 ? remainingSlots : 0,
    };
  }, [currentDate]);

  const handleDateClick = (day, isCurrentMonth = true) => {
    if (isCurrentMonth) {
      const selected = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setSelectedDate(selected);
      onDateSelect(selected);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };

  const dayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-600 text-gray-300 hover:text-teal-400 transition-colors duration-200"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </motion.button>
        <motion.h2
          key={currentDate.toLocaleString()}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-200"
        >
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-600 text-gray-300 hover:text-teal-400 transition-colors duration-200"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-7 gap-1 p-4 grid-rows-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-400 text-sm py-2 border-b border-gray-700"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div
            key={`empty-start-${i}`}
            className="h-10 w-10 mx-auto flex items-center justify-center text-gray-600"
          />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={`current-${day}`}
              variants={dayVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(day, true)}
              className={`cursor-pointer text-center h-10 w-10 mx-auto flex items-center justify-center rounded-full transition-colors duration-200 ${
                isSelected
                  ? "bg-teal-500 text-white"
                  : isTodayDate
                  ? "bg-gray-600 text-teal-400 ring-1 ring-teal-400"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              {day}
            </motion.div>
          );
        })}

        {Array.from({ length: nextMonthDays }, (_, i) => (
          <div
            key={`empty-end-${i}`}
            className="h-10 w-10 mx-auto flex items-center justify-center text-gray-600"
          >
            {i + 1}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BookingCalendar;
