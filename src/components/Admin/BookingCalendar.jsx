import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const BookingCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    onDateSelect(selected);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </motion.button>
        <h2 className="text-2xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={handleNextMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <motion.div
            key={i + 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDateClick(i + 1)}
            className={`cursor-pointer text-center p-2 rounded-full ${
              selectedDate &&
              selectedDate.getDate() === i + 1 &&
              selectedDate.getMonth() === currentDate.getMonth()
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// const timeSlots = [
//   "9:00-9:45 AM",
//   "9:45-10:30 AM",
//   "10:30-11:15 AM",
//   "11:15-12:00 PM",
//   "12:00-12:45 PM",
//   "12:45-1:30 PM",
//   "1:30-2:15 PM",
//   "2:15-3:00 PM",
// ];

// const BookingCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [bookings, setBookings] = useState({});
//   console.log("curentt",currentDate);
//   console.log("selected ",selectedDate);
//   console.log("booking",bookings);

      
//   const localDate = new Date(selectedDate);
//   const utcDate = new Date(
//     localDate.getTime() - localDate.getTimezoneOffset() * 60000
//   );
//   const UTC_date = utcDate.toISOString();
//   console.log("smalldate utc",UTC_date)

//   useEffect(() => {
//     // Fetch bookings data from your API
//     const fetchBookings = async () => {
//       // Replace this with your actual API call
//       const response = await fetch(`http://localhost:4000/api/customers/available/slot?date=${UTC_date}`);
//     //   const data = await response.json();
//       setBookings(response.data.data.availableSlots);
//     };
//     fetchBookings();
//   }, []);

//   const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
//   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

//   const handleDateClick = (day) => {
//     const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     setSelectedDate(selectedDate);
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
//   };

//   const getBookingStatus = (date, slot) => {
//     const bookingKey = `${date.toISOString().split('T')[0]}-${slot}`;
//     const booking = bookings[bookingKey];
//     if (!booking) return 'available';
//     if (booking.isBlocked) return 'blocked';
//     if (booking.bookedBy) return 'booked';
//     return 'available';
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
//         <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-200">
//           <ChevronLeftIcon className="w-6 h-6" />
//         </button>
//         <h2 className="text-lg font-semibold">
//           {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
//         </h2>
//         <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-200">
//           <ChevronRightIcon className="w-6 h-6" />
//         </button>
//       </div>
//       <div className="grid grid-cols-7 gap-1 p-2">
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//           <div key={day} className="text-center font-semibold text-gray-600">
//             {day}
//           </div>
//         ))}
//         {Array.from({ length: firstDayOfMonth }, (_, i) => (
//           <div key={`empty-${i}`} />
//         ))}
//         {Array.from({ length: daysInMonth }, (_, i) => (
//           <motion.div
//             key={i + 1}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => handleDateClick(i + 1)}
//             className={`cursor-pointer text-center p-2 rounded-full ${
//               selectedDate &&
//               selectedDate.getDate() === i + 1 &&
//               selectedDate.getMonth() === currentDate.getMonth()
//                 ? 'bg-blue-500 text-white'
//                 : 'hover:bg-gray-100'
//             }`}
//           >
//             {i + 1}
//           </motion.div>
//         ))}
//       </div>
//       {selectedDate && (
//         <div className="p-4 border-t">
//           <h3 className="font-semibold mb-2">
//             {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
//           </h3>
//           <div className="grid grid-cols-2 gap-2">
//             {timeSlots.map((slot) => {
//               const status = getBookingStatus(selectedDate, slot);
//               return (
//                 <motion.div
//                   key={slot}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`p-2 rounded ${
//                     status === 'available'
//                       ? 'bg-green-100 text-green-800'
//                       : status === 'booked'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {slot} - {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingCalendar;