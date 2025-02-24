import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCustomerById, UpdateCustomerByAdmin } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
const isWeekday = (date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  error,
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 px-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 ${
        error ? "border-red-500" : ""
      }`}
      placeholder={label}
      required={required}
    />
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}) => (
  <div className="relative">
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 px-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 appearance-none ${
        error ? "border-red-500" : ""
      }`}
      required={required}
    >
      <option value="" disabled hidden>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    <ChevronDownIcon className="absolute right-0 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  makeAndModel: "",
  registrationNo: "",
  selectedDate: null,
  selectedTimeSlot: null,
  howDidYouHearAboutUs: "",
  awareOfCancellationPolicy: false,
  totalPrice: "43.20",
  paymentMethod: "PayPal",
};

const TIME_SLOT_OPTIONS = [
  { value: "9:00", label: "9:00" },
  { value: "9:45", label: "9:45" },
  { value: "10:30-", label: "10:30" },
  { value: "11:15", label: "11:15" },
  { value: "12:00", label: "12:00-" },
  { value: "12:45", label: "12:45" },
  { value: "1:30", label: "1:30" },
  { value: "2:15", label: "2:15" },
];

const UpdateBookingbyAdminForm = ({
  isOpen,
  onClose,
  customerId,
  fetchCustomers,
}) => {
  if (!isOpen) return null;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === "" &&
        key !== "file" &&
        key !== "photos" && // Exclude photos field from general validation
        key !== "message" &&
        key !== "gutterCleaningOptions"
      ) {
        newErrors[key] = "This field is required";
      }
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!/^\d{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = "Please select the number of bedrooms";
    }
    if (!formData.selectedDate) {
      newErrors.selectedDate = "Please select a date";
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = "Please select the number of bedrooms";
    }
    if (
      formData.selectService === "Gutter Repair" &&
      formData.gutterRepairsOptions.length === 0
    ) {
      newErrors.gutterRepairsOptions =
        "Please select at least one repair service";
    }
    if (errors.photos && errors.photos.length > 0) {
      newErrors.photos = errors.photos;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  useEffect(() => {
    const getCustomerDetails = async () => {
      try {
        const response = await getCustomerById(customerId);
        setFormData(response.data.data); // Assuming response.data contains customer details
      } catch (error) {
        toast.error("Failed to fetch customer details.");
      }
    };

    getCustomerDetails();
  }, [customerId]);
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prevState) => {
        const newFormData = { ...prevState, [name]: value };
        if (errors[name]) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
        return newFormData;
      });
    },
    [errors]
  );

  const handleDateChange = useCallback(
    (date) => {
      const localDate = new Date(date);
      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );
      const UTC_date = utcDate.toISOString();
      setFormData((prevState) => ({
        ...prevState,
        selectedDate: UTC_date,
      }));
      if (errors.selectedDate) {
        setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" }));
      }
    },
    [errors]
  );
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formDataWithPrice = 43.2;

      if (!formDataWithPrice) {
        toast.error("No booking data available.");
        return;
      }
      if (!validateForm()) {
        toast.error("Please correct the form errors before submitting.");
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      if (totalPrice === 0) {
        toast.error("Total price cannot be 0. Please review your selections.");
        return;
      }
      try {
        const response = await UpdateCustomerByAdmin(
          customerId,
          formDataWithPrice
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchCustomers(); // Refresh the customer list
          onClose(); // Close the modal after fetching
        } else {
          toast.error(
            response.message || "An error occurred while checking the customer."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again later."
        );
      }
    },
    [formData, totalPrice, errors, validateForm]
  );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="w-full max-w-xl max-h-[80vh] overflow-y-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 bg-slate-600 hover:bg-slate-700 text-white p-2"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
              Edit Customer
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label="Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  error={errors.customerName}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  error={errors.email}
                />
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  error={errors.contactNumber}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <DatePicker
                    selected={formData.selectedDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={handleDateChange}
                    filterDate={isWeekday}
                    className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
                      errors.selectedDate ? "border-red-500" : ""
                    }`}
                    placeholderText="Select Date"
                    required
                  />

                  <label
                    className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
                      errors.selectedDate
                        ? "text-red-500"
                        : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
                    }`}
                  >
                    Date
                  </label>
                  {errors.selectedDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.selectedDate}
                    </p>
                  )}
                </div>
                <SelectField
                  label="Time Slot"
                  name="selectedTimeSlot"
                  value={formData.selectedTimeSlot}
                  onChange={handleInputChange}
                  options={TIME_SLOT_OPTIONS}
                  required
                  error={errors.selectedTimeSlot}
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label="Make and Model"
                  name="makeAndModel"
                  value={formData.makeAndModel}
                  onChange={handleInputChange}
                  required
                  error={errors.makeAndModel}
                />
                <InputField
                  label="Registration Number"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  required
                  error={errors.registrationNo}
                />
                <div className="relative">
                  <label className="text-sm text-gray-600">
                    Aware of Cancellation Policy
                  </label>
                  <input
                    type="checkbox"
                    name="awareOfCancellationPolicy"
                    checked={formData.awareOfCancellationPolicy || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500"
                  />
                  {errors.awareOfCancellationPolicy && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.awareOfCancellationPolicy}
                    </p>
                  )}
                </div>
                <InputField
                  label="How did you hear about us?"
                  name="howDidYouHearAboutUs"
                  value={formData.howDidYouHearAboutUs}
                  onChange={handleInputChange}
                  required
                  error={errors.howDidYouHearAboutUs}
                />
              </div>
              <div>
                <div className="mt-6 mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Total Price (Including VAT)
                    </h3>
                    <div className="text-2xl font-bold text-blue-700">
                      £{formData.totalPrice}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Booking
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // return (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     exit={{ opacity: 0 }}
  //     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  //   >
  //     <div className="w-full max-w-xl max-h-[80vh] overflow-y-auto">
  //       <motion.div
  //         initial={{ y: -50, opacity: 0 }}
  //         animate={{ y: 0, opacity: 1 }}
  //         exit={{ y: -50, opacity: 0 }}
  //         className="bg-white shadow-lg rounded-lg overflow-hidden"
  //       >
  //         <div className="px-4 py-5 sm:p-6 relative">
  //           <button
  //             onClick={onClose}
  //             className="absolute top-0 right-0 bg-slate-600 hover:bg-slate-700 text-white p-2"
  //             aria-label="Close"
  //           >
  //             <XMarkIcon className="h-6 w-6" />
  //           </button>
  //           <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
  //             Edit Customer
  //           </h1>
  //           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
  //             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
  //               <InputField
  //                 label="Name"
  //                 name="customerName"
  //                 value={formData.customerName}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.customerName}
  //               />
  //               <InputField
  //                 label="Email"
  //                 name="email"
  //                 type="email"
  //                 value={formData.email}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.email}
  //               />
  //               <InputField
  //                 label="Contact Number"
  //                 name="contactNumber"
  //                 value={formData.contactNumber}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.contactNumber}
  //               />
  //               <InputField
  //                 label="First Line of Address"
  //                 name="firstLineOfAddress"
  //                 value={formData.firstLineOfAddress}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.firstLineOfAddress}
  //               />
  //               <InputField
  //                 label="Town"
  //                 name="town"
  //                 value={formData.town}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.town}
  //               />
  //               <InputField
  //                 label="Postcode"
  //                 name="postcode"
  //                 value={formData.postcode}
  //                 onChange={handleInputChange}
  //                 required
  //                 error={errors.postcode}
  //               />
  //             </div>
  //             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
  //               <div className="relative">
  //                 <DatePicker
  //                   selected={formData.selectedDate}
  //                   dateFormat="dd/MM/yyyy"
  //                   onChange={handleDateChange}
  //                   //   minDate={new Date("2024-11-01")}
  //                   filterDate={isWeekday}
  //                   className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
  //                     errors.selectedDate ? "border-red-500" : ""
  //                   }`}
  //                   placeholderText="Select Date"
  //                   required
  //                 />

  //                 <label
  //                   className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
  //                     errors.selectedDate
  //                       ? "text-red-500"
  //                       : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
  //                   }`}
  //                 >
  //                   Date
  //                 </label>
  //                 {errors.selectedDate && (
  //                   <p className="mt-1 text-xs text-red-500">
  //                     {errors.selectedDate}
  //                   </p>
  //                 )}
  //               </div>
  //               <SelectField
  //                 label="Time Slot"
  //                 name="selectedTimeSlot"
  //                 value={formData.selectedTimeSlot}
  //                 onChange={handleInputChange}
  //                 options={TIME_SLOT_OPTIONS}
  //                 required
  //                 error={errors.selectedTimeSlot}
  //               />
  //             </div>
  //             <></>
  //             <div>
  //               <div className="mt-6 mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
  //                 <div className="flex justify-between items-center">
  //                   <h3 className="text-lg font-semibold text-gray-800">
  //                     Total Price (Including VAT)
  //                   </h3>
  //                   <div className="text-2xl font-bold text-blue-700">
  //                     £{totalPrice}
  //                   </div>
  //                 </div>
  //               </div>
  //               <div></div>
  //               <motion.button
  //                 whileHover={{ scale: 1.05 }}
  //                 whileTap={{ scale: 0.95 }}
  //                 type="submit"
  //                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //               >
  //                 Update Booking
  //               </motion.button>
  //             </div>
  //           </form>
  //         </div>
  //       </motion.div>
  //       {/* <ToastContainer position="top-center" autoClose={5000} /> */}
  //     </div>
  //   </motion.div>
  // );
};

export default UpdateBookingbyAdminForm;
