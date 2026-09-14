import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SearchBar, Pagination, ErrorState, Button } from '../../components/ui/index.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function NewsletterAdminPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.newsletter({ page, limit: 50 });
      let data = res.data.data || [];
      if (search) data = data.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));
      setRows(data);
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
  }, [page, search]);

  const doDelete = async () => {
    try {
      await adminApi.deleteSubscriber(deleteTarget._id);
      toast.success('Subscriber removed.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Newsletter Subscribers</h1>
        <p className="mt-1 text-sm text-gray-500">Email addresses subscribed to the newsletter.</p>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emails…" className="sm:w-80" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={rows}
            columns={[
              { key: 'email', header: 'Email' },
              { key: 'subscribed', header: 'Status', render: (r) => (r.subscribed ? 'Subscribed' : 'Unsubscribed') },
              { key: 'createdAt', header: 'Subscribed On', render: (r) => formatDate(r.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <button onClick={() => setDeleteTarget(r)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                ),
              },
            ]}
            emptyMessage="No subscribers yet."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete} title="Remove subscriber?" message="This will remove the email from the newsletter list." />
    </div>
  );
}
