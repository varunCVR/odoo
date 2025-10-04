import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // user.roles is coming from backend (e.g. ["ADMIN"], ["EMPLOYEE"], ["MANAGER"])
  if (user.roles.includes("ADMIN")) {
    return <Navigate to="/admin" />;
  }

  if (user.roles.includes("MANAGER")) {
    return <Navigate to="/manager" />;
  }

  if (user.roles.includes("EMPLOYEE")) {
    return <Navigate to="/employee" />;
  }

  // Fallback if no role found
  return <div className="p-6">No dashboard available for your role.</div>;
}
