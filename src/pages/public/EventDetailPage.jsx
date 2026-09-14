import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Building2, Users } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Button, Input, ErrorState, Skeleton } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useApi from '../../hooks/useApi.js';
import usePageMeta from '../../hooks/usePageMeta.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function EventDetailPage() {
  const { slug } = useParams();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, reload } = useApi(() => publicApi.eventBySlug(slug), [slug]);
  usePageMeta(data?.title, data?.description);

  if (loading) {
    return <div className="container-page section-pad"><Skeleton className="h-10 w-1/2" /><Skeleton className="mt-4 h-72 w-full" /></div>;
  }
  if (error || !data) return <div className="container-page section-pad"><ErrorState message={getApiError(error, 'Event not found.')} onRetry={reload} /></div>;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await publicApi.registerEvent(data._id, form);
      toast.success(res.message || 'Registration received.');
      setForm({ name: '', email: '', phone: '', organization: '', message: '' });
    } catch (err) {
      toast.error(getApiError(err, 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  const full = (data.capacity > 0 && data.registrationCount >= data.capacity) || !data.registrationOpen;

  return (
    <>
      <PageHeader title={data.title} eyebrow="Event" description={data.description} breadcrumbs={[{ label: 'Events', path: '/events' }, { label: data.title }]} />
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {data.poster && <img src={fileUrl(data.poster)} alt={data.title} className="mb-8 w-full rounded-lg object-cover shadow-card" />}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card flex items-start gap-3 p-5">
                <Calendar className="h-5 w-5 text-accent-600" />
                <div><p className="text-sm font-bold text-navy-900">Date</p><p className="text-sm text-gray-600">{formatDate(data.date)}</p></div>
              </div>
              <div className="card flex items-start gap-3 p-5">
                <Clock className="h-5 w-5 text-accent-600" />
                <div><p className="text-sm font-bold text-navy-900">Time</p><p className="text-sm text-gray-600">{data.startTime || '—'}{data.endTime ? ` – ${data.endTime}` : ''}</p></div>
              </div>
              <div className="card flex items-start gap-3 p-5">
                <MapPin className="h-5 w-5 text-accent-600" />
                <div><p className="text-sm font-bold text-navy-900">Venue</p><p className="text-sm text-gray-600">{data.venue || '—'}{data.city ? `, ${data.city}` : ''}</p></div>
              </div>
              <div className="card flex items-start gap-3 p-5">
                <User className="h-5 w-5 text-accent-600" />
                <div><p className="text-sm font-bold text-navy-900">Speaker / Organizer</p><p className="text-sm text-gray-600">{data.speaker || data.organizer || '—'}</p></div>
              </div>
            </div>

            {data.gallery?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-xl font-bold text-navy-900">Gallery</h2>
                <div className="grid grid-cols-3 gap-3">
                  {data.gallery.map((g, i) => <img key={i} src={fileUrl(g)} alt={`${data.title} ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" loading="lazy" />)}
                </div>
              </div>
            )}
          </div>

          {/* Registration */}
          <aside>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                <Users className="h-5 w-5 text-accent-600" /> Register
              </h2>
              {data.capacity > 0 && <p className="mt-1 text-xs text-gray-500">{data.registrationCount} / {data.capacity} registered</p>}
              {full ? (
                <p className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-600">Registration for this event is currently closed.</p>
              ) : (
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <Input label="Full Name" name="name" value={form.name} onChange={set('name')} required />
                  <Input label="Email" type="email" name="email" value={form.email} onChange={set('email')} required />
                  <Input label="Phone" name="phone" value={form.phone} onChange={set('phone')} />
                  <Input label="Organization (optional)" name="organization" value={form.organization} onChange={set('organization')} />
                  <Input label="Message (optional)" name="message" value={form.message} onChange={set('message')} />
                  <Button type="submit" variant="accent" loading={submitting} className="w-full">Register for Event</Button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
