import { useEffect, useState } from 'react';
import { Eye, Trash2, MailOpen } from 'lucide-react';
import { SearchBar, Pagination, ErrorState } from '../../components/ui/index.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import { formatDateTime } from '../../utils/helpers.js';

export default function ContactAdminPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [read, setRead] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.contact({ page, limit: 20, read: read || undefined, search: search || undefined });
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
  }, [page, read, search]);

  const view = async (m) => {
    setViewing(m);
    if (!m.read) {
      try {
        await adminApi.markContactRead(m._id);
        load();
      } catch { /* ignore */ }
    }
  };

  const doDelete = async () => {
    try {
      await adminApi.deleteContact(deleteTarget._id);
      toast.success('Message deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Contact Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Messages submitted through the contact form.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…" className="sm:w-80" />
        <select className="input sm:w-56" value={read} onChange={(e) => setRead(e.target.value)} aria-label="Filter by read status">
          <option value="">All messages</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={rows}
            onRowClick={view}
            columns={[
              { key: 'name', header: 'Name', render: (r) => <span className="flex items-center gap-2">{!r.read && <span className="h-2 w-2 rounded-full bg-red-500" />}{r.name}</span> },
              { key: 'email', header: 'Email' },
              { key: 'subject', header: 'Subject' },
              { key: 'createdAt', header: 'Received', render: (r) => formatDateTime(r.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); view(r); }} className="rounded p-1.5 text-gray-500 hover:bg-gray-100" aria-label="View"><Eye className="h-4 w-4" /></button>
                    {!r.read && <button onClick={(e) => { e.stopPropagation(); adminApi.markContactRead(r._id).then(load); }} className="rounded p-1.5 text-navy-600 hover:bg-navy-50" aria-label="Mark read"><MailOpen className="h-4 w-4" /></button>}
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ),
              },
            ]}
            emptyMessage="No messages found."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Contact Message">
        {viewing && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <p><span className="font-semibold text-gray-500">From:</span> {viewing.name}</p>
              <p><span className="font-semibold text-gray-500">Email:</span> {viewing.email}</p>
              {viewing.phone && <p><span className="font-semibold text-gray-500">Phone:</span> {viewing.phone}</p>}
              <p><span className="font-semibold text-gray-500">Received:</span> {formatDateTime(viewing.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Message</p>
              <p className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm text-gray-800">{viewing.message}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete} title="Delete message?" message="This action cannot be undone." />
    </div>
  );
}
