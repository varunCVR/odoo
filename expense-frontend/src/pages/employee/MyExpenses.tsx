import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/mine", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Expenses</h1>

      {expenses.length === 0 ? (
        <p>No expenses submitted yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border">
                <td className="p-2">{new Date(exp.expense_date).toLocaleDateString()}</td>
                <td className="p-2">{exp.description}</td>
                <td className="p-2">{exp.category}</td>
                <td className="p-2">
                  {exp.amount_company} {exp.currency_company}
                </td>
                <td className="p-2">
                  {exp.approvals?.every((a: any) => a.decision === "APPROVED")
                    ? "Approved ✅"
                    : exp.approvals?.some((a: any) => a.decision === "REJECTED")
                    ? "Rejected ❌"
                    : "Pending ⏳"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
