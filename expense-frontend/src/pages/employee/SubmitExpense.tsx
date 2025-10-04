import { useState } from "react";
import { API } from "../../api/auth";

export default function SubmitExpense() {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    currency: "INR",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("description", form.description);
      formData.append("amount", form.amount);
      formData.append("currency", form.currency);
      formData.append("category", form.category);
      if (file) formData.append("receipt", file);

      await API.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Expense submitted successfully!");
      setForm({ description: "", amount: "", currency: "INR", category: "" });
      setFile(null);
    } catch (err: any) {
      setMessage("Failed to submit expense");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Submit Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2"
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          className="border p-2"
        />
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
