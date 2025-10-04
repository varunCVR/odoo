import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    API.get("/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Expenses</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Currency</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, i) => (
            <tr key={i}>
              <td className="border p-2">{e.description}</td>
              <td className="border p-2">{e.amount}</td>
              <td className="border p-2">{e.currency}</td>
              <td className="border p-2">{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
