import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { login } from "../api/auth";

export default function Login() {
  const { login: setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    setUser(user);
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
