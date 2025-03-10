// import React, { useState } from 'react';
// import BookingCalendar from './BookingCalendar';
// import TimeSlotManager from './TimeSlotManager';

// const BookingManagement = () => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-2 md:grid-cols-2">
//         <BookingCalendar onDateSelect={setSelectedDate} />
//         {selectedDate && <TimeSlotManager date={selectedDate} />}
//       </div>
//     </div>
//   );
// };

// export default BookingManagement;
import React, { useState } from "react";
import BookingCalendar from "./BookingCalendar";
import TimeSlotManager from "./TimeSlotManager";

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="border border-gray-700 p-4 rounded-lg shadow-sm bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">
              Select a Date
            </h2>
            <BookingCalendar onDateSelect={setSelectedDate} />
          </div>
          <div className="border border-gray-700 p-4 rounded-lg shadow-sm bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-teal-400">
              Manage Time Slots
            </h2>
            {selectedDate ? (
              <TimeSlotManager date={selectedDate} />
            ) : (
              <p className="text-gray-400">
                Please select a date to manage time slots.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
