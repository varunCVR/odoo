import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    const res = await API.get("/audit-logs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Entity</th>
              <th className="p-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border">
                <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-2">{log.user?.name || "System"}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.entity}</td>
                <td className="p-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
