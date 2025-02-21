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
import React, { useState } from 'react';
import BookingCalendar from './BookingCalendar';
import TimeSlotManager from './TimeSlotManager';

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* <h1 className="text-2xl font-semibold text-gray-800 p-4 bg-gray-100">
          Booking Management
        </h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Select a Date</h2>
            <BookingCalendar onDateSelect={setSelectedDate} />
          </div>
          <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Time Slots</h2>
            {selectedDate ? (
              <TimeSlotManager date={selectedDate} />
            ) : (
              <p className="text-gray-600">Please select a date to manage time slots.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
