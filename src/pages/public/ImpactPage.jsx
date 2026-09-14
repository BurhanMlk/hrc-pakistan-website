import PageHeader from '../../components/layout/PageHeader.jsx';
import { StatsCard, Card } from '../../components/ui/index.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { Users, Megaphone, HeartHandshake, BookOpen, Building2 } from 'lucide-react';

const ICONS = {
  peopleReached: Users,
  awarenessSessions: Megaphone,
  communityCampaigns: HeartHandshake,
  volunteers: HeartHandshake,
  institutionalCollaborations: Building2,
  publications: BookOpen,
};

export default function ImpactPage() {
  const { settings } = useSettings();
  const stats = settings.statistics || [];

  return (
    <>
      <PageHeader title="Our Impact" description="A transparent view of our reach and activities." eyebrow="Impact" breadcrumbs={[{ label: 'Impact' }]} />
      <section className="section-pad">
        <div className="container-page">
          {stats.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {stats.map((s) => {
                const Icon = ICONS[s.key] || Users;
                return <StatsCard key={s.key} label={s.label} value={s.value ?? 0} icon={Icon} />;
              })}
            </div>
          ) : (
            <Card className="p-8 text-center text-gray-600">
              Impact statistics will appear here once configured by administrators. We are committed to transparent reporting of our work.
            </Card>
          )}

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900">Transparency</h3>
              <p className="mt-2 text-sm text-gray-600">We believe in open and honest reporting of our activities and outcomes.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900">Accountability</h3>
              <p className="mt-2 text-sm text-gray-600">We hold ourselves accountable to the communities we serve and our supporters.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900">Community-Led</h3>
              <p className="mt-2 text-sm text-gray-600">Our work is shaped by the needs and voices of the communities we serve.</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
