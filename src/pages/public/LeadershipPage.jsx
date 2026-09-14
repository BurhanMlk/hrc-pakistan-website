import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { SectionHeader, EmptyState, ErrorState } from '../../components/ui/index.jsx';
import { TeamCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { TEAM_CATEGORIES } from '../../config/constants.js';

export default function LeadershipPage() {
  const [category, setCategory] = useState('All');
  const { data, loading, error, reload } = useApi(() => publicApi.team(), []);

  const members = data?.data || [];
  const filtered = category === 'All' ? members : members.filter((m) => m.category === category);

  return (
    <>
      <PageHeader
        title="Leadership & Team"
        description="Meet the people who lead and power our work for human rights in the Twin Cities."
        eyebrow="Our People"
        breadcrumbs={[{ label: 'Leadership & Team' }]}
      />

      <section className="section-pad">
        <div className="container-page">
          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Team categories">
            {['All', ...TEAM_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                role="tab"
                aria-selected={category === c}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category === c ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((m) => <TeamCard key={m._id} member={m} />)}
            </div>
          ) : (
            <EmptyState title="No team members yet" description="Team profiles will appear here once added by administrators." />
          )}
        </div>
      </section>
    </>
  );
}
