import axios from "axios";

export const publicApi = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
  timeout: 120000,
});
export const privateApi = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
  timeout: 120000,
});

//************ PUBLIC API END POINT *******************/
//************ PUBLIC API END POINT *******************/

//User Registration
export const refreshAccessToken = async () => {
  try {
    const response = await publicApi.post("auth/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await publicApi.post("/users/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await publicApi.post("/users/forget", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getResetPasswordToken = async (token) => {
  try {
    const response = await publicApi.get(
      `/users/reset-password-token/${token}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (password, confirmPassword, token) => {
  try {
    const response = await publicApi.patch(
      `/users/reset-password/?token=${token}`,
      { password, confirmPassword }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
//User Registration
export const checkCustomer = async (formData) => {
  try {
    const response = await publicApi.post("/payments/check", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCustomer = async (formData) => {
  try {
    const response = await publicApi.post("/payments/create", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const capturePayment = async (paymentDetails) => {
  try {
    const response = await publicApi.post(
      "/payments/capture-payment",
      paymentDetails
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelPayment = async (bookingId) => {
  try {
    const response = await publicApi.post(`/payments/${bookingId}/cancel`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAvailableTimeSlots = async (date) => {
  try {
    const response = await publicApi.get(
      `/customers/available/slot?date=${date}`,
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
    const response = await publicApi.get(
      `/customers/slots/times-slots`,
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
    const response = await publicApi.get(
      `/customers/slots/disbale-date`,
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
//************ PUBLIC API END POINT *******************/

//************ PRIVATE API END POINT *******************/
export const checkAuth = async () => {
  try {
    const response = await privateApi.get("/auth/check-auth");
    return response;
  } catch (error) {
    return false;
  }
};
export const logout = async () => {
  try {
    const response = await privateApi.post("/users/logout");
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
    const response = await privateApi.get(
      `/customers?page=${
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
    const response = await privateApi.get(`/customers/${customerId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomerById = async (id) => {
  try {
    const response = await privateApi.delete(`/customers/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCustomerByAdmin = async (formData) => {
  try {
    const response = await privateApi.post(`/customers/create`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const blockTimeSlots = async (date, slots) => {
  try {
    const response = await privateApi.patch(
      "/customers/blocktimeslots/",
      { date, slots },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error blocking time slots:", error);
    throw error;
  }
};

export const unblockTimeSlots = async (date, slots) => {
  try {
    const response = await privateApi.patch(
      "/customers/unblocktimeslots/",
      { date, slots },
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

//************ PRIVATE API END POINT *******************/
// Reset Password

//update account password
export const updateAccount = async (fullName, email, mobileNo) => {
  try {
    const response = await privateApi.patch(`/api/users/update-account`, {
      fullName,
      email,
      mobileNo,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const refundCustomer = async (orderId, amount, refundReason) => {
  try {
    const response = await privateApi.post("/refund", {
      captureId: orderId,
      refundAmount: amount,
      refundReason,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const UpdateCustomerByAdmin = async (customerId, formData) => {
  try {
    const response = await privateApi.patch(
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
