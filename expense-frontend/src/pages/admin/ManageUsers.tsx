import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });

  const fetchUsers = () => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/users", form);
    setForm({ name: "", email: "", password: "", role: "EMPLOYEE" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2"
        >
          <option>EMPLOYEE</option>
          <option>MANAGER</option>
        </select>
        <button className="bg-blue-500 text-white px-3">Add</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{(u.roles ?? []).map((r: any) => r.role.code).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
