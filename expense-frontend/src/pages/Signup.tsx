import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { signup } from "../api/auth";

export default function Signup() {
  const { login: setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signup(form);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    setUser(user);
  };

  return (
    <form onSubmit={handleSignup}>
      <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <input name="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <button type="submit">Signup</button>
    </form>
  );
}
