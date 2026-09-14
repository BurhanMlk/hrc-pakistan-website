import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, Pagination, SearchBar, FilterBar } from '../../components/ui/index.jsx';
import { PublicationCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { PUBLICATION_CATEGORIES } from '../../config/constants.js';

export default function PublicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error, reload } = useApi(
    () => publicApi.publications({ page, limit: 9, category: category || undefined, search: search || undefined }),
    [page, category, search]
  );

  const publications = data?.data || [];

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader title="Publications" description="Browse our reports, research, policy briefs and awareness materials." eyebrow="Knowledge Hub" breadcrumbs={[{ label: 'Publications' }]} />
      <section className="section-pad">
        <div className="container-page">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <SearchBar value={search} onChange={(e) => update('q', e.target.value)} placeholder="Search publications…" />
            <FilterBar>
              <select className="input" value={category} onChange={(e) => update('category', e.target.value)} aria-label="Filter by category">
                <option value="">All categories</option>
                {PUBLICATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterBar>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : publications.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {publications.map((p) => <PublicationCard key={p._id} publication={p} />)}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={(p) => update('page', String(p))} />
            </>
          ) : (
            <EmptyState title="No publications found" description="Try a different search or category." />
          )}
        </div>
      </section>
    </>
  );
}
