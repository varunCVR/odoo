export default function AdminDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <ul className="space-y-2">
          <li className="p-3 bg-gray-100 rounded">👥 Manage Users</li>
          <li className="p-3 bg-gray-100 rounded">⚙️ Approval Rules</li>
          <li className="p-3 bg-gray-100 rounded">📊 Reports</li>
        </ul>
      </div>
    );
  }
  