import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Download, ArrowLeft, FileText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { StatusBadge, ErrorState, Skeleton, Button } from '../../components/ui/index.jsx';
import useApi from '../../hooks/useApi.js';
import usePageMeta from '../../hooks/usePageMeta.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useApi(() => publicApi.publicationBySlug(slug), [slug]);
  usePageMeta(data?.title, data?.description);

  if (loading) return <div className="container-page section-pad"><Skeleton className="h-10 w-1/2" /><Skeleton className="mt-4 h-64 w-full" /></div>;
  if (error || !data) return <div className="container-page section-pad"><ErrorState message={getApiError(error, 'Publication not found.')} onRetry={reload} /></div>;

  return (
    <>
      <PageHeader title={data.title} eyebrow={data.category} description={data.description} breadcrumbs={[{ label: 'Publications', path: '/publications' }, { label: data.category }]} />
      <section className="section-pad">
        <div className="container-page mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(data.date)}</span>
            {data.author && <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {data.author}</span>}
            <StatusBadge status={data.category} />
          </div>

          {data.coverImage && <img src={fileUrl(data.coverImage)} alt={data.title} className="mb-8 w-full rounded-lg object-cover shadow-card" />}

          <div className="prose-content">
            <p>{data.description}</p>
          </div>

          {data.file ? (
            <a href={fileUrl(data.file)} target="_blank" rel="noreferrer" className="btn-accent mt-6">
              <Download className="h-4 w-4" /> Download PDF
            </a>
          ) : (
            <p className="mt-6 inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" /> Document file will be available here once uploaded.
            </p>
          )}

          {data.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {data.tags.map((t) => (
                <Link key={t} to={`/publications?q=${encodeURIComponent(t)}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">#{t}</Link>
              ))}
            </div>
          )}

          <Link to="/publications" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
            <ArrowLeft className="h-4 w-4" /> Back to library
          </Link>
        </div>
      </section>
    </>
  );
}
