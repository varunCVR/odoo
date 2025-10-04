import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/employee/submit-expense"
          className="p-6 bg-blue-100 rounded shadow hover:bg-blue-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Submit Expense</h2>
          <p>Create a new expense and attach receipts.</p>
        </Link>

        <Link
          to="/employee/my-expenses"
          className="p-6 bg-green-100 rounded shadow hover:bg-green-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">My Expenses</h2>
          <p>View submitted expenses and their approval status.</p>
        </Link>
      </div>
    </div>
  );
}
