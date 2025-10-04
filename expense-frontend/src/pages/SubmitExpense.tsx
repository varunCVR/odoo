import { useState } from "react";
import { API } from "../api/auth";

export default function SubmitExpense() {
  const [form, setForm] = useState({
    description: "",
    category: "",
    expenseDate: "",
    paidBy: "Self",
    amountOriginal: 0,
    currencyOriginal: "INR",
    amountCompany: 0,
    currencyCompany: "INR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Expense submitted!");
    } catch {
      alert("Failed to submit");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Submit Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border p-2" placeholder="Category"
          value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="date" className="w-full border p-2"
          value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} />
        <select className="w-full border p-2"
          value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })}>
          <option value="Self">Self</option>
          <option value="Company">Company</option>
        </select>
        <input type="number" className="w-full border p-2" placeholder="Amount"
          value={form.amountOriginal} onChange={(e) => setForm({ ...form, amountOriginal: +e.target.value })} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
