import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Input, Textarea, Button, Card } from '../../components/ui/index.jsx';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';

export default function ContactPage() {
  const { settings } = useSettings();
  const toast = useToast();
  const contact = settings.contact || {};
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await publicApi.sendContact(form);
      toast.success(res.message || 'Message sent.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(getApiError(err, 'Failed to send message.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" description="We are here to listen. Reach out with questions, concerns or collaboration ideas." eyebrow="Contact" breadcrumbs={[{ label: 'Contact' }]} />
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-navy-900">Send us a message</h2>
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Full Name *" value={form.name} onChange={set('name')} required />
                  <Input label="Email *" type="email" value={form.email} onChange={set('email')} required />
                  <Input label="Phone" value={form.phone} onChange={set('phone')} />
                  <Input label="Subject" value={form.subject} onChange={set('subject')} />
                </div>
                <Textarea label="Message *" rows={6} value={form.message} onChange={set('message')} required />
                <Button type="submit" variant="accent" loading={submitting}>Send Message</Button>
              </form>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-navy-900">Office Information</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                {contact.address && <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-accent-600" /> {contact.address}</li>}
                {contact.email && <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-accent-600" /> <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a></li>}
                {contact.phone && <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-accent-600" /> <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a></li>}
                {contact.officeHours && <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-accent-600" /> {contact.officeHours}</li>}
              </ul>
            </Card>

            {contact.mapUrl && (
              <Card className="overflow-hidden">
                <iframe
                  src={contact.mapUrl}
                  title="Office location map"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </Card>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
