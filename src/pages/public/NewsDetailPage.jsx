import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { StatusBadge, ErrorState, Skeleton } from '../../components/ui/index.jsx';
import { NewsCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import usePageMeta from '../../hooks/usePageMeta.js';
import { publicApi } from '../../services/publicApi.js';
import { getApiError, fileUrl } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useApi(() => publicApi.newsBySlug(slug), [slug]);
  const article = data?.article;
  usePageMeta(article?.seoTitle || article?.title, article?.seoDescription || article?.excerpt);

  if (loading) return <div className="container-page section-pad"><Skeleton className="h-10 w-1/2" /><Skeleton className="mt-4 h-72 w-full" /></div>;
  if (error || !article) return <div className="container-page section-pad"><ErrorState message={getApiError(error, 'Article not found.')} onRetry={reload} /></div>;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <PageHeader
        title={article.title}
        eyebrow={article.category}
        description={article.excerpt}
        breadcrumbs={[{ label: 'News', path: '/news' }, { label: article.category }]}
      />
      <article className="section-pad">
        <div className="container-page mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(article.publishedAt)}</span>
            {article.author && <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {article.author}</span>}
            <StatusBadge status={article.category} />
          </div>

          {article.featuredImage && <img src={fileUrl(article.featuredImage)} alt={article.title} className="mb-8 w-full rounded-lg object-cover shadow-card" />}

          <div className="prose-content" dangerouslySetInnerHTML={{ __html: article.content }} />

          {article.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <Link key={t} to={`/news?q=${encodeURIComponent(t)}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">#{t}</Link>
              ))}
            </div>
          )}

          {/* Social sharing */}
          <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
            <span className="text-sm font-semibold text-gray-600">Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="text-sm text-navy-700 hover:underline">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="text-sm text-navy-700 hover:underline">X / Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="text-sm text-navy-700 hover:underline">LinkedIn</a>
          </div>

          <Link to="/news" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
            <ArrowLeft className="h-4 w-4" /> Back to news
          </Link>
        </div>
      </article>

      {data?.related?.length > 0 && (
        <section className="bg-gray-50 section-pad">
          <div className="container-page">
            <h2 className="mb-6 text-xl font-bold text-navy-900">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.related.map((a) => <NewsCard key={a._id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
