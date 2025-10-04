export default function EmployeeDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        <ul className="space-y-2">
          <li className="p-3 bg-gray-100 rounded">➕ Submit New Expense</li>
          <li className="p-3 bg-gray-100 rounded">📂 My Expenses</li>
        </ul>
      </div>
    );
  }
  