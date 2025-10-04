import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function ApprovalsInbox() {
  const [pending, setPending] = useState<any[]>([]);

  const fetchPending = () => {
    API.get("/approvals/pending")
      .then((res) => setPending(res.data))
      .catch((err) => console.error(err));
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await API.post(`/approvals/${id}/decision`, { 
        decision: action === "approve" ? "APPROVED" : "REJECTED" 
      });
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approvals Inbox</h2>
      {pending.map((exp) => (
        <div key={exp.id} className="border p-4 mb-2 flex justify-between">
          <div>
            <p>{exp.description} — {exp.amount} {exp.currency}</p>
            <p>Status: {exp.status}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleAction(exp.id, "approve")}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleAction(exp.id, "reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
