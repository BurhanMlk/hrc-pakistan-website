import { Link, useParams, Navigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { SectionHeader, Card } from '../../components/ui/index.jsx';
import { CampaignCard, NewsCard, PublicationCard } from '../../components/cards.jsx';
import useApi from '../../hooks/useApi.js';
import { publicApi } from '../../services/publicApi.js';
import { workAreas } from '../../config/navigation.js';

const AREA_CONTENT = {
  'women-rights': {
    title: 'Women Rights',
    intro: 'We work to advance the rights, safety and empowerment of women across all spheres of life.',
    issues: ['Gender-based violence', 'Equal access to education and employment', 'Legal protection and inheritance rights', 'Political participation'],
    approach: 'Through awareness programs, legal guidance, and advocacy, we support women in understanding and claiming their rights.',
  },
  'child-rights': {
    title: 'Child Rights',
    intro: 'Every child deserves protection, education and the opportunity to thrive.',
    issues: ['Child labour and exploitation', 'Access to quality education', 'Protection from abuse', 'Birth registration and identity'],
    approach: 'We promote child protection through awareness, education programs and community engagement.',
  },
  'minority-rights': {
    title: 'Minority Rights',
    intro: 'We defend the rights and dignity of religious, ethnic and other minority communities.',
    issues: ['Discrimination and exclusion', 'Freedom of religion and belief', 'Equal citizenship', 'Safe places of worship'],
    approach: 'We advocate for equality, interfaith harmony and legal protection for minority communities.',
  },
  'disability-rights': {
    title: 'Disability Rights',
    intro: 'We champion accessibility, inclusion and equal opportunity for persons with disabilities.',
    issues: ['Accessibility and inclusion', 'Education and employment', 'Legal capacity and support', 'Social stigma'],
    approach: 'We raise awareness and advocate for inclusive policies and accessible public services.',
  },
  'education-rights': {
    title: 'Education Rights',
    intro: 'Education is a fundamental right and the foundation of an empowered society.',
    issues: ['Access to schooling', 'Quality of education', 'Out-of-school children', 'Adult literacy'],
    approach: 'We support access to education through awareness, advocacy and community programs.',
  },
  'freedom-of-expression': {
    title: 'Freedom of Expression',
    intro: 'We defend the right to speak freely, peacefully assemble and access information.',
    issues: ['Press freedom', 'Peaceful assembly', 'Digital censorship', 'Protection of journalists'],
    approach: 'We monitor and raise awareness about threats to free expression and advocate for open civic space.',
  },
  'prisoners-rights': {
    title: "Prisoners' Rights",
    intro: 'We work to ensure humane treatment and access to justice for prisoners and detainees.',
    issues: ['Humane detention conditions', 'Access to legal aid', 'Trial delays', 'Rehabilitation'],
    approach: 'We provide guidance, monitor conditions and advocate for fair and humane treatment.',
  },
  'labour-rights': {
    title: 'Labour Rights',
    intro: 'We stand for fair wages, safe workplaces and the dignity of every worker.',
    issues: ['Fair wages and working hours', 'Workplace safety', 'Child and bonded labour', 'Freedom of association'],
    approach: 'We raise awareness about labour laws and support workers in asserting their rights.',
  },
  'refugee-rights': {
    title: 'Refugee Rights',
    intro: 'We advocate for the protection and dignity of refugees and displaced persons.',
    issues: ['Legal status and documentation', 'Access to basic services', 'Non-refoulement', 'Integration'],
    approach: 'We provide information, referrals and advocacy for displaced communities.',
  },
  'digital-rights': {
    title: 'Digital Rights',
    intro: 'We promote privacy, safety and freedom in the digital space.',
    issues: ['Online privacy', 'Digital harassment', 'Access to information', 'Digital literacy'],
    approach: 'We educate communities on digital safety and advocate for rights-respecting technology policies.',
  },
  'environmental-rights': {
    title: 'Environmental Rights',
    intro: 'A healthy environment is essential to the enjoyment of human rights.',
    issues: ['Clean water and air', 'Climate justice', 'Environmental degradation', 'Community health'],
    approach: 'We raise awareness about environmental rights and the link between environment and human dignity.',
  },
  'youth-rights': {
    title: 'Youth Rights',
    intro: 'We empower young people as agents of change in their communities.',
    issues: ['Youth participation', 'Education and skills', 'Employment', 'Civic engagement'],
    approach: 'We build youth capacity through training, mentorship and leadership opportunities.',
  },
  'protection-from-violence': {
    title: 'Protection from Violence',
    intro: 'We work to prevent and respond to all forms of violence.',
    issues: ['Domestic violence', 'Community violence', 'Harassment', 'Protection mechanisms'],
    approach: 'We provide guidance, referrals and awareness to help prevent and address violence.',
  },
  'access-to-justice': {
    title: 'Access to Justice',
    intro: 'Justice should be within reach of every person, regardless of means.',
    issues: ['Legal aid and advice', 'Rule of law', 'Fair trials', 'Accountability'],
    approach: 'We help connect individuals with legal resources and advocate for a fair, accountable justice system.',
  },
};

export default function WorkAreaPage() {
  const { slug } = useParams();
  const content = AREA_CONTENT[slug];
  if (!content) return <Navigate to="/" replace />;

  const { data } = useApi(async () => {
    const [campaigns, publications, news] = await Promise.all([
      publicApi.campaigns({ limit: 3, status: 'Active' }),
      publicApi.publications({ limit: 3 }),
      publicApi.news({ limit: 3 }),
    ]);
    return { campaigns: campaigns.data || [], publications: publications.data || [], news: news.data || [] };
  }, []);

  return (
    <>
      <PageHeader
        title={content.title}
        description={content.intro}
        eyebrow="Our Work"
        breadcrumbs={[{ label: 'Our Work' }, { label: content.title }]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-900">Key Issues</h2>
            <ul className="mt-5 space-y-3">
              {content.issues.map((issue) => (
                <li key={issue} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                  <span className="text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-navy-900">Our Approach</h2>
            <Card className="mt-5 p-6">
              <p className="leading-relaxed text-gray-600">{content.approach}</p>
            </Card>

            {/* CTA */}
            <div className="mt-10 rounded-lg bg-navy-900 p-8 text-white">
              <h3 className="text-xl font-bold text-white">Concerned about a violation in this area?</h3>
              <p className="mt-2 text-navy-100">Report your concern confidentially. Our team reviews every submission with care.</p>
              <Link to="/report-a-concern" className="btn-accent mt-5">
                <AlertTriangle className="h-4 w-4" /> Report a Concern
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <nav className="card overflow-hidden" aria-label="All work areas">
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-500">All Focus Areas</p>
              {workAreas.map((a) => (
                <Link
                  key={a.slug}
                  to={`/our-work/${a.slug}`}
                  className={`block border-b border-gray-100 px-4 py-2.5 text-sm last:border-b-0 ${
                    a.slug === slug ? 'bg-navy-900 font-semibold text-white' : 'text-gray-700 hover:bg-navy-50'
                  }`}
                >
                  {a.title}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </section>

      {/* Related content */}
      {(data?.campaigns?.length || data?.publications?.length || data?.news?.length) && (
        <section className="section-pad bg-gray-50">
          <div className="container-page">
            <SectionHeader eyebrow="Related" title="Related Work" />
            {data?.campaigns?.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
              </div>
            )}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data?.news?.slice(0, 3).map((n) => <NewsCard key={n._id} article={n} />)}
              {data?.publications?.slice(0, 3).map((p) => <PublicationCard key={p._id} publication={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
