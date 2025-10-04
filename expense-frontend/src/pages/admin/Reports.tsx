import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function Reports() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/company", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: filter,
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount_company), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Company Reports</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <input
          type="date"
          className="border p-2"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        />
        <button
          onClick={fetchExpenses}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Summary */}
      <p className="mb-4 font-semibold">
        Total Spend: {total} INR
      </p>

      {/* Expense Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border">
              <td className="p-2">
                {new Date(e.expense_date).toLocaleDateString()}
              </td>
              <td className="p-2">{e.employee?.name}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">
                {e.amount_company} {e.currency_company}
              </td>
              <td className="p-2">
                {e.approvals?.every((a: any) => a.decision === "APPROVED")
                  ? "Approved ✅"
                  : e.approvals?.some((a: any) => a.decision === "REJECTED")
                  ? "Rejected ❌"
                  : "Pending ⏳"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
