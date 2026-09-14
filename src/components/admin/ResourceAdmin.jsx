import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Input, Select, Textarea, StatusBadge, EmptyState, ErrorState, SearchBar, Pagination } from '../ui/index.jsx';
import { Modal, ConfirmDialog } from '../ui/Modal.jsx';
import DataTable from '../ui/DataTable.jsx';
import FileUpload from '../ui/FileUpload.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';

const EMPTY_FORM = {};

function buildInitial(fields, record) {
  const init = {};
  fields.forEach((f) => {
    if (f.type === 'array') init[f.name] = record?.[f.name] || [];
    else init[f.name] = record?.[f.name] ?? f.default ?? '';
  });
  return init;
}

function toPayload(values, fields) {
  const payload = {};
  fields.forEach((f) => {
    const v = values[f.name];
    if (f.type === 'array' && f.multiText) {
      payload[f.name] = typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : v;
    } else {
      payload[f.name] = v;
    }
  });
  return payload;
}

/**
 * Generic admin resource manager (list + create/edit modal + delete).
 * api: { list, create, update, remove }
 */
export default function ResourceAdmin({
  title,
  description,
  api,
  columns,
  fields,
  searchable = true,
  filters = [],
  onRowClick,
  emptyMessage,
}) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const limit = 20;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.list(params);
      const data = res.data;
      setRows(Array.isArray(data) ? data : data.data || []);
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0));
      setPages(data.pages || 1);
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
  }, [page, search, filterValues]);

  const openCreate = () => {
    setEditing(null);
    setForm(buildInitial(fields));
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setForm(buildInitial(fields, record));
    setModalOpen(true);
  };

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form, fields);
      if (editing) await api.update(editing._id, payload);
      else await api.create(payload);
      toast.success(editing ? 'Updated successfully.' : 'Created successfully.');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.remove(deleting._id);
      toast.success('Deleted successfully.');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderField = (f) => {
    const value = form[f.name];
    switch (f.type) {
      case 'textarea':
        return <Textarea key={f.name} label={f.label} rows={f.rows || 4} value={value || ''} onChange={(e) => setField(f.name, e.target.value)} required={f.required} placeholder={f.placeholder} />;
      case 'select':
        return (
          <Select
            key={f.name}
            label={f.label}
            options={f.options}
            placeholder={f.placeholder || 'Select…'}
            value={value || ''}
            onChange={(e) => setField(f.name, e.target.value)}
            required={f.required}
          />
        );
      case 'number':
        return <Input key={f.name} label={f.label} type="number" value={value ?? ''} onChange={(e) => setField(f.name, e.target.value ? Number(e.target.value) : '')} required={f.required} />;
      case 'date':
        return <Input key={f.name} label={f.label} type="date" value={value ? String(value).slice(0, 10) : ''} onChange={(e) => setField(f.name, e.target.value)} required={f.required} />;
      case 'datetime':
        return <Input key={f.name} label={f.label} type="datetime-local" value={value ? String(value).slice(0, 16) : ''} onChange={(e) => setField(f.name, e.target.value)} required={f.required} />;
      case 'checkbox':
        return (
          <label key={f.name} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={!!value} onChange={(e) => setField(f.name, e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
            {f.label}
          </label>
        );
      case 'array':
        if (f.multiText) {
          return <Input key={f.name} label={f.label} value={Array.isArray(value) ? value.join(', ') : value} onChange={(e) => setField(f.name, e.target.value)} placeholder={f.placeholder} />;
        }
        return <Input key={f.name} label={f.label} value={Array.isArray(value) ? value.join(', ') : value || ''} onChange={(e) => setField(f.name, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder={f.placeholder} />;
      case 'file':
        return <FileUpload key={f.name} label={f.label} value={value ? [{ name: typeof value === 'string' ? 'Current file' : value.name }] : []} onChange={(file) => setField(f.name, file)} accept={f.accept} multiple={f.multiple} />;
      default:
        return <Input key={f.name} label={f.label} type={f.inputType || 'text'} value={value ?? ''} onChange={(e) => setField(f.name, e.target.value)} required={f.required} placeholder={f.placeholder} />;
    }
  };

  const tableColumns = [
    ...columns.map((c) => ({ ...c, render: c.render })),
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(row); }}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-navy-800"
            aria-label={`Edit ${row.name || row.title || 'record'}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleting(row); }}
            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${row.name || row.title || 'record'}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add New</Button>
      </div>

      {(searchable || filters.length > 0) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchable && <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="sm:w-80" />}
          {filters.map((f) => (
            <select
              key={f.key}
              className="input sm:w-56"
              value={filterValues[f.key] || ''}
              onChange={(e) => setFilterValues((v) => ({ ...v, [f.key]: e.target.value }))}
              aria-label={f.label}
            >
              <option value="">{f.label}: All</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 && !loading ? (
        <EmptyState title="No records found" description={emptyMessage || 'Add your first record using the button above.'} />
      ) : (
        <>
          <DataTable columns={tableColumns} data={rows} loading={loading} onRowClick={onRowClick} />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`} size="lg">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (f.fullWidth ? <div key={f.name} className="sm:col-span-2">{renderField(f)}</div> : renderField(f)))}
          <div className="sm:col-span-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" loading={saving}>{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete record?"
        message="This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
}
