import { useEffect, useState } from 'react';
import { fetchLogs, LogEntry } from '../services/logService';

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Загрузка...</div>;

  return (
    <div className="page">
      <h1 className="page-title">📋 Журнал действий</h1>
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Время</th>
              <th>Пользователь</th>
              <th>Действие</th>
              <th>Страница</th>
              <th>Детали</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--tg-border)' }}>
                <td style={{ padding: '8px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '8px' }}>
                  <div>{log.userName || log.userId}</div>
                  {log.username && <div style={{ fontSize: '0.8em', color: 'gray' }}>@{log.username}</div>}
                </td>
                <td style={{ padding: '8px' }}>{log.action}</td>
                <td style={{ padding: '8px' }}>{log.pageId || '-'}</td>
                <td style={{ padding: '8px' }}>{JSON.stringify(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}