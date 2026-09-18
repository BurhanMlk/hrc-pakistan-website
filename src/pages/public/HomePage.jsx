import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Megaphone,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  Building2,
  Scale,
  ArrowRight,
  AlertTriangle,
  UserPlus,
  HandHeart,
  School,
  Send,
} from 'lucide-react';
import Hero from '../../components/layout/Hero.jsx';
import { SectionHeader, Button, StatsCard, Card, EmptyState } from '../../components/ui/index.jsx';
import { CampaignCard, EventCard, NewsCard, PublicationCard, PartnerLogo } from '../../components/cards.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useApi from '../../hooks/useApi.js';
import usePageMeta from '../../hooks/usePageMeta.js';
import { publicApi } from '../../services/publicApi.js';
import { workAreas } from '../../config/navigation.js';
import { getApiError } from '../../services/api.js';

const STAT_ICONS = {
  peopleReached: Users,
  awarenessSessions: Megaphone,
  communityCampaigns: HeartHandshake,
  volunteers: HeartHandshake,
  institutionalCollaborations: Building2,
  publications: BookOpen,
};

const CABINET_MEMBERS = [
  { name: 'Murad Ali', role: 'President', image: '/President%20Murad%20Ali.jpeg' },
  { name: 'Hamamd Abbasi', role: 'General Secretary', image: '/Hamamd%20Abbasi%20General%20Secretary%20.jpeg', pos: '50% 40%' },
  { name: 'Malik Burhan', role: 'Special Assistant to President', image: '/Special%20Assistant%20to%20President%20Malik%20Burhan.jpeg' },
  { name: 'Azhar Bugti', role: 'Vice President (Male)', image: '/Vice%20President%20Male%20Azhar%20Bugti.jpeg', pos: '50% 15%' },
  { name: 'Rida Batool', role: 'Vice President (Female)', image: '/Voice%20president%20fe,ale%20rida%20batool.jpeg' },
  { name: 'Hamdan Alam', role: 'Joint Secretary', image: '/JOint%20Secretary%20Hamdan%20Alam.jpeg' },
  { name: 'Aqsa Asif', role: 'Information Secretary', image: '/Information%20Secretary%20Aqsa%20Asif.jpeg' },
  { name: 'Laiba Fayyaz', role: 'Media Secretary', image: '/Media%20Secretary%20Laiba%20Fayyaz%20.jpeg', pos: '50% 25%' },
  { name: 'Sardar Tayyab Khan', role: 'Media Manager', image: '/Sardar%20Tayyab%20Khan%20Media%20Manager.jpeg' },
  { name: 'Muhammad Waleed Ahmed', role: 'Finance Secretary', image: '/Fianance%20Secretary%20Muhammad%20Waleed%20Ahmed.jpeg', pos: '50% 15%' },
  { name: 'Hafsa Ashraf', role: 'Event Secretary', image: '/Event%20Secretary%20Hafsa%20Ashraf.jpeg' },
  { name: 'Faheem', role: 'Membership Coordinator', image: '/Faheem%20Membership%20Coordinator.jpeg' },
  { name: 'Zahir Ullah', role: 'Outreach and Universities Ambassador for Islamabad and Rawalpindi', image: '/Zahir%20Ullah%20Outreach%20ambassodar%20for%20universities.jpeg' },
  { name: 'Tahir Raja', role: 'Spokes Person', image: '/Spokes%20Person%20Tahir%20Raja.jpeg' },
  { name: 'Muhammad Nouman Ahsan', role: 'Director Environment Department', image: '/Muhammad%20Nouman%20Ahsan%20Head%20Standing%20Committee%20On%20Climate%20Change%20.jpeg' },
  { name: 'Toheed Ahmed Abbasi', role: 'Special Assistant To General Secretary', image: '/special%20Assitant%20To%20General%20Secertary%20Toheed%20Ahmed%20Abbasi.jpeg' },
];

function HomeStats() {
  const { settings } = useSettings();
  const stats = settings.statistics || [];
  if (!stats.length) {
    return (
      <p className="text-center text-sm text-gray-500">
        Impact statistics will appear here once configured by administrators.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = STAT_ICONS[stat.key] || Users;
        return (
          <StatsCard key={stat.key} label={stat.label} value={stat.value ?? 0} icon={Icon} dark />
        );
      })}
    </div>
  );
}

