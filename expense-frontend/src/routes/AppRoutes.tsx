import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard"; // we’ll make this role-aware
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageApprovalRules from "../pages/admin/ManageApprovalRules";
import Reports from "../pages/admin/Reports";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import SubmitExpense from "../pages/SubmitExpense";
import MyExpenses from "../pages/employee/MyExpenses";
import ApprovalsInbox from "../pages/ApprovalsInbox";
import AuditLogs from "../pages/admin/AuditLogs";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import { useAuth } from "../auth/AuthProvider";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-rules" element={<ManageApprovalRules />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />

        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/submit-expense" element={<SubmitExpense />} />
        <Route path="/employee/my-expenses" element={<MyExpenses />} />

        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/approvals" element={<ApprovalsInbox />} />


        <Route path="/admin/audit-logs" element={<AuditLogs />} />

      </Routes>
    </BrowserRouter>
  );
}
