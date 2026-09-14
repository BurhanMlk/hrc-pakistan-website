import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState, FilterBar } from '../../components/ui/index.jsx';
import Gallery from '../../components/Gallery.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';

const TABS = {
  photos: { title: 'Photos', type: 'photo', category: '' },
  videos: { title: 'Videos', type: 'video', category: '' },
  events: { title: 'Event Gallery', type: '', category: 'Events' },
};

export default function GalleryPage() {
  const { type } = useParams();
  const tab = TABS[type];
  if (!tab) return <Navigate to="/gallery/photos" replace />;

  const { data, loading, error, reload } = useApi(
    () => publicApi.gallery({ type: tab.type || undefined, category: tab.category || undefined }),
    [type]
  );
  const items = data?.data || [];

  return (
    <>
      <PageHeader title={tab.title} description="Moments from our events, campaigns and community work." eyebrow="Gallery" breadcrumbs={[{ label: 'Gallery' }, { label: tab.title }]} />
      <section className="section-pad">
        <div className="container-page">
          <FilterBar className="mb-8">
            {Object.entries(TABS).map(([key, t]) => (
              <a
                key={key}
                href={`/gallery/${key}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  type === key ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.title}
              </a>
            ))}
          </FilterBar>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : items.length ? (
            <Gallery items={items} />
          ) : (
            <EmptyState title="No gallery items yet" description="Photos and videos will appear here." />
          )}
        </div>
      </section>
    </>
  );
}
