import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/manage-users"
          className="p-6 bg-blue-100 rounded shadow hover:bg-blue-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p>Add employees/managers, assign managers.</p>
        </Link>

        <Link
          to="/admin/manage-rules"
          className="p-6 bg-green-100 rounded shadow hover:bg-green-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Approval Rules</h2>
          <p>Define approval workflows and thresholds.</p>
        </Link>

        <Link
          to="/admin/reports"
          className="p-6 bg-yellow-100 rounded shadow hover:bg-yellow-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p>View expense summaries and analytics.</p>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-6 bg-red-100 rounded shadow hover:bg-red-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Audit Logs</h2>
          <p>Track all approvals, rejections, and submissions.</p>
        </Link>
      </div>
    </div>
  );
}
