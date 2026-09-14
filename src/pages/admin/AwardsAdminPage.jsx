import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { Button, Input, Select, Textarea, ErrorState } from '../../components/ui/index.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';

export default function AwardsAdminPage() {
  const toast = useToast();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [winnerModal, setWinnerModal] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [winnerForm, setWinnerForm] = useState({ award: '', name: '', title: '', organization: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadWinners = async () => {
    setLoading(true);
    try {
      const res = await adminApi.awards();
      setWinners(res.data.data?.winners || []);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWinners(); /* eslint-disable-next-line */ }, []);

  const openAddWinner = () => {
    setEditingWinner(null);
    setWinnerForm({ award: '', name: '', title: '', organization: '', bio: '' });
    setWinnerModal(true);
  };

  const openEditWinner = (w) => {
    setEditingWinner(w);
    setWinnerForm({ award: w.award?._id || w.award || '', name: w.name, title: w.title || '', organization: w.organization || '', bio: w.bio || '' });
    setWinnerModal(true);
  };

  const saveWinner = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingWinner) await adminApi.updateWinner(editingWinner._id, winnerForm);
      else await adminApi.addWinner(winnerForm);
      toast.success('Winner saved.');
      setWinnerModal(false);
      loadWinners();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteWinner = async () => {
    try {
      await adminApi.deleteWinner(deleteTarget._id);
      toast.success('Winner deleted.');
      setDeleteTarget(null);
      loadWinners();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="space-y-10">
      <ResourceAdmin
        title="Awards"
        description="Manage awards and categories."
        api={{
        list: (p) => adminApi.awards(p),
        create: (d) => adminApi.createAward(d),
        update: (id, d) => adminApi.updateAward(id, d),
        remove: (id) => adminApi.deleteAward(id),
      }}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'category', header: 'Category' },
          { key: 'year', header: 'Year' },
          { key: 'isPublished', header: 'Status', render: (r) => (r.isPublished ? 'Published' : 'Hidden') },
        ]}
        fields={[
          { name: 'title', label: 'Title', required: true, fullWidth: true },
          { name: 'category', label: 'Category', required: true },
          { name: 'year', label: 'Year', type: 'number', required: true },
          { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
          { name: 'photo', label: 'Photo', type: 'file', accept: 'image/*', fullWidth: true },
          { name: 'isPublished', label: 'Published', type: 'checkbox' },
        ]}
      />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-900">Award Winners</h2>
            <p className="text-sm text-gray-500">Manage individuals and organizations recognized with awards.</p>
          </div>
          <Button onClick={openAddWinner}><Plus className="h-4 w-4" /> Add Winner</Button>
        </div>
        <DataTable
          loading={loading}
          data={winners}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'title', header: 'Title' },
            { key: 'organization', header: 'Organization' },
            { key: 'award.title', header: 'Award', render: (r) => r.award?.title || '—' },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditWinner(r)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit winner"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(r)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete winner"><Trash2 className="h-4 w-4" /></button>
                </div>
              ),
            },
          ]}
          emptyMessage="No winners added yet."
        />
      </div>

      <Modal open={winnerModal} onClose={() => setWinnerModal(false)} title={editingWinner ? 'Edit Winner' : 'Add Winner'}>
        <form onSubmit={saveWinner} className="space-y-4">
          <Select label="Award *" options={(winners.map((w) => w.award).filter((a, i, arr) => a && arr.findIndex((x) => x._id === a._id) === i)).map((a) => ({ value: a._id, label: `${a.title} (${a.year})` }))} value={winnerForm.award} onChange={(e) => setWinnerForm({ ...winnerForm, award: e.target.value })} required />
          <Input label="Name *" value={winnerForm.name} onChange={(e) => setWinnerForm({ ...winnerForm, name: e.target.value })} required />
          <Input label="Title" value={winnerForm.title} onChange={(e) => setWinnerForm({ ...winnerForm, title: e.target.value })} />
          <Input label="Organization" value={winnerForm.organization} onChange={(e) => setWinnerForm({ ...winnerForm, organization: e.target.value })} />
          <Textarea label="Bio" value={winnerForm.bio} onChange={(e) => setWinnerForm({ ...winnerForm, bio: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setWinnerModal(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={saving}>Save Winner</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteWinner} title="Delete winner?" message="This action cannot be undone." />
    </div>
  );
}
