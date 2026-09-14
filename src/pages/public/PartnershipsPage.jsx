import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Card } from '../../components/ui/index.jsx';
import { Handshake, Building2, GraduationCap, HeartHandshake, ArrowRight } from 'lucide-react';

export default function PartnershipsPage() {
  const options = [
    { icon: Building2, title: 'Institutional Partnership', desc: 'Collaborate with us as an organization, NGO or civil society group on joint programs and advocacy.' },
    { icon: GraduationCap, title: 'Academic Collaboration', desc: 'Partner with us for research, internships, awareness sessions and student engagement.' },
    { icon: Handshake, title: 'Media Partnership', desc: 'Help amplify human rights stories and awareness through media cooperation.' },
    { icon: HeartHandshake, title: 'Funding & Support', desc: 'Support our work through grants, donations and in-kind contributions.' },
  ];

  return (
    <>
      <PageHeader title="Partnerships" description="Collaborate with us to strengthen the protection of human rights." eyebrow="Get Involved" breadcrumbs={[{ label: 'Get Involved' }, { label: 'Partnerships' }]} />
      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2">
            {options.map((o) => (
              <Card key={o.title} className="p-8">
                <o.icon className="h-9 w-9 text-accent-600" />
                <h2 className="mt-4 text-xl font-bold text-navy-900">{o.title}</h2>
                <p className="mt-2 text-gray-600">{o.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-lg bg-navy-900 p-8 text-center text-white">
            <h2 className="text-2xl font-bold text-white">Interested in partnering with us?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-100">
              We welcome collaboration with organizations and institutions that share our commitment to human rights.
              Reach out and our team will get back to you.
            </p>
            <Link to="/contact" className="btn-accent mt-6">Contact Us <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
