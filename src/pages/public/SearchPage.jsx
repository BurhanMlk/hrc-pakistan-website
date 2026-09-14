import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Button, EmptyState, ErrorState, Pagination, SearchBar } from '../../components/ui/index.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { formatDate, truncate } from '../../utils/helpers.js';

const TYPE_LABELS = { news: 'News', campaigns: 'Campaign', events: 'Event', publications: 'Publication', areas: 'Focus Area' };

function resultLink(item) {
  switch (item._type) {
    case 'news': return `/news/${item.slug}`;
    case 'campaigns': return `/campaigns/${item.slug}`;
    case 'events': return `/events/${item.slug}`;
    case 'publications': return `/publications/${item.slug}`;
    case 'areas': return `/our-work/${item.slug}`;
    default: return '#';
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSubmitted(query.trim());
    try {
      const res = await publicApi.search({ q: query.trim(), type: type || undefined, limit: 20 });
      setData(res);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const results = data?.data || [];

  return (
    <>
      <PageHeader title="Search" description="Search across news, campaigns, events, publications and focus areas." eyebrow="Find" breadcrumbs={[{ label: 'Search' }]} />
      <section className="section-pad">
        <div className="container-page mx-auto max-w-4xl">
          <form onSubmit={runSearch} className="flex flex-col gap-3 sm:flex-row">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the website…" className="flex-1" />
            <Button type="submit" loading={loading}><Search className="h-4 w-4" /> Search</Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {['', 'news', 'campaigns', 'events', 'publications', 'areas'].map((t) => (
              <button key={t || 'all'} onClick={() => setType(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${type === t ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {t ? TYPE_LABELS[t] : 'All'}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

          {loading ? (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : submitted && results.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No results found" description={`No matches for "${submitted}". Try different keywords.`} />
            </div>
          ) : results.length > 0 ? (
            <div className="mt-6 space-y-3">
              {results.map((item, i) => (
                <Link key={i} to={resultLink(item)} className="card block p-5 transition hover:shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-navy-900">{item.title}</h3>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">{TYPE_LABELS[item._type] || item._type}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{truncate(item.description || item.excerpt || '', 160)}</p>
                  {item.publishedAt && <p className="mt-1 text-xs text-gray-400">{formatDate(item.publishedAt)}</p>}
                </Link>
              ))}
              {data && data.pages > 1 && <Pagination page={data.page} pages={data.pages} onChange={() => {}} />}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
