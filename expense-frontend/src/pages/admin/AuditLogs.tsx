import { useEffect, useState } from "react";
import { API } from "../../api/auth";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    API.get("/audit-logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="border p-2 mb-2">
            {log.action} by {log.userEmail} on {new Date(log.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
