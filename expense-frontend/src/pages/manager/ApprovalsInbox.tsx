import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ApprovalsInbox() {
  const [pending, setPending] = useState<any[]>([]);

  const fetchPending = async () => {
    const res = await API.get("/approvals/pending", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPending(res.data);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleDecision = async (id: number, decision: "APPROVED" | "REJECTED") => {
    await API.post(`/approvals/${id}/decision`, { decision }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchPending();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pending Approvals</h1>
      {pending.length === 0 ? (
        <p>No pending approvals 🎉</p>
      ) : (
        <ul>
          {pending.map((a) => (
            <li key={a.id} className="border p-3 mb-2 flex justify-between">
              <div>
                <p><b>{a.expense.description}</b></p>
                <p>{a.expense.amount_company} {a.expense.currency_company}</p>
              </div>
              <div>
                <button onClick={() => handleDecision(a.id, "APPROVED")} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Approve</button>
                <button onClick={() => handleDecision(a.id, "REJECTED")} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
