import { Link, useParams } from 'react-router-dom';
import { Eye, Target, ListChecks, ShieldCheck, History, Network, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Card } from '../../components/ui/index.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { workAreas } from '../../config/navigation.js';

const SECTIONS = {
  'who-we-are': {
    title: 'Who We Are',
    eyebrow: 'About Us',
    icon: Eye,
    intro:
      'The Human Rights Council of Pakistan – Twin City is a community-based human rights organization working across the Twin Cities (Islamabad and Rawalpindi) to protect and promote the fundamental rights and dignity of every person.',
    body: [
      'We are guided by the universal principles of human rights and the conviction that every individual deserves to live with justice, peace, equality and dignity. Through awareness, advocacy, capacity building and direct support, we stand with communities facing injustice.',
      'Our work is rooted in the belief that informed, empowered communities are the strongest safeguard of human rights. We engage volunteers, professionals, civil society and institutions to build a culture of rights and accountability.',
    ],
  },
  'mission-vision': {
    title: 'Mission & Vision',
    eyebrow: 'About Us',
    icon: Target,
    intro: 'Our purpose and the future we work toward.',
    body: [],
  },
  objectives: {
    title: 'Objectives',
    eyebrow: 'About Us',
    icon: ListChecks,
    intro: 'Our core objectives guide every program and campaign we undertake.',
    body: [],
  },
  'core-values': {
    title: 'Core Values',
    eyebrow: 'About Us',
    icon: ShieldCheck,
    intro: 'The values that define how we work and who we are.',
    body: [],
  },
  history: {
    title: 'History',
    eyebrow: 'About Us',
    icon: History,
    intro: 'Our journey and milestones.',
    body: [
      'The organization was established to respond to the growing need for a dedicated human rights voice in the Twin Cities. From awareness sessions to structured advocacy and legal support, our work has grown steadily through the commitment of volunteers, professionals and partners.',
      'Today, we work across a broad range of rights issues and continue to expand our reach and impact in the community.',
    ],
  },
  'organizational-structure': {
    title: 'Organizational Structure',
    eyebrow: 'About Us',
    icon: Network,
    intro: 'How our organization is governed and managed.',
    body: [],
  },
};

const OBJECTIVES = [
  'Raise awareness about fundamental human rights and freedoms.',
  'Provide guidance and support to individuals facing rights violations.',
  'Advocate for policy and legal reforms that protect human rights.',
  'Empower women, children, minorities and other vulnerable groups.',
  'Promote access to justice and the rule of law.',
  'Build the capacity of communities, volunteers and institutions.',
  'Foster collaboration with national and international partners.',
  'Document and report human rights concerns responsibly.',
];

const VALUES = [
  { title: 'Justice', desc: 'We work for fair treatment and accountability for all, without discrimination.' },
  { title: 'Dignity', desc: 'We uphold the inherent worth of every human being in all our actions.' },
  { title: 'Equality', desc: 'We stand against all forms of discrimination and exclusion.' },
  { title: 'Integrity', desc: 'We act with honesty, transparency and accountability.' },
  { title: 'Compassion', desc: 'We serve with empathy and respect for those who seek our support.' },
  { title: 'Courage', desc: 'We speak and act in defense of rights, even when it is difficult.' },
];

function OrgStructure() {
  const levels = [
    { title: 'Chairman Human Rights Council of Pakistan (HRC-Pakistan)', desc: 'The head of the organization, providing overall leadership, direction and representation.' },
    { title: 'Human Rights Council of Pakistan – Twin City Chapter (Quaid)', desc: 'The head of the Twin City chapter, leading its operations and representing the chapter.' },
    { title: 'Cabinet Members', desc: 'Senior leadership supporting the Chairman in governance, policy and strategic decisions.' },
    { title: 'Executive Body', desc: 'Responsible for day-to-day management, planning and implementation of programs and activities.' },
    { title: 'Ambassador', desc: 'Represents the organization externally and builds partnerships and public outreach.' },
    { title: 'Volunteers & Coordinators', desc: 'Community volunteers and coordinators delivering field-level work and grassroots engagement.' },
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {levels.map((l, i) => (
        <div key={l.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">{i + 1}</span>
            {i < levels.length - 1 && <span className="w-px flex-1 bg-gray-300" aria-hidden="true" />}
          </div>
          <Card className="mb-2 flex-1 p-5">
            <h3 className="text-lg font-bold text-navy-900">{l.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{l.desc}</p>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const { section } = useParams();
  const { settings } = useSettings();
  const content = SECTIONS[section] || SECTIONS['who-we-are'];
  const Icon = content.icon;

  return (
    <>
      <PageHeader
        title={content.title}
        description={content.intro}
        eyebrow={content.eyebrow}
        breadcrumbs={[{ label: 'About', path: '/about/who-we-are' }, { label: content.title }]}
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="card overflow-hidden" aria-label="About sections">
              {Object.entries(SECTIONS).map(([key, s]) => (
                <Link
                  key={key}
                  to={`/about/${key}`}
                  className={`block border-b border-gray-100 px-4 py-3 text-sm font-medium last:border-b-0 ${
                    section === key ? 'bg-navy-900 text-white' : 'text-gray-700 hover:bg-navy-50'
                  }`}
                >
                  {s.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {section === 'mission-vision' && (
              <div className="space-y-6">
                <Card className="p-8">
                  <h2 className="text-xl font-bold text-navy-900">Our Mission</h2>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {settings.mission || 'To promote and protect the fundamental human rights and inherent dignity of every person across the Twin Cities — through awareness, education, advocacy, legal support and community empowerment, with special attention to the vulnerable and marginalized — so that all may live free from discrimination, injustice and fear.'}
                  </p>
                </Card>
                <Card className="p-8">
                  <h2 className="text-xl font-bold text-navy-900">Our Vision</h2>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {settings.vision || 'A just, peaceful and inclusive society in which every person enjoys their universal human rights with equality and dignity; institutions uphold the rule of law and accountability; and informed, empowered communities actively defend the rights of all, without discrimination of any kind.'}
                  </p>
                </Card>
              </div>
            )}

            {section === 'objectives' && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {OBJECTIVES.map((o) => (
                  <li key={o} className="card flex items-start gap-3 p-5">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                    <span className="text-gray-700">{o}</span>
                  </li>
                ))}
              </ul>
            )}

            {section === 'core-values' && (
              <div className="grid gap-5 sm:grid-cols-2">
                {VALUES.map((v) => (
                  <Card key={v.title} className="p-6">
                    <h3 className="text-lg font-bold text-navy-900">{v.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{v.desc}</p>
                  </Card>
                ))}
              </div>
            )}

            {section === 'organizational-structure' && <OrgStructure />}

            {section === 'history' && (
              <div className="prose-content">
                {content.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="text-sm italic text-gray-500">
                  [Detailed verified history and milestones should be added by the organization's administrators.]
                </p>
              </div>
            )}

            {(section === 'who-we-are') && (
              <div>
                <div className="prose-content">
                  {content.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/our-work/women-rights" className="btn-outline">Explore Our Work <ArrowRight className="h-4 w-4" /></Link>
                  <Link to="/leadership" className="btn-outline">Meet Our Team</Link>
                </div>
              </div>
            )}

            {!content.body.length && !['mission-vision', 'objectives', 'core-values', 'organizational-structure'].includes(section) && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-600">
                <Icon className="h-6 w-6 text-accent-600" />
                <p>{content.intro}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
