import { useEffect, useState } from "react";
import { getPendingApprovals, approveOrReject } from "../../api/approvals";

export default function ManagerDashboard() {
  const [pending, setPending] = useState<any[]>([]);

  const fetchPending = async () => {
    const res = await getPendingApprovals();
    setPending(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecision = async (id: number, decision: "APPROVED" | "REJECTED") => {
    await approveOrReject(id, decision, decision === "REJECTED" ? "Not valid" : "Looks good");
    fetchPending();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Approvals</h1>
      {pending.length === 0 ? (
        <p>No pending approvals 🎉</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Expense</th>
              <th className="p-2">Employee</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.expense.description}</td>
                <td className="p-2">{a.expense.employee.name}</td>
                <td className="p-2">
                  {a.expense.amount_company} {a.expense.currency_company}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(a.id, "APPROVED")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(a.id, "REJECTED")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
