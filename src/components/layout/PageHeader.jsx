import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import usePageMeta from '../../hooks/usePageMeta.js';

/** Standard interior page banner with breadcrumbs. */
export default function PageHeader({ title, description, eyebrow, breadcrumbs = [] }) {
  usePageMeta(title, description);
  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* Rich blue heading background */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 90% at 85% 15%, rgba(37,99,235,0.30), transparent 60%), ' +
            'linear-gradient(120deg, #12345e 0%, #0e2a4d 45%, #0b2545 100%)',
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-page py-16 sm:py-20">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-navy-200">
            <Link to="/" className="hover:text-white">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {b.path ? <Link to={b.path} className="hover:text-white">{b.label}</Link> : <span className="text-navy-100">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent-400">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-navy-100">{description}</p>}
        <span className="mt-6 block h-1 w-20 rounded-full bg-accent-500" aria-hidden="true" />
      </div>
    </section>
  );
}
