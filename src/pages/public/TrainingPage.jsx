import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, Button, Input } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function TrainingPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi(() => publicApi.trainings(), []);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '' });
  const [submitting, setSubmitting] = useState(false);

  const trainings = data || [];

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await publicApi.registerTraining(selected._id, form);
      toast.success(res.message || 'Registration received.');
      setSelected(null);
      setForm({ name: '', email: '', phone: '', organization: '' });
    } catch (err) {
      toast.error(getApiError(err, 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Training & Workshops" description="Build your knowledge of human rights through our training programs." eyebrow="Get Involved" breadcrumbs={[{ label: 'Get Involved' }, { label: 'Training' }]} />
      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : trainings.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainings.map((t) => (
                <div key={t._id} className="card flex flex-col overflow-hidden">
                  {t.poster && <img src={fileUrl(t.poster)} alt={t.title} className="h-40 w-full object-cover" loading="lazy" />}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-navy-900">{t.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-gray-600">{t.description}</p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p><span className="font-semibold">Trainer:</span> {t.trainer || '—'}</p>
                      <p><span className="font-semibold">Date:</span> {formatDate(t.date)} {t.time ? `· ${t.time}` : ''}</p>
                      <p><span className="font-semibold">Venue:</span> {t.venue || '—'}</p>
                    </div>
                    <Button
                      variant="accent"
                      className="mt-4 w-full"
                      disabled={!t.registrationOpen}
                      onClick={() => setSelected(t)}
                    >
                      {t.registrationOpen ? 'Register' : 'Registration Closed'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No trainings available" description="Training programs will be announced here." />
          )}
        </div>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Register: ${selected.title}` : 'Register'}>
        {selected && (
          <form onSubmit={submit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            <Button type="submit" variant="accent" loading={submitting} className="w-full">Confirm Registration</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
