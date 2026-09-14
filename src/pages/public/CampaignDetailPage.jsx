import { Link, useParams } from 'react-router-dom';
import { Calendar, CheckCircle2, Target, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { StatusBadge, ErrorState, Skeleton } from '../../components/ui/index.jsx';
import { NewsCard, PublicationCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import usePageMeta from '../../hooks/usePageMeta.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function CampaignDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useApi(() => publicApi.campaignBySlug(slug), [slug]);
  usePageMeta(data?.title, data?.description);

  if (loading) {
    return (
      <div className="container-page section-pad">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-4 h-64 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }
  if (error || !data) return <div className="container-page section-pad"><ErrorState message={getApiError(error, 'Campaign not found.')} onRetry={reload} /></div>;

  return (
    <>
      <PageHeader title={data.title} eyebrow={data.status} description={data.description} breadcrumbs={[{ label: 'Campaigns', path: '/campaigns' }, { label: data.title }]} />
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {data.featuredImage && (
              <img src={fileUrl(data.featuredImage)} alt={data.title} className="mb-8 w-full rounded-lg object-cover shadow-card" />
            )}

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(data.startDate)} — {formatDate(data.endDate)}</span>
              <StatusBadge status={data.status} />
            </div>

            {data.objectives?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-navy-900"><Target className="h-5 w-5 text-accent-600" /> Objectives</h2>
                <ul className="space-y-2">
                  {data.objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {o}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.activities?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-navy-900"><Activity className="h-5 w-5 text-accent-600" /> Activities</h2>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  {data.activities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}

            {data.results?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-bold text-navy-900">Results</h2>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  {data.results.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {data.gallery?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-bold text-navy-900">Gallery</h2>
                <div className="grid grid-cols-3 gap-3">
                  {data.gallery.map((g, i) => <img key={i} src={fileUrl(g)} alt={`${data.title} gallery ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" loading="lazy" />)}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg bg-navy-900 p-6 text-white">
              <h3 className="text-lg font-bold text-white">Support this campaign</h3>
              <p className="mt-2 text-sm text-navy-100">Get involved by volunteering or spreading awareness.</p>
              <Link to="/get-involved/volunteer" className="btn-accent mt-4 w-full">Volunteer <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-red-800"><AlertTriangle className="h-5 w-5" /> See something wrong?</h3>
              <p className="mt-2 text-sm text-red-700">If this campaign relates to a concern you experienced, report it confidentially.</p>
              <Link to="/report-a-concern" className="btn-danger mt-4 w-full">Report a Concern</Link>
            </div>
          </aside>
        </div>

        {(data.relatedNews?.length > 0 || data.relatedPublications?.length > 0) && (
          <div className="container-page mt-12">
            {data.relatedNews?.length > 0 && (
              <>
                <h2 className="mb-4 text-xl font-bold text-navy-900">Related News</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.relatedNews.map((n) => <NewsCard key={n._id} article={n} />)}
                </div>
              </>
            )}
            {data.relatedPublications?.length > 0 && (
              <>
                <h2 className="mb-4 mt-8 text-xl font-bold text-navy-900">Related Publications</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.relatedPublications.map((p) => <PublicationCard key={p._id} publication={p} />)}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
}
