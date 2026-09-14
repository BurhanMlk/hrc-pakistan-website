import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Input, Select, StatusBadge, SearchBar, Pagination, ErrorState } from '../../components/ui/index.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import { ROLES } from '../../config/constants.js';
import { formatDateTime } from '../../utils/helpers.js';

export default function UsersPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'EDITOR', password: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const [resetTarget, setResetTarget] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.users({ page, limit: 20, search: search || undefined });
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
  }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'EDITOR', password: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: '', isActive: user.isActive });
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateUser(editing._id, { name: form.name, role: form.role, isActive: form.isActive });
      } else {
        await adminApi.createUser(form);
      }
      toast.success(editing ? 'User updated.' : 'User created.');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const doReset = async () => {
    setResetLoading(true);
    try {
      await adminApi.resetUserPassword(resetTarget._id, { newPassword: resetPassword });
      toast.success('Password reset.');
      setResetTarget(null);
      setResetPassword('');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setResetLoading(false);
    }
  };

  const doDelete = async () => {
    setDeleteLoading(true);
    try {
      await adminApi.deleteUser(deleteTarget._id);
      toast.success('User deleted.');
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
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage admin accounts and role permissions.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add User</Button>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="sm:w-80" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <DataTable
            loading={loading}
            data={rows}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role', render: (r) => <StatusBadge status={r.role} /> },
              { key: 'isActive', header: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'Active' : 'Closed'} /> },
              { key: 'lastLogin', header: 'Last Login', render: (r) => formatDateTime(r.lastLogin) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(r)} className="text-sm font-semibold text-navy-700 hover:underline">Edit</button>
                    <button onClick={() => { setResetTarget(r); setResetPassword(''); }} className="text-sm font-semibold text-accent-700 hover:underline">Reset</button>
                    <button onClick={() => setDeleteTarget(r)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                  </div>
                ),
              },
            ]}
            emptyMessage="No users found."
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      {/* Create/Edit */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <form onSubmit={save} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editing} />
          {!editing && <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required hint="Minimum 8 characters." />}
          <Select label="Role" options={ROLES} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
            Active account
          </label>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={saving}>{editing ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </form>
      </Modal>

      {/* Reset password */}
      <Modal open={!!resetTarget} onClose={() => setResetTarget(null)} title="Reset Password">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Set a new password for <span className="font-semibold">{resetTarget?.name}</span>.</p>
          <Input label="New Password" type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} hint="Minimum 8 characters." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setResetTarget(null)}>Cancel</Button>
            <Button variant="accent" loading={resetLoading} onClick={doReset} disabled={resetPassword.length < 8}>Reset Password</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete} title="Delete user?" message="This will permanently remove the account." loading={deleteLoading} />
    </div>
  );
}
