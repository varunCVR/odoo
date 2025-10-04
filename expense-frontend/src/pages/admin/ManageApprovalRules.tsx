import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ManageApprovalRules() {
  const [rules, setRules] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    requireManagerFirst: true,
  });
  const [newStep, setNewStep] = useState({
    ruleId: "",
    stepNo: 1,
    thresholdPercent: 100,
    approverRoleId: "",
    approverUserId: "",
  });

  const fetchRules = async () => {
    const res = await API.get("/approval-rules", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRules(res.data);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/approval-rules", form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setForm({ name: "", requireManagerFirst: true });
    fetchRules();
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.ruleId) {
      alert("Select a rule first");
      return;
    }
    await API.post(`/approval-rules/${newStep.ruleId}/steps`, newStep, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setNewStep({
      ruleId: "",
      stepNo: 1,
      thresholdPercent: 100,
      approverRoleId: "",
      approverUserId: "",
    });
    fetchRules();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Approval Rules</h1>

      {/* Create Rule */}
      <form onSubmit={handleCreateRule} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Rule Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.requireManagerFirst}
            onChange={(e) => setForm({ ...form, requireManagerFirst: e.target.checked })}
          />
          <span>Require Manager First</span>
        </label>
        <button className="w-full bg-green-600 text-white py-2 rounded">Create Rule</button>
      </form>

      {/* Add Step */}
      <form onSubmit={handleAddStep} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <select
          className="w-full border p-2"
          value={newStep.ruleId}
          onChange={(e) => setNewStep({ ...newStep, ruleId: e.target.value })}
        >
          <option value="">Select Rule</option>
          {rules.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <input
          type="number"
          className="w-full border p-2"
          placeholder="Step Number"
          value={newStep.stepNo}
          onChange={(e) => setNewStep({ ...newStep, stepNo: +e.target.value })}
        />
        <input
          type="number"
          className="w-full border p-2"
          placeholder="Threshold %"
          value={newStep.thresholdPercent}
          onChange={(e) => setNewStep({ ...newStep, thresholdPercent: +e.target.value })}
        />
        <input
          className="w-full border p-2"
          placeholder="Approver Role ID"
          value={newStep.approverRoleId}
          onChange={(e) => setNewStep({ ...newStep, approverRoleId: e.target.value })}
        />
        <input
          className="w-full border p-2"
          placeholder="Approver User ID (optional)"
          value={newStep.approverUserId}
          onChange={(e) => setNewStep({ ...newStep, approverUserId: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Add Step</button>
      </form>

      {/* Rules Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Manager First</th>
            <th className="p-2 border">Steps</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.id} className="border">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.require_manager_first ? "Yes" : "No"}</td>
              <td className="p-2">
                {r.steps?.length
                  ? r.steps.map((s: any) => (
                      <div key={s.id}>
                        Step {s.step_no} → Threshold {s.threshold_percent}% | 
                        {s.approver_user_id ? `User #${s.approver_user_id}` : `Role #${s.approver_role_id}`}
                      </div>
                    ))
                  : "No steps yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
