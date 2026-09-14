import { useEffect, useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { StatusBadge, SearchBar, Pagination, ErrorState, Button } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function VolunteersAdminPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.volunteers({ page, limit: 20, status: status || undefined, search: search || undefined });
      setRows(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search]);

  const updateStatus = async (v, newStatus) => {
    try {
      await adminApi.updateVolunteerStatus(v._id, { status: newStatus });
      toast.success('Status updated.');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Volunteers</h1>
        <p className="mt-1 text-sm text-gray-500">Review and manage volunteer applications.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search volunteers…" className="sm:w-80" />
        <select className="input sm:w-56" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={rows}
            onRowClick={(r) => setViewing(r)}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'city', header: 'City' },
              { key: 'skills', header: 'Skills', render: (r) => (r.skills || []).join(', ') || '—' },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'createdAt', header: 'Applied', render: (r) => formatDate(r.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setViewing(r); }} className="rounded p-1.5 text-gray-500 hover:bg-gray-100" aria-label="View"><Eye className="h-4 w-4" /></button>
                    {r.status !== 'Approved' && <button onClick={(e) => { e.stopPropagation(); updateStatus(r, 'Approved'); }} className="rounded p-1.5 text-green-600 hover:bg-green-50" aria-label="Approve"><Check className="h-4 w-4" /></button>}
                    {r.status !== 'Rejected' && <button onClick={(e) => { e.stopPropagation(); updateStatus(r, 'Rejected'); }} className="rounded p-1.5 text-red-600 hover:bg-red-50" aria-label="Reject"><X className="h-4 w-4" /></button>}
                  </div>
                ),
              },
            ]}
            emptyMessage="No volunteer applications found."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Volunteer Application" size="lg">
        {viewing && (
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {[
              ['Name', viewing.name],
              ['Email', viewing.email],
              ['Phone', viewing.phone],
              ['City', viewing.city || '—'],
              ['Institution', viewing.institution || '—'],
              ['Availability', viewing.availability || '—'],
              ['Status', viewing.status],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase text-gray-500">{label}</dt>
                <dd className="mt-0.5 text-sm text-gray-800">{value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-gray-500">Skills</dt>
              <dd className="mt-0.5 text-sm text-gray-800">{(viewing.skills || []).join(', ') || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-gray-500">Areas of Interest</dt>
              <dd className="mt-0.5 text-sm text-gray-800">{(viewing.areasOfInterest || []).join(', ') || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-gray-500">Motivation</dt>
              <dd className="mt-0.5 text-sm text-gray-800">{viewing.motivation || '—'}</dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
