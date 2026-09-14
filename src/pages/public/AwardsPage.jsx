import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState, ErrorState } from '../../components/ui/index.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';

export default function AwardsPage() {
  const { data, loading, error, reload } = useApi(() => publicApi.awards(), []);
  const awards = data?.awards || [];
  const winners = data?.winners || [];

  return (
    <>
      <PageHeader title="Awards & Recognition" description="Recognizing outstanding contributions to human rights." eyebrow="Recognition" breadcrumbs={[{ label: 'Awards & Recognition' }]} />
      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
          ) : error ? (
            <ErrorState message={getApiError(error)} onRetry={reload} />
          ) : awards.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {awards.map((a) => (
                <div key={a._id} className="card overflow-hidden">
                  {a.photo && <img src={fileUrl(a.photo)} alt={a.title} className="h-40 w-full object-cover" loading="lazy" />}
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{a.category} · {a.year}</p>
                    <h3 className="mt-1 text-lg font-bold text-navy-900">{a.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No awards yet" description="Awards and recognitions will be listed here." />
          )}

          {winners.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 text-2xl font-bold text-navy-900">Award Winners</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {winners.map((w) => (
                  <div key={w._id} className="card p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-lg font-bold text-navy-700">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900">{w.name}</h3>
                        <p className="text-sm text-gray-500">{w.title || w.organization}</p>
                      </div>
                    </div>
                    {w.bio && <p className="mt-3 text-sm text-gray-600">{w.bio}</p>}
                    {w.award && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent-600">{w.award.title} · {w.award.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
