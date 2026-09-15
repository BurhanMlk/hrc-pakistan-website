import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, AlertTriangle, Search } from 'lucide-react';
import { navItems } from '../../config/navigation.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { cn } from '../../utils/helpers.js';

// Items that overflow at common desktop widths are grouped under a "More" menu
// so every tab stays on the navy bar instead of spilling onto the white page.
const DESKTOP_MORE_LABELS = ['Awards & Recognition', 'Impact', 'Contact'];
const desktopNavItems = navItems.filter((item) => !DESKTOP_MORE_LABELS.includes(item.label));
const moreNavItems = navItems.filter((item) => DESKTOP_MORE_LABELS.includes(item.label));

function DesktopDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className={cn(
          'flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium text-gray-200 hover:text-white hover:bg-navy-800',
          open && 'bg-navy-800 text-white'
        )}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 mt-1 rounded-lg border border-navy-700 bg-navy-900 py-2 shadow-card',
            item.wide ? 'w-[34rem]' : 'w-64'
          )}
          role="menu"
        >
          <ul className={cn(item.wide && 'grid grid-cols-2 gap-x-2')}>
            {item.children.map((child) => (
              <li key={child.path}>
                <Link
                  to={child.path}
                  role="menuitem"
                  className="block rounded-md px-4 py-2 text-sm text-navy-100 hover:bg-navy-800 hover:text-white"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  if (!item.children) {
    return (
      <Link to={item.path} onClick={onNavigate} className="block border-b border-navy-800 px-4 py-3 text-sm font-medium text-gray-200 hover:bg-navy-800">
        {item.label}
      </Link>
    );
  }
  return (
    <div className="border-b border-navy-800">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:bg-navy-800"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="bg-navy-900">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onNavigate}
              className="block px-6 py-2.5 text-sm text-gray-300 hover:bg-navy-800 hover:text-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-navy-950 text-navy-100 lg:block">
        <div className="container-page flex items-center justify-center py-1.5 text-xs">
          <p className="text-navy-200">{settings.tagline}</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-navy-900 shadow-soft" aria-label="Main navigation">
        <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Home">
            <img
              src="/HRCP LOGO.png"
              alt="Human Rights Council of Pakistan"
              className="h-11 w-auto rounded-md bg-white object-contain p-0.5"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 pl-2 2xl:flex">
            {desktopNavItems.map((item) =>
              item.children ? (
                <DesktopDropdown key={item.label} item={item} />
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium text-gray-200 hover:bg-navy-800 hover:text-white',
                      isActive && 'bg-navy-800 text-white'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            {moreNavItems.length > 0 && <DesktopDropdown item={{ label: 'More', children: moreNavItems }} />}
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/report-a-concern" className="hidden items-center gap-1.5 whitespace-nowrap rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-white hover:bg-accent-600 sm:inline-flex">
              <AlertTriangle className="h-4 w-4" /> Report a Concern
            </Link>
            <Link to="/track-complaint" className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800 lg:inline-flex">
              <Search className="h-4 w-4" /> Track Complaint
            </Link>
            <Link to="/get-involved/membership" className="hidden whitespace-nowrap rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800 md:inline-flex">
              Join Us
            </Link>
            <button
              className="inline-flex rounded-md p-2 text-white hover:bg-navy-800 2xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 2xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 flex h-full w-96 max-w-[90vw] flex-col overflow-y-auto bg-navy-900 shadow-card">
            <div className="flex items-center justify-between border-b border-navy-800 p-4">
              <span className="font-bold text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="rounded p-1 text-white hover:bg-navy-800" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <MobileItem key={item.label} item={item} onNavigate={() => setMobileOpen(false)} />
              ))}
              <div className="space-y-2 p-4">
                <Link to="/report-a-concern" onClick={() => setMobileOpen(false)} className="btn-accent w-full">
                  <AlertTriangle className="h-4 w-4" /> Report a Concern
                </Link>
                <Link
                  to="/track-complaint"
                  onClick={() => setMobileOpen(false)}
                  className="btn w-full border border-white/30 bg-transparent text-white hover:bg-navy-800"
                >
                  <Search className="h-4 w-4" /> Track Complaint
                </Link>
                <Link
                  to="/get-involved/membership"
                  onClick={() => setMobileOpen(false)}
                  className="btn w-full border border-white/30 bg-transparent text-white hover:bg-navy-800"
                >
                  Join Us
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
