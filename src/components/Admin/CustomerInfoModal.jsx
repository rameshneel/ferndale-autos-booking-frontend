import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getCustomerById } from "../../services/api";

const CustomerInfoModal = ({ isOpen, onClose, customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (!customerId) return;
      setLoading(true);
      try {
        const response = await getCustomerById(customerId);
        setCustomer(response.data.data);
      } catch (err) {
        setError("Failed to fetch customer information");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, [customerId]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customer Info</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {loading && <p>Loading customer information...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {customer && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{customer.customerName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{customer.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact Number</h3>
                <p>{customer.contactNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>
                  {customer.firstLineOfAddress}, {customer.town},{" "}
                  {customer.postcode}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{new Date(customer.selectedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Time Slot</h3>
                <p>{customer.selectedTimeSlot}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Price</h3>
                <p>£{customer.totalPrice}</p>
              </div>
              <div>
                <h3 className="font-semibold">Service</h3>
                <p>{customer.selectService}</p>
              </div>
              <div>
                <h3 className="font-semibold">Gutter Cleaning Options</h3>
                <p>{customer.gutterCleaningOptions.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold">Gutter Repairs Options</h3>
                <p>
                  {customer.gutterRepairsOptions.length
                    ? customer.gutterRepairsOptions.join(", ")
                    : "None"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Number Of Bedrooms</h3>
                <p>{customer.numberOfBedrooms}</p>
              </div>
              <div>
                <h3 className="font-semibold">Home Style</h3>
                <p>{customer.selectHomeStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold">Message</h3>
                <p>{customer.message}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Method</h3>
                <p>{customer.paymentMethod}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Status</h3>
                <p>{customer.paymentStatus}</p>
              </div>
              <div>
                <h3 className="font-semibold">Order ID</h3>
                <p>{customer.paypalOrderId}</p>
              </div>
              {customer. molliePaymentId &&<div>
                <h3 className="font-semibold"> mollie Payment Id</h3>
                <p>{customer. molliePaymentId}</p>
              </div>}
              <div>
                <h3 className="font-semibold">Booking Status</h3>
                <p>{customer.isBooked ? "Booked" : "Not Booked"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Booked By</h3>
                <p>{customer.bookedBy}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Status</h3>
                <p>{customer.paymentStatus}</p>
              </div>
              {/* <div>
                <h4 className="font-medium">Capture ID:</h4>
                <p>{customer.captureId || "N/A"}</p>
              </div> */}
              <div>
                <h4 className="font-medium">Refund ID:</h4>
                <p>{customer.refundId || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Refund Status:</h4>
                <p>{customer.refundStatus || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Refund Amount:</h4>
                <p>
                  {customer.refundAmount !== undefined
                    ? `£${customer.refundAmount.toFixed(2)}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Refund Reason:</h4>
                <p>{customer.refundReason || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Refund Date:</h4>
                <p>
                  {customer.refundDate
                    ? new Date(customer.refundDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Created At</h3>
                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerInfoModal;
