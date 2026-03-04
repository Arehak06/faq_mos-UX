import { useEffect, useState, useMemo } from 'react';
import { fetchLogs, LogEntry } from '../services/logService';
import { Loading } from '../components/Loading';

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    fetchLogs()
      .then(data => {
        // Сортируем сразу: новые сверху
        const sorted = [...data].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLogs(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки логов:', err);
        setLoading(false);
      });
  }, []);

  // Уникальные значения для выпадающих списков
  const uniqueUsers = useMemo(() => {
    const users = logs.map(log => log.userName || String(log.userId)).filter((v, i, a) => a.indexOf(v) === i);
    return users;
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const actions = logs.map(log => log.action).filter((v, i, a) => a.indexOf(v) === i);
    return actions;
  }, [logs]);

  // Фильтрация логов
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Фильтр по пользователю
      if (filterUser) {
        const userName = log.userName || String(log.userId);
        if (userName !== filterUser) return false;
      }
      // Фильтр по действию
      if (filterAction && log.action !== filterAction) return false;
      // Фильтр по дате "от"
      if (filterDateFrom) {
        const from = new Date(filterDateFrom).setHours(0, 0, 0, 0);
        const logDate = new Date(log.timestamp).setHours(0, 0, 0, 0);
        if (logDate < from) return false;
      }
      // Фильтр по дате "до"
      if (filterDateTo) {
        const to = new Date(filterDateTo).setHours(23, 59, 59, 999);
        const logDate = new Date(log.timestamp).getTime();
        if (logDate > to) return false;
      }
      return true;
    });
  }, [logs, filterUser, filterAction, filterDateFrom, filterDateTo]);

  // Сброс фильтров
  const resetFilters = () => {
    setFilterUser('');
    setFilterAction('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <h1 className="page-title">📋 Журнал действий</h1>

      {/* Панель фильтров */}
      <div className="admin-card">
        <div className="admin-card-title">🔍 Фильтры</div>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
          >
            <option value="">Все пользователи</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
          >
            <option value="">Все действия</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
            placeholder="Дата с"
          />

          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--tg-border)' }}
            placeholder="Дата по"
          />
        </div>
        <button className="tg-button" onClick={resetFilters} style={{ marginTop: '12px', padding: '8px' }}>
          Сбросить фильтры
        </button>
      </div>

      {/* Таблица логов */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {filteredLogs.length === 0 ? (
          <p>Нет записей</p>
        ) : (
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
              {filteredLogs.map((log, i) => (
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
        )}
      </div>
    </div>
  );
}