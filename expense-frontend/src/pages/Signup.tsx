import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { signup } from "../api/auth";

export default function Signup() {
  const { login: setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Signup</h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company Name"
          className="w-full border p-2 mb-3"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">Signup</button>
      </form>
    </div>
  );
}
