import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Loading from "./Loading";
import ProtectedRoute from "./PrivateRoute";

const ServiceBookingForm = lazy(() =>
  import("../components/ServiceBookingForm/index")
);
const LoginPage = lazy(() => import("../components/Admin/LoginPage"));
const ForgotPassword = lazy(() => import("../components/Admin/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/Admin/ResetPassword"));
const VerifyToken = lazy(() => import("../components/Admin/VerifyToken"));
const CustomerList = lazy(() => import("../components/Admin/CustomerList"));
const DashboardLayout = lazy(() =>
  import("../components/Admin/DashboardLayout")
);
const UserProfile = lazy(() => import("../components/Admin/UserProfile"));

const BookingbyAdminForm = lazy(() =>
  import("../components/Admin/BookingbyAdminForm")
);
const BookingCalendar = lazy(() =>
  import("../components/Admin/BookingCalendar")
);
const BookingManagement = lazy(() =>
  import("../components/Admin/BookingManagement")
);
const SlotManager = lazy(() => import("../components/Admin/SlotManager"));

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/booking/">
      <AuthProvider>
        {/* Suspense wrapper for lazy loading */}
        <Suspense
          fallback={
            <div>
              <Loading></Loading>
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ServiceBookingForm />} />
            {/* Authentication Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-token/:token" element={<VerifyToken />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<UserProfile />} />
                <Route
                  path="booking/customer"
                  element={<BookingbyAdminForm />}
                />
                <Route
                  path="booking/calender"
                  element={<BookingManagement />}
                />
                <Route path="booking/slotmanager" element={<SlotManager />} />
              </Route>
            </Route>
            {/* <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="booking/customer"
                element={
                  <ProtectedRoute>
                    <BookingbyAdminForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="booking/calender"
                element={
                  <ProtectedRoute>
                    <BookingManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="booking/slotmanager"
                element={
                  <ProtectedRoute>
                    <SlotManager />
                  </ProtectedRoute>
                }
              />
            </Route> */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
