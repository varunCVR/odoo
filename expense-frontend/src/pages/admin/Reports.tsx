import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function Reports() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    API.get("/reports/expenses")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Reports</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Employee</th>
            <th className="border p-2">Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.employeeId}>
              <td className="border p-2">{row.employeeName}</td>
              <td className="border p-2">{row.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
