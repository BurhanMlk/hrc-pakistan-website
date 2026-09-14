import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UserCheck, Flag, FileText, ShieldCheck } from 'lucide-react';
import api from '../../services/api.js';
import { StatusBadge, Button, Select, Textarea, ErrorState, Card } from '../../components/ui/index.jsx';
import FileUpload from '../../components/ui/FileUpload.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError, fileUrl } from '../../services/api.js';
import { COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, ROLES } from '../../config/constants.js';
import { formatDateTime } from '../../utils/helpers.js';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [note, setNote] = useState('');
  const [investigation, setInvestigation] = useState('');
  const [files, setFiles] = useState([]);
  const [assignTo, setAssignTo] = useState('');
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.complaint(id);
      const complaint = res.data.data.complaint;
      setData(res.data.data);
      setStatus(complaint.status);
      setPriority(complaint.priority);
      setAssignTo(complaint.assignedTo?._id || '');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  useEffect(() => {
    adminApi.users({ limit: 100 }).then((r) => {
      const complaintRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMPLAINT_OFFICER];
      setUsers((r.data.data || []).filter((u) => complaintRoles.includes(u.role)));
    }).catch(() => {});
  }, []);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await adminApi.updateComplaintStatus(id, { status, note });
      toast.success('Status updated.');
      setNote('');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const updatePriority = async () => {
    setSaving(true);
    try {
      await adminApi.setComplaintPriority(id, { priority });
      toast.success('Priority updated.');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const assign = async () => {
    setSaving(true);
    try {
      await adminApi.assignComplaint(id, { assignedTo: assignTo || null });
      toast.success('Complaint assigned.');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const addInvestigation = async () => {
    if (!investigation.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('text', investigation);
      files.forEach((f) => fd.append('files', f));
      await apiPostForm(id, fd);
      toast.success('Investigation update added.');
      setInvestigation('');
      setFiles([]);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-4"><div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" /><div className="h-64 animate-pulse rounded bg-gray-200" /></div>;
  if (error || !data) return <ErrorState message={error || 'Complaint not found.'} onRetry={load} />;

  const { complaint, updates } = data;

  return (
    <div>
      <Link to="/admin/complaints" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to complaints
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy-900">{complaint.complaintId}</h1>
        <StatusBadge status={complaint.status} />
        <StatusBadge status={complaint.priority} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold text-navy-900">Complainant Information</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ['Full Name', complaint.fullName],
                ['Email', complaint.email || '—'],
                ['Phone', complaint.phone || '—'],
                ['City', complaint.city || '—'],
                ['Incident Type', complaint.incidentType],
                ['Incident Date', complaint.incidentDate ? formatDateTime(complaint.incidentDate) : '—'],
                ['Incident Location', complaint.incidentLocation || '—'],
                ['Submitted', formatDateTime(complaint.createdAt)],
                ['Confidentiality Request', complaint.confidentialityRequest ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase text-gray-500">{label}</dt>
                  <dd className="mt-0.5 text-sm text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <dt className="text-xs font-semibold uppercase text-gray-500">Description</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm text-gray-800">{complaint.description}</dd>
            </div>
            {complaint.files?.length > 0 && (
              <div className="mt-4">
                <dt className="text-xs font-semibold uppercase text-gray-500">Attachments</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {complaint.files.map((f, i) => (
                    <a key={i} href={fileUrl(f)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded bg-navy-50 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-100">
                      <FileText className="h-4 w-4" /> Attachment {i + 1}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </Card>

          {/* Investigation updates */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold text-navy-900">Investigation Updates</h2>
            <div className="space-y-4">
              <div>
                <Textarea label="Add investigation update" value={investigation} onChange={(e) => setInvestigation(e.target.value)} rows={3} placeholder="Document findings, actions and next steps…" />
                <div className="mt-2">
                  <FileUpload label="" multiple value={files} onChange={(sel) => setFiles(sel ? (Array.isArray(sel) ? sel : [sel]) : [])} hint="Attach internal documents (optional)." />
                </div>
                <Button variant="accent" className="mt-3" loading={saving} onClick={addInvestigation}>Add Update</Button>
              </div>

              {complaint.investigationUpdates?.length > 0 && (
                <ul className="space-y-3 border-t border-gray-100 pt-4">
                  {complaint.investigationUpdates.map((u, i) => (
                    <li key={i} className="rounded-md bg-gray-50 p-4">
                      <p className="text-sm text-gray-800">{u.text}</p>
                      <p className="mt-1 text-xs text-gray-500">{formatDateTime(u.createdAt)}</p>
                      {u.files?.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {u.files.map((f, j) => <a key={j} href={fileUrl(f)} target="_blank" rel="noreferrer" className="text-xs text-navy-700 underline">Doc {j + 1}</a>)}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Internal notes */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold text-navy-900">Internal Notes</h2>
            {complaint.internalNotes?.length > 0 ? (
              <ul className="space-y-3">
                {complaint.internalNotes.map((n, i) => (
                  <li key={i} className="rounded-md border border-gray-100 p-4">
                    <p className="text-sm text-gray-800">{n.text}</p>
                    <p className="mt-1 text-xs text-gray-500">{n.author?.name || 'Staff'} · {formatDateTime(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No internal notes yet.</p>
            )}
          </Card>
        </div>

        {/* Actions sidebar */}
        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900"><Flag className="h-5 w-5 text-accent-600" /> Actions</h2>
            <div className="space-y-4">
              <Select label="Update Status" options={COMPLAINT_STATUSES} value={status} onChange={(e) => setStatus(e.target.value)} />
              <Textarea label="Status note (optional)" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
              <Button variant="primary" className="w-full" loading={saving} onClick={updateStatus}>Update Status</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900"><UserCheck className="h-5 w-5 text-accent-600" /> Assignment</h2>
            <Select label="Assign to" options={users.map((u) => ({ value: u._id, label: `${u.name} (${u.role})` }))} value={assignTo} onChange={(e) => setAssignTo(e.target.value)} placeholder="Unassigned" />
            <Button variant="outline" className="mt-3 w-full" loading={saving} onClick={assign}>Save Assignment</Button>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900"><ShieldCheck className="h-5 w-5 text-accent-600" /> Priority</h2>
            <Select label="Priority" options={COMPLAINT_PRIORITIES} value={priority} onChange={(e) => setPriority(e.target.value)} />
            <Button variant="outline" className="mt-3 w-full" loading={saving} onClick={updatePriority}>Save Priority</Button>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold text-navy-900">Status Timeline</h2>
            {updates?.length ? (
              <ul className="space-y-2">
                {updates.map((u) => (
                  <li key={u._id} className="text-sm text-gray-700">
                    <StatusBadge status={u.status} /> <span className="ml-1 text-xs text-gray-500">{formatDateTime(u.createdAt)}</span>
                    {u.note && <p className="mt-0.5 text-xs text-gray-600">{u.note}</p>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">No updates.</p>}
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* Small helper to post multipart investigation update */
function apiPostForm(id, fd) {
  return api.post(`/complaints/${id}/investigation`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
}
