import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, Pagination, FilterBar } from '../../components/ui/index.jsx';
import { CampaignCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { CAMPAIGN_STATUSES } from '../../config/constants.js';

export default function CampaignsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error, reload } = useApi(
    () => publicApi.campaigns({ page, limit: 9, status: status || undefined }),
    [page, status]
  );

  const campaigns = data?.data || [];

  const setStatus = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('status', value);
    else params.delete('status');
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Explore our campaigns — from awareness drives to advocacy for policy change."
        eyebrow="Take Action"
        breadcrumbs={[{ label: 'Campaigns' }]}
      />
      <section className="section-pad">
        <div className="container-page">
          <FilterBar className="mb-8">
            {['', ...CAMPAIGN_STATUSES].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === s ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </FilterBar>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : campaigns.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={(p) => {
                const params = new URLSearchParams(searchParams);
                params.set('page', p);
                setSearchParams(params);
              }} />
            </>
          ) : (
            <EmptyState title="No campaigns found" description="Try a different filter or check back later." />
          )}
        </div>
      </section>
    </>
  );
}
