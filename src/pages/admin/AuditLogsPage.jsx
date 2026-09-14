import { useEffect, useState } from 'react';
import { SearchBar, Pagination, ErrorState } from '../../components/ui/index.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { adminApi } from '../../services/adminApi.js';
import { getApiError } from '../../services/api.js';
import { formatDateTime } from '../../utils/helpers.js';

export default function AuditLogsPage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.auditLogs({ page, limit: 50, resource: resource || undefined, action: action || undefined });
      setRows(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, resource, action]);

  const filtered = search ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase())) : rows;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Immutable record of important administrative actions.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs…" className="sm:w-72" />
        <input className="input sm:w-48" placeholder="Resource (e.g. complaint)" value={resource} onChange={(e) => setResource(e.target.value)} aria-label="Filter by resource" />
        <input className="input sm:w-48" placeholder="Action (e.g. LOGIN)" value={action} onChange={(e) => setAction(e.target.value)} aria-label="Filter by action" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={filtered}
            columns={[
              { key: 'createdAt', header: 'When', render: (r) => formatDateTime(r.createdAt) },
              { key: 'action', header: 'Action' },
              { key: 'resource', header: 'Resource' },
              { key: 'resourceId', header: 'Resource ID', render: (r) => r.resourceId || '—' },
              { key: 'performerEmail', header: 'Performed By', render: (r) => r.performedBy?.email || r.performerEmail || '—' },
              { key: 'ip', header: 'IP', render: (r) => r.ip || '—' },
            ]}
            emptyMessage="No audit logs found."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
