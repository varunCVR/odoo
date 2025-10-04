import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/manager/approvals"
          className="p-6 bg-yellow-100 rounded shadow hover:bg-yellow-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Approvals Inbox</h2>
          <p>Review pending expenses and approve/reject them.</p>
        </Link>

        <div className="p-6 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Reports (Coming Soon)</h2>
          <p>Managers will be able to see team expenses here.</p>
        </div>
      </div>
    </div>
  );
}
