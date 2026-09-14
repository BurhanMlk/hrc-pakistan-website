import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Input, Textarea, Button, Card, ErrorState } from '../../components/ui/index.jsx';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';

export default function SettingsAdminPage() {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.settings();
      const rows = res.data.data || [];
      const map = {};
      rows.forEach((r) => (map[r.key] = r.value));
      setSettings(map);
      setStats((map.statistics || []).map((s) => ({ ...s })));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = [
        { key: 'organizationName', value: settings.organizationName },
        { key: 'organizationShortName', value: settings.organizationShortName },
        { key: 'tagline', value: settings.tagline },
        { key: 'hero', value: settings.hero },
        { key: 'introduction', value: settings.introduction },
        { key: 'mission', value: settings.mission },
        { key: 'vision', value: settings.vision },
        { key: 'contact', value: settings.contact },
        { key: 'socialLinks', value: settings.socialLinks },
        { key: 'footer', value: settings.footer },
        { key: 'payment', value: settings.payment },
        { key: 'statistics', value: stats },
      ];
      await adminApi.saveSettingsBulk(payload);
      toast.success('Settings saved.');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 animate-pulse rounded-lg bg-gray-200" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const hero = settings.hero || {};
  const contact = settings.contact || {};
  const social = settings.socialLinks || {};
  const footer = settings.footer || {};
  const payment = settings.payment || {};

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Website Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage site content without changing code.</p>
        </div>
        <Button variant="accent" onClick={save} loading={saving}><Save className="h-4 w-4" /> Save All</Button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">General</h2>
          <div className="space-y-4">
            <Input label="Organization Name" value={settings.organizationName || ''} onChange={(e) => set('organizationName', e.target.value)} />
            <Input label="Short Name" value={settings.organizationShortName || ''} onChange={(e) => set('organizationShortName', e.target.value)} />
            <Input label="Tagline" value={settings.tagline || ''} onChange={(e) => set('tagline', e.target.value)} />
            <Textarea label="Introduction" value={settings.introduction || ''} onChange={(e) => set('introduction', e.target.value)} />
            <Textarea label="Mission" value={settings.mission || ''} onChange={(e) => set('mission', e.target.value)} />
            <Textarea label="Vision" value={settings.vision || ''} onChange={(e) => set('vision', e.target.value)} />
            <Textarea label="Footer Description" value={footer.description || ''} onChange={(e) => set('footer', { ...footer, description: e.target.value })} />
          </div>
        </Card>

        {/* Hero */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Homepage Hero</h2>
          <div className="space-y-4">
            <Input label="Headline" value={hero.headline || ''} onChange={(e) => set('hero', { ...hero, headline: e.target.value })} />
            <Textarea label="Subtext" value={hero.subtext || ''} onChange={(e) => set('hero', { ...hero, subtext: e.target.value })} />
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Address" value={contact.address || ''} onChange={(e) => set('contact', { ...contact, address: e.target.value })} />
            <Input label="Email" value={contact.email || ''} onChange={(e) => set('contact', { ...contact, email: e.target.value })} />
            <Input label="Phone" value={contact.phone || ''} onChange={(e) => set('contact', { ...contact, phone: e.target.value })} />
            <Input label="Office Hours" value={contact.officeHours || ''} onChange={(e) => set('contact', { ...contact, officeHours: e.target.value })} />
            <Input label="Map Embed URL" className="sm:col-span-2" value={contact.mapUrl || ''} onChange={(e) => set('contact', { ...contact, mapUrl: e.target.value })} />
          </div>
        </Card>

        {/* Membership Payment */}
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-bold text-navy-900">Membership Payment</h2>
          <p className="mb-4 text-xs text-gray-500">Bank account details shown on the "Become a Member" page. Applicants must upload a payment screenshot.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Account Title" value={payment.accountTitle || ''} onChange={(e) => set('payment', { ...payment, accountTitle: e.target.value })} />
            <Input label="Account Number" value={payment.accountNumber || ''} onChange={(e) => set('payment', { ...payment, accountNumber: e.target.value })} />
            <Input label="Bank Name" value={payment.bankName || ''} onChange={(e) => set('payment', { ...payment, bankName: e.target.value })} />
            <Textarea label="Payment Instructions" className="sm:col-span-2" value={payment.instructions || ''} onChange={(e) => set('payment', { ...payment, instructions: e.target.value })} />
          </div>
        </Card>

        {/* Social links */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {['facebook', 'twitter', 'linkedin', 'youtube', 'instagram'].map((k) => (
              <Input key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={social[k] || ''} onChange={(e) => set('socialLinks', { ...social, [k]: e.target.value })} />
            ))}
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-bold text-navy-900">Impact Statistics</h2>
          <p className="mb-4 text-xs text-gray-500">Only enter verified statistics. Leave 0 or add "DEMO" notes for placeholders.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((s, i) => (
              <Input
                key={s.key}
                label={s.label}
                type="number"
                value={s.value ?? 0}
                onChange={(e) => setStats((arr) => arr.map((x, idx) => (idx === i ? { ...x, value: Number(e.target.value) } : x)))}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