export default function HomePage() {
  usePageMeta('Home', 'Human Rights Council of Pakistan – Twin City. Defending human rights, promoting justice, peace, equality and dignity.');
  const { settings } = useSettings();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const { data: home } = useApi(async () => {
    const [campaigns, events, news, publications, partners, testimonials] = await Promise.all([
      publicApi.campaigns({ limit: 3, status: 'Active' }),
      publicApi.events({ limit: 3, upcoming: 'true' }),
      publicApi.news({ limit: 3 }),
      publicApi.publications({ limit: 3 }),
      publicApi.partners(),
      publicApi.testimonials(),
    ]);
    return { campaigns, events, news, publications, partners, testimonials };
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await publicApi.subscribeNewsletter(email);
      toast.success(res.message || 'Subscribed successfully.');
      setEmail('');
    } catch (err) {
      toast.error(getApiError(err, 'Subscription failed.'));
    } finally {
      setSubscribing(false);
    }
  };

  const intro = settings.introduction;
  const campaigns = home?.campaigns?.data || [];
  const events = home?.events?.data || [];
  const news = home?.news?.data || [];
  const publications = home?.publications?.data || [];
  const partners = home?.partners || [];
  const testimonials = home?.testimonials || [];

  return (
    <>
      <Hero />

      {/* Chairman message */}
      <section className="section-pad bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          {/* Picture (left) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-navy-100 bg-navy-50/50 p-2 shadow-soft">
              <img
                src="/Chairman%20HRC-P%20pic.jpeg"
                alt="Mr. Jamshed Hussain — Chairman, Human Rights Council of Pakistan (HRC-P)"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
            <div className="mt-5 text-center">
              <p className="text-2xl font-bold text-navy-900">Mr. Jamshed Hussain</p>
              <p className="mt-1 text-sm font-semibold text-accent-600">
                Chairman, Human Rights Council of Pakistan (HRC-P)
              </p>
            </div>
          </motion.div>

          {/* Content (right) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionHeader
              align="left"
              eyebrow="Chairman's Message"
              title="Human Rights Council of Pakistan (HRC-Pakistan) Twin City"
              className="mb-6"
            />
            <p className="text-justify text-base leading-relaxed text-gray-600 sm:text-lg">
              Mr. Jamshed Hussain serves as the Chairman of the Human Rights Council of
              Pakistan (HRC-P), leading the organization with a strong commitment to human
              rights, justice, and equality. Under his leadership, HRC-P works to promote
              awareness, protect fundamental rights, and support vulnerable communities
              across Pakistan. The Twin Cities Chapter (Islamabad–Rawalpindi) operates under
              HRC-P to strengthen human rights initiatives at the local level. The chapter
              actively engages youth, volunteers, and civil society in meaningful social and
              humanitarian activities. Through collective efforts, HRC-P continues to advance
              the values of dignity, justice, peace, and respect for all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* President message */}
      <section className="section-pad bg-navy-50/50">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          {/* Picture (left) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-soft">
              <img
                src="/President%20Murad%20Ali.jpeg"
                alt="Mr. Murad Ali — President, Human Rights Council of Pakistan (HRC-P), Twin Cities Chapter"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
            <div className="mt-5 text-center">
              <p className="text-2xl font-bold text-navy-900">Mr. Murad Ali</p>
              <p className="mt-1 text-sm font-semibold text-accent-600">
                President, Human Rights Council of Pakistan (HRC-P), Twin Cities Chapter
              </p>
            </div>
          </motion.div>

          {/* Content (right) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionHeader
              align="left"
              eyebrow="President's Message"
              title="Human Rights Council of Pakistan (HRC-P) Twin Cities Chapter"
              className="mb-6"
            />
            <p className="text-justify text-base leading-relaxed text-gray-600 sm:text-lg">
              Mr. Murad Ali serves as the President of the Human Rights Council of Pakistan
              (HRC-P), Twin Cities Chapter (Islamabad–Rawalpindi). He is committed to
              promoting human rights, justice, equality, and social responsibility across the
              Twin Cities. Under his leadership, the chapter works to raise awareness and
              encourage meaningful community engagement. HRC-P Twin Cities brings together
              youth, volunteers, and civil society to support humanitarian and human rights
              initiatives. His vision is to build a more just, peaceful, and rights-conscious
              society through collective action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sub Wings */}
      <section className="section-pad bg-navy-50/50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Our Sub Wings"
            title="Initiatives for Every Voice"
            description="Dedicated wings working for youth, women and awareness through our publications."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-8 text-center">
              <img
                src="/ymna%20logo.jpeg"
                alt="Youth Model National Assembly (YMNA) logo"
                className="mx-auto mb-4 h-20 w-auto max-w-[180px] object-contain"
              />
              <h3 className="text-lg font-bold text-navy-900">Youth Model National Assembly (YMNA)</h3>
              <p className="mt-2 text-sm text-gray-600">A dedicated wing for youth promotion and leadership development.</p>
            </Card>
            <Card className="p-8 text-center">
              <img
                src="/Soch%20aurat%20logo.jpeg"
                alt="Soch Aurat logo"
                className="mx-auto mb-4 h-20 w-auto max-w-[180px] object-contain"
              />
              <h3 className="text-lg font-bold text-navy-900">Soch Aurat</h3>
              <p className="mt-2 text-sm text-gray-600">A dedicated wing for women's promotion and empowerment.</p>
            </Card>
            <Card className="p-8 text-center">
              <img
                src="/MAshal%20logo.jpeg"
                alt="Mashal logo"
                className="mx-auto mb-4 h-20 w-auto max-w-[180px] object-contain"
              />
              <h3 className="text-lg font-bold text-navy-900">Mashal</h3>
              <p className="mt-2 text-sm text-gray-600">Our magazine wing,publications, research and awareness material.</p>
            </Card>
            <Card className="p-8 text-center">
              <img
                src="/VOX%20Digital.jpeg"
                alt="VOX Digital logo"
                className="mx-auto mb-4 h-20 w-auto max-w-[180px] object-contain"
              />
              <h3 className="text-lg font-bold text-navy-900">VOX Digital</h3>
              <p className="mt-2 text-sm text-gray-600">Our podcast wing — digital audio, discussions and voices.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Cabinet */}
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Our Cabinet"
            title="Human Rights Council of Pakistan (HRC-Pakistan) Twin City Cabinet 2026-2027"
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {CABINET_MEMBERS.map((member) => (
              <div key={member.role} className="text-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.role}
                    className="mx-auto mb-3 h-32 w-32 rounded-full border-4 border-navy-100 object-cover shadow-soft"
                    style={member.pos ? { objectPosition: member.pos } : undefined}
                  />
                ) : (
                  <div className="mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-full border-4 border-navy-100 bg-navy-50">
                    <Users className="h-12 w-12 text-navy-300" aria-hidden="true" />
                  </div>
                )}
                {member.name ? (
                  <>
                    <p className="text-sm font-bold text-navy-900">{member.name}</p>
                    <p className="mt-0.5 text-xs text-gray-600">{member.role}</p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-navy-900">{member.role}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Who We Are"
              title="A committed voice for human rights in the Twin Cities"
              className="mb-4"
            />
            <div className="space-y-4 text-gray-600">
              {intro ? (
                <p className="leading-relaxed">{intro}</p>
              ) : (
                <p className="leading-relaxed">
                  The Human Rights Council of Pakistan – Twin City works to protect and promote fundamental human rights
                  through awareness, advocacy, legal support and community action.
                </p>
              )}
              <p className="leading-relaxed">
                We believe that justice, peace, equality and dignity are the foundation of every free and fair society.
                Our work brings together volunteers, professionals and institutions to defend the rights of the most
                vulnerable.
              </p>
            </div>
            <div className="mt-6">
              <Link to="/about/who-we-are" className="btn-outline">
                Learn more about us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Justice', 'Peace', 'Equality', 'Dignity'].map((value, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center rounded-lg bg-navy-50 p-8 text-center"
              >
                <Scale className="h-7 w-7 text-accent-600" />
                <span className="mt-3 text-lg font-bold text-navy-900">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact statistics */}
      <section className="section-pad bg-navy-900">
        <div className="container-page">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-400">Our Impact</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Working for measurable change</h2>
          </div>
          <HomeStats />
        </div>
      </section>

      {/* Areas of work */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeader
            eyebrow="Our Work"
            title="Areas of Focus"
            description="We work across a broad range of human rights issues to protect dignity and secure justice for all."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {workAreas.map((area, i) => (
              <motion.div key={area.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }}>
                <Link
                  to={`/our-work/${area.slug}`}
                  className="flex h-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-navy-900 transition hover:border-accent-400 hover:shadow-soft"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                  {area.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest campaigns */}
      <section className="section-pad bg-gray-50">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader align="left" eyebrow="Take Action" title="Latest Campaigns" className="mb-8" />
            <Link to="/campaigns" className="mb-8 hidden shrink-0 text-sm font-semibold text-accent-600 hover:text-accent-700 sm:block">
              View all →
            </Link>
          </div>
          {campaigns.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
            </div>
          ) : (
            <EmptyState title="No active campaigns yet" description="Active campaigns will appear here." />
          )}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader align="left" eyebrow="Get Involved" title="Upcoming Events" className="mb-8" />
            <Link to="/events" className="mb-8 hidden shrink-0 text-sm font-semibold text-accent-600 hover:text-accent-700 sm:block">
              View all →
            </Link>
          </div>
          {events.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
          ) : (
            <EmptyState title="No upcoming events" description="Check back soon for upcoming events and workshops." />
          )}
        </div>
      </section>

      {/* Latest news */}
      <section className="section-pad bg-gray-50">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader align="left" eyebrow="News & Media" title="Latest News" className="mb-8" />
            <Link to="/news" className="mb-8 hidden shrink-0 text-sm font-semibold text-accent-600 hover:text-accent-700 sm:block">
              View all →
            </Link>
          </div>
          {news.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => <NewsCard key={n._id} article={n} />)}
            </div>
          ) : (
            <EmptyState title="No news yet" description="News and updates will appear here." />
          )}
        </div>
      </section>

      {/* Featured publications */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader align="left" eyebrow="Publications" title="Featured Publications" className="mb-8" />
            <Link to="/publications" className="mb-8 hidden shrink-0 text-sm font-semibold text-accent-600 hover:text-accent-700 sm:block">
              View library →
            </Link>
          </div>
          {publications.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publications.map((p) => <PublicationCard key={p._id} publication={p} />)}
            </div>
          ) : (
            <EmptyState title="No publications yet" description="Reports and research will appear here." />
          )}
        </div>
      </section>

      {/* Concern CTA */}
      <section className="bg-navy-950 py-20 text-center text-white">
        <div className="container-page max-w-3xl">
          <AlertTriangle className="mx-auto mb-5 h-12 w-12 text-accent-400" />
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Have you experienced or witnessed a human rights concern?</h2>
          <p className="mt-4 text-lg text-navy-100">
            Your voice matters. Report a concern confidentially and our team will review it with care.
          </p>
          <div className="mt-8">
            <Link to="/report-a-concern" className="btn-accent text-base">
              Report a Concern <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section className="section-pad bg-gray-50">
        <div className="container-page">
          <SectionHeader eyebrow="Get Involved" title="How You Can Help" description="There are many ways to support human rights in your community." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: UserPlus, title: 'Become a Member', desc: 'Join a community of people committed to human rights.', to: '/get-involved/membership' },
              { icon: HandHeart, title: 'Volunteer', desc: 'Give your time and skills to meaningful causes.', to: '/get-involved/volunteer' },
              { icon: School, title: 'Attend Training', desc: 'Build your knowledge through workshops and sessions.', to: '/get-involved/training' },
              { icon: HeartHandshake, title: 'Partner With Us', desc: 'Collaborate with us as an institution or organization.', to: '/get-involved/partnerships' },
            ].map((item) => (
              <Card key={item.title} className="flex flex-col p-6 transition hover:shadow-card">
                <item.icon className="h-8 w-8 text-accent-600" />
                <h3 className="mt-4 text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{item.desc}</p>
                <Link to={item.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="section-pad bg-gray-50">
          <div className="container-page">
            <SectionHeader eyebrow="Partners" title="Our Partners" description="We work alongside institutions, universities and organizations that share our mission." />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p) => <PartnerLogo key={p._id} partner={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-pad">
          <div className="container-page">
            <SectionHeader eyebrow="Community Voices" title="What People Say" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t._id} className="p-6">
                  <p className="text-gray-600">“{t.content}”</p>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="font-bold text-navy-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}{t.organization ? ` · ${t.organization}` : ''}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-navy-900 py-16">
        <div className="container-page flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white">Stay informed</h2>
            <p className="mt-2 text-navy-100">Subscribe to our newsletter for updates on campaigns, events and human rights issues.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input flex-1"
            />
            <Button type="submit" variant="accent" loading={subscribing} aria-label="Subscribe">
              <Send className="h-4 w-4" /> Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
