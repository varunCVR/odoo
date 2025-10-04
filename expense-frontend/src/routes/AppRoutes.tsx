import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import type { ReactNode } from "react";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageApprovalRules from "../pages/admin/ManageApprovalRules";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import SubmitExpense from "../pages/employee/SubmitExpense";
import MyExpenses from "../pages/employee/MyExpenses";

import ManagerDashboard from "../pages/manager/ManagerDashboard.tsx";
import ApprovalsInbox from "../pages/manager/ApprovalsInbox";

import { useAuth } from "../auth/AuthProvider";
import Navbar from "../components/Navbar";


function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
export default function AppRoutes() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Landing → role-aware */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <RequireAuth>
              <ManageUsers />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/manage-rules"
          element={
            <RequireAuth>
              <ManageApprovalRules />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RequireAuth>
              <Reports />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <RequireAuth>
              <AuditLogs />
            </RequireAuth>
          }
        />

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <RequireAuth>
              <EmployeeDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/employee/submit-expense"
          element={
            <RequireAuth>
              <SubmitExpense />
            </RequireAuth>
          }
        />
        <Route
          path="/employee/my-expenses"
          element={
            <RequireAuth>
              <MyExpenses />
            </RequireAuth>
          }
        />

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <RequireAuth>
              <ManagerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/manager/approvals"
          element={
            <RequireAuth>
              <ApprovalsInbox />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
