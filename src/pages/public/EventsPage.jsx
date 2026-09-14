import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, Pagination, FilterBar } from '../../components/ui/index.jsx';
import { EventCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'upcoming';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error, reload } = useApi(
    () => publicApi.events({ page, limit: 9, upcoming: tab === 'upcoming' ? 'true' : 'false' }),
    [page, tab]
  );

  const events = data?.data || [];

  const setTab = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader
        title="Events"
        description="Join our events, awareness sessions, workshops and community gatherings."
        eyebrow="Get Involved"
        breadcrumbs={[{ label: 'Events' }]}
      />
      <section className="section-pad">
        <div className="container-page">
          <FilterBar className="mb-8">
            {[{ value: 'upcoming', label: 'Upcoming Events' }, { value: 'past', label: 'Past Events' }].map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.value ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </FilterBar>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : events.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e) => <EventCard key={e._id} event={e} />)}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={(p) => {
                const params = new URLSearchParams(searchParams);
                params.set('page', p);
                setSearchParams(params);
              }} />
            </>
          ) : (
            <EmptyState title={`No ${tab} events`} description={tab === 'upcoming' ? 'Check back soon for upcoming events.' : 'Past events will appear here.'} />
          )}
        </div>
      </section>
    </>
  );
}
