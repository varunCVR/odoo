import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const roles: string[] = Array.isArray(user.roles) ? user.roles : [];

  if (roles.includes("ADMIN")) return <Navigate to="/admin" />;
  if (roles.includes("MANAGER")) return <Navigate to="/manager" />;
  if (roles.includes("EMPLOYEE")) return <Navigate to="/employee" />;

  return <div className="p-6">No dashboard available for your role.</div>;
}
