import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { StatusBadge, SearchBar, Pagination, ErrorState, Card } from '../../components/ui/index.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import { COMPLAINT_STATUSES, COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '../../config/constants.js';
import { formatDate } from '../../utils/helpers.js';

export default function ComplaintsAdminPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.complaints({
        page, limit: 20,
        status: status || undefined,
        priority: priority || undefined,
        incidentType: incidentType || undefined,
        search: search || undefined,
      });
      setRows(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminApi.complaintStats().then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, priority, incidentType, search]);

  const doDelete = async () => {
    setDeleteLoading(true);
    try {
      await adminApi.deleteComplaint(deleteTarget._id);
      toast.success('Complaint deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Complaints</h1>
        <p className="mt-1 text-sm text-gray-500">Sensitive information — access is restricted and audited.</p>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {[
            ['New', stats.new],
            ['Under Review', stats.pendingReview],
            ['Assigned', stats.assigned],
            ['Investigation', stats.investigation],
            ['Resolved', stats.resolved],
            ['Closed', stats.closed],
            ['Urgent', stats.urgent],
          ].map(([label, value]) => (
            <Card key={label} className="p-4 text-center">
              <p className="text-2xl font-extrabold text-navy-900">{value}</p>
              <p className="text-xs font-medium text-gray-500">{label}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, name, email…" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">Status: All</option>
          {COMPLAINT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="">Priority: All</option>
          {COMPLAINT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} aria-label="Incident type">
          <option value="">Type: All</option>
          {COMPLAINT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={rows}
            onRowClick={(r) => navigate(`/admin/complaints/${r._id}`)}
            columns={[
              { key: 'complaintId', header: 'ID', render: (r) => <span className="font-mono text-xs">{r.complaintId}</span> },
              { key: 'fullName', header: 'Name' },
              { key: 'incidentType', header: 'Type' },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'priority', header: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
              { key: 'createdAt', header: 'Submitted', render: (r) => formatDate(r.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
            emptyMessage="No complaints found."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={doDelete}
        loading={deleteLoading}
        title="Delete complaint?"
        message={`This will permanently delete complaint "${deleteTarget?.complaintId || ''}" and all its updates. This action cannot be undone.`}
      />
    </div>
  );
}
