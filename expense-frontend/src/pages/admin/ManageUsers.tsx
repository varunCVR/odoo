import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    managerId: "",
  });

  const fetchUsers = async () => {
    const res = await API.get("/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/users", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm({ name: "", email: "", password: "", role: "EMPLOYEE", managerId: "" });
      fetchUsers();
    } catch {
      alert("Failed to create user");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* User Creation Form */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full border p-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select
          className="w-full border p-2"
          value={form.managerId}
          onChange={(e) => setForm({ ...form, managerId: e.target.value })}
        >
          <option value="">No Manager</option>
          {users
            .filter((u) => u.roles.some((r: any) => r.role.code === "MANAGER"))
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Create User</button>
      </form>

      {/* Users Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Roles</th>
            <th className="p-2 border">Manager</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                {u.roles.map((r: any) => r.role.code).join(", ")}
              </td>
              <td className="p-2">{u.employeeProfile?.manager_id || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
