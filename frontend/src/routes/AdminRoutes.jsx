import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminBooking from "../admin/pages/AdminBooking";
import Notification from "../admin/pages/Notification";
import Payments from "../admin/pages/Payments";
import AdminReview from "../admin/pages/AdminReview";
import AdminSetting from "../admin/pages/AdminSetting";
import AdminServices from "../admin/pages/AdminServices";
import AdminSubscription from "../admin/pages/AdminSubscription";
import Users from "../admin/pages/Users";
import Vendor from "../admin/pages/Vendor";
import AdminRoles from "../admin/pages/AdminRoles";
import Problem from "../admin/pages/Problem";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="booking" element={<AdminBooking />} />
        <Route path="notification" element={<Notification />} />
        <Route path="payments" element={<Payments />} />
        <Route path="problem" element={<Problem />} />
        <Route path="review" element={<AdminReview />} />
        <Route path="setting" element={<AdminSetting />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="subscriptions" element={<AdminSubscription />} />
        <Route path="users" element={<Users />} />
        <Route path="vendor" element={<Vendor />} />
        <Route path="adminrole" element={<AdminRoles />} />

        {/* Default redirect: any unknown admin URL goes to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
