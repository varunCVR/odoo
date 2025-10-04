import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {user.roles.includes("ADMIN") && (
          <>
            <Link to="/admin/manage-users">Users</Link>
            <Link to="/admin/manage-rules">Rules</Link>
            <Link to="/admin/reports">Reports</Link>
            <Link to="/admin/audit-logs">Audit</Link>
          </>
        )}
        {user.roles.includes("MANAGER") && (
          <Link to="/manager/approvals">Approvals</Link>
        )}
        {user.roles.includes("EMPLOYEE") && (
          <>
            <Link to="/employee/submit-expense">Submit Expense</Link>
            <Link to="/employee/my-expenses">My Expenses</Link>
          </>
        )}
      </div>
      <div>
        <span className="mr-4">{user.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
