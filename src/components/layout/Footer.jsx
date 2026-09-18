import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { workAreas } from '../../config/navigation.js';

export default function Footer() {
  const { settings } = useSettings();
  const contact = settings.contact || {};
  const social = settings.socialLinks || {};

  const socialLinks = [
    { key: 'facebook', icon: Facebook, href: social.facebook },
    { key: 'twitter', icon: Twitter, href: social.twitter },
    { key: 'linkedin', icon: Linkedin, href: social.linkedin },
    { key: 'youtube', icon: Youtube, href: social.youtube },
    { key: 'instagram', icon: Instagram, href: social.instagram },
  ];

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/twin city logo.jpeg"
              alt={settings.organizationName || 'Human Rights Council of Pakistan'}
              className="h-12 w-auto rounded-md bg-white object-contain p-0.5"
            />
            <span className="font-bold text-white">{settings.organizationShortName || 'HRC Twin City'}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {(settings.footer && settings.footer.description) ||
              'Working for the protection and promotion of human rights, justice, peace, equality and dignity across the Twin Cities.'}
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((s) => {
              if (!s.href) {
                return (
                  <span
                    key={s.key}
                    aria-label={s.key}
                    title={`${s.key} (add link in Admin → Settings)`}
                    className="cursor-default rounded-md bg-navy-900 p-2 text-navy-500"
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                );
              }
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.key}
                  title={s.key}
                  className="rounded-md bg-navy-900 p-2 text-navy-300 hover:bg-navy-800 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about/who-we-are" className="hover:text-white">About Us</Link></li>
            <li><Link to="/leadership" className="hover:text-white">Leadership & Team</Link></li>
            <li><Link to="/campaigns" className="hover:text-white">Campaigns</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/awards" className="hover:text-white">Awards & Recognition</Link></li>
            <li><Link to="/impact" className="hover:text-white">Impact</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Our work */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Our Work</h3>
          <ul className="space-y-2 text-sm">
            {workAreas.slice(0, 7).map((a) => (
              <li key={a.slug}>
                <Link to={`/our-work/${a.slug}`} className="hover:text-white">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get involved + contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Get Involved</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/get-involved/membership" className="hover:text-white">Become a Member</Link></li>
            <li><Link to="/get-involved/volunteer" className="hover:text-white">Volunteer</Link></li>
            <li><Link to="/get-involved/training" className="hover:text-white">Training & Workshops</Link></li>
            <li><Link to="/get-involved/partnerships" className="hover:text-white">Partnerships</Link></li>
            <li><Link to="/report-a-concern" className="hover:text-white">Report a Concern</Link></li>
          </ul>

          {(contact.address || contact.email || contact.phone || contact.officeHours) && (
            <>
              <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-navy-300">
                {contact.address && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> {contact.address}</li>}
                {contact.email && <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>}
                {contact.phone && <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> <a href={`tel:${contact.phone}`} className="hover:text-white">{contact.phone}</a></li>}
                {contact.officeHours && <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0" /> {contact.officeHours}</li>}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-navy-900">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.organizationName || 'Human Rights Council of Pakistan – Twin City'}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-white">Terms of Use</Link>
            <Link to="/data-protection" className="hover:text-white">Data Protection Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
