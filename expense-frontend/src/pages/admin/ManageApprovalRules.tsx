import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ManageApprovalRules() {
  const [rules, setRules] = useState<any[]>([]);
  const [name, setName] = useState("");

  const fetchRules = () => {
    API.get("/approval-rules")
      .then((res) => setRules(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/approval-rules", { name });
    setName("");
    fetchRules();
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Approval Rules</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          placeholder="Rule name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-3">Add Rule</button>
      </form>

      <ul>
        {rules.map((r) => (
          <li key={r.id} className="border p-2 mb-2">{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
