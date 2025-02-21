// // //src/service/api.jsx
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  //  baseURL: "https://in.prelaunchserver.com/zacks-gutter/api",
  // baseURL: "https://api.zacsgutters.co.uk",
  baseURL: "http://localhost:4000",
  // baseURL: "https://6d7e-2405-201-32-8091-b5c5-4f17-bc04-fece.ngrok-free.app",
  withCredentials: true,
  timeout: 120000,
});
//********* Start *****//public no use milldware karna hai
// Other API Functions
export const checkCustomer = async (formData) => {
  try {
    const response = await api.post("/check", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to create customer
export const createCustomer = async (formData) => {
  try {
    const response = await api.post("/create", formData, {
      // headers: {
      //   "Content-Type": "multipart/form-data", // Ensure the content type is set correctly
      // },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    // toast(response.data.data.message);
    throw error;
  }
};
export const capturePayment = async (paymentDetails) => {
  try {
    const response = await api.post("/capture-payment", paymentDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const capturePaymentforMollie = async (paymentDetails) => {
  try {
    const response = await api.post("/mollie-webhook", paymentDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const handleMolliePaymentWebhook = async (id) => {
  try {
    const response = await api.post("/mollie-webhook", id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelPayment = async (bookingId) => {
  try {
    const response = await api.post(`/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelPaymentForMollie = async (bookingId) => {
  try {
    const response = await api.post(`/${bookingId}/mollie/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const handlePaymentStatusForMollie = async (bookingId) => {
  try {
    const response = await api.get(`/payment/status/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//********* End *****//public no use milldware karna hai

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/users/login", { email, password });

    if (response.status === 200) {
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return {
        success: false,
        message: response.data.message || response.statusText,
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};
export const logout = async () => {
  try {
    await api.post("/api/users/logout");
    setIsAuthenticated(false);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
// Forget Password
export const forgetPassword = async (email) => {
  try {
    const response = await api.post("/api/users/forget", { email });
    return response;
  } catch (error) {
    throw error;
  }
};
// Get Reset Password Token
export const getResetPasswordToken = async (token) => {
  try {
    const response = await api.get(`/api/users/reset-password-token/${token}`);
    return response;
  } catch (error) {
    throw error;
  }
};
// Reset Password
export const resetPassword = async (password, confirmPassword, token) => {
  try {
    const response = await api.patch(
      `/api/users/reset-password/?token=${token}`,
      { password, confirmPassword }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
//update account password
export const updateAccount = async (fullName, email, mobileNo) => {
  try {
    const response = await api.patch(`/api/users/update-account`, {
      fullName,
      email,
      mobileNo,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllDataBooking = async (
  pageIndex,
  pageSize,
  searchTerm = ""
) => {
  try {
    const response = await api.get(
      `/api/customers?page=${
        pageIndex + 1
      }&limit=${pageSize}&search=${searchTerm.trim()}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/api/customers/${customerId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteCustomerById = async (id) => {
  try {
    const response = await api.delete(`/api/customers/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const refundCustomer = async (orderId, amount, refundReason) => {
  try {
    const response = await api.post("/refund", {
      captureId: orderId,
      refundAmount: amount,
      refundReason,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const refundForMollieCustomer = async (
  orderId,
  amount,
  refundReason
) => {
  try {
    const response = await api.post("/mollie/refund", {
      bookingId: orderId,
      amount,
      reason: refundReason,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const createCustomerByAdmin = async (formData) => {
  try {
    const response = await api.post(`/api/customers/create`, formData, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const UpdateCustomerByAdmin = async (customerId, formData) => {
  try {
    const response = await api.patch(
      `/api/customers/${customerId}`,
      JSON.stringify(formData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const blockTimeSlots = async (date, slots) => {
  try {
    const response = await api.patch(
      "/api/customers/blocktimeslots/",
      {
        date,
        slots,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error blocking time slots:", error);
    throw error;
  }
};
export const unblockTimeSlots = async (date, slots) => {
  try {
    const response = await api.patch(
      "/api/customers/unblocktimeslots/",
      {
        date,
        slots,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAvailableTimeSlots = async (date) => {
  try {
    const response = await api.get(
      `/api/customers/available/slot?date=${date}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAvailableTimeSlotsforForm = async (date) => {
  try {
    const response = await api.get(
      `/api/customers/slots/times-slots`,
      { params: { date } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getDisabledDates = async (year, month) => {
  try {
    const response = await api.get(
      `/api/customers/slots/disbale-date`,
      { params: { year, month } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};

export default api;
