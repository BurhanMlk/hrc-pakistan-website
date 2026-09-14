import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, Pagination, SearchBar, FilterBar } from '../../components/ui/index.jsx';
import { NewsCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { NEWS_CATEGORIES } from '../../config/constants.js';

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error, reload } = useApi(
    () => publicApi.news({ page, limit: 9, category: category || undefined, search: search || undefined }),
    [page, category, search]
  );

  const articles = data?.data || [];

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader title="News & Media" description="Latest news, press releases, statements and success stories." eyebrow="Stay Informed" breadcrumbs={[{ label: 'News & Media' }]} />
      <section className="section-pad">
        <div className="container-page">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <SearchBar value={search} onChange={(e) => update('q', e.target.value)} placeholder="Search news…" />
            <FilterBar>
              <select className="input" value={category} onChange={(e) => update('category', e.target.value)} aria-label="Filter by category">
                <option value="">All categories</option>
                {NEWS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterBar>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : articles.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => <NewsCard key={a._id} article={a} />)}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={(p) => update('page', String(p))} />
            </>
          ) : (
            <EmptyState title="No articles found" description="Try a different search or category." />
          )}
        </div>
      </section>
    </>
  );
}
