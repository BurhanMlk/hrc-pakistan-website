import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, FileText, ArrowRight, Users } from 'lucide-react';
import { Card, StatusBadge } from './ui/index.jsx';
import { fileUrl } from '../services/api.js';
import { formatDate, truncate } from '../utils/helpers.js';

function CardImage({ src, alt, className = 'h-44' }) {
  return (
    <div className={`${className} w-full overflow-hidden bg-navy-50`}>
      {src ? (
        <img src={fileUrl(src)} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-navy-100 text-navy-400">
          <FileText className="h-10 w-10" />
        </div>
      )}
    </div>
  );
}

export function CampaignCard({ campaign }) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link to={`/campaigns/${campaign.slug}`} className="block">
        <CardImage src={campaign.featuredImage} alt={campaign.title} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <StatusBadge status={campaign.status} />
          {campaign.endDate && <span className="text-xs text-gray-500">until {formatDate(campaign.endDate)}</span>}
        </div>
        <Link to={`/campaigns/${campaign.slug}`} className="text-lg font-bold text-navy-900 hover:text-navy-700">
          {campaign.title}
        </Link>
        <p className="mt-2 flex-1 text-sm text-gray-600">{truncate(campaign.description, 120)}</p>
        <Link
          to={`/campaigns/${campaign.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
        >
          Learn more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

export function EventCard({ event }) {
  const date = new Date(event.date);
  return (
    <Card className="flex overflow-hidden transition-shadow hover:shadow-card">
      <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-navy-900 py-4 text-white">
        <span className="text-2xl font-extrabold">{date.getDate()}</span>
        <span className="text-xs uppercase tracking-wide text-navy-200">{date.toLocaleString('en', { month: 'short' })}</span>
        <span className="text-xs text-navy-300">{date.getFullYear()}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/events/${event.slug}`} className="font-bold text-navy-900 hover:text-navy-700">
          {event.title}
        </Link>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          {event.venue && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400" /> {event.venue}{event.city ? `, ${event.city}` : ''}
            </p>
          )}
          {event.startTime && (
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" /> {event.startTime}
            </p>
          )}
        </div>
        <Link to={`/events/${event.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
          View details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

export function NewsCard({ article }) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link to={`/news/${article.slug}`} className="block">
        <CardImage src={article.featuredImage} alt={article.title} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <StatusBadge status={article.category} />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <Link to={`/news/${article.slug}`} className="text-lg font-bold text-navy-900 hover:text-navy-700">
          {article.title}
        </Link>
        <p className="mt-2 flex-1 text-sm text-gray-600">{truncate(article.excerpt, 130)}</p>
      </div>
    </Card>
  );
}

export function PublicationCard({ publication }) {
  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-card">
      <div className="flex items-start gap-4">
        <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-navy-100">
          {publication.coverImage ? (
            <img src={fileUrl(publication.coverImage)} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-navy-400">
              <FileText className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{publication.category}</p>
          <Link to={`/publications/${publication.slug}`} className="mt-1 block font-bold leading-snug text-navy-900 hover:text-navy-700">
            {publication.title}
          </Link>
          <p className="mt-1 text-xs text-gray-500">
            {publication.author ? `${publication.author} · ` : ''}
            {formatDate(publication.date)}
          </p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm text-gray-600">{truncate(publication.description, 120)}</p>
      <Link to={`/publications/${publication.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
        View & download <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

export function TeamCard({ member }) {
  return (
    <Card className="overflow-hidden text-center transition-shadow hover:shadow-card">
      <div className="h-56 w-full overflow-hidden bg-navy-50">
        {member.photo ? (
          <img src={fileUrl(member.photo)} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy-100 text-5xl font-bold text-navy-300">
            {(member.name || '?').charAt(0)}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy-900">{member.name}</h3>
        <p className="text-sm font-medium text-accent-600">{member.position}</p>
        {member.department && <p className="mt-1 text-xs text-gray-500">{member.department}</p>}
        {member.bio && <p className="mt-3 text-sm text-gray-600">{truncate(member.bio, 100)}</p>}
      </div>
    </Card>
  );
}

export function PartnerLogo({ partner }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-soft">
      <div className="flex h-16 w-full items-center justify-center">
        {partner.logo ? (
          <img src={fileUrl(partner.logo)} alt={partner.name} className="max-h-16 max-w-full object-contain" loading="lazy" />
        ) : (
          <span className="text-center text-lg font-bold text-navy-400">{partner.name}</span>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-medium text-gray-700">{partner.name}</p>
      {partner.type && <p className="text-xs text-gray-500">{partner.type}</p>}
    </div>
  );
}

export default { CampaignCard, EventCard, NewsCard, PublicationCard, TeamCard, PartnerLogo };
