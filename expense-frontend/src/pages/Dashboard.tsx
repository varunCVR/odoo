import { useAuth } from "../auth/AuthProvider";
import AdminDashboard from "../features/admin/AdminDashboard.tsx";
import EmployeeDashboard from "../features/employee/EmployeeDashboard.tsx";
import ManagerDashboard from "../features/manager/ManagerDashboard.tsx";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "EMPLOYEE":
      return <EmployeeDashboard />;
    default:
      return <p>No dashboard available</p>;
  }
}
