import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.tsx";
import Signup from "../pages/Signup.tsx";
import Dashboard from "../pages/Dashboard.tsx"; // placeholder
import { useAuth } from "../auth/AuthProvider.tsx";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
