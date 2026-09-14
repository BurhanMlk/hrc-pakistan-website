import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  AlertTriangle,
  Calendar,
  Megaphone,
  Newspaper,
  FileText,
  Image as ImageIcon,
  Handshake,
  Trophy,
  MessageSquare,
  Mail,
  Settings,
  ScrollText,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { cn } from '../utils/helpers.js';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: UserCog },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { to: '/admin/complaints', label: 'Complaints', icon: AlertTriangle },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/admin/news', label: 'News & Media', icon: Newspaper },
  { to: '/admin/publications', label: 'Publications', icon: FileText },
  { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { to: '/admin/partners', label: 'Partners', icon: Handshake },
  { to: '/admin/awards', label: 'Awards', icon: Trophy },
  { to: '/admin/trainings', label: 'Training', icon: GraduationCap },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/contact', label: 'Contact Messages', icon: Mail },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-950 text-navy-200">
      <div className="flex items-center gap-2 border-b border-navy-900 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-500 font-serif text-base font-bold text-white">H</span>
        <div>
          <p className="text-sm font-bold text-white">Admin Console</p>
          <p className="text-[11px] text-navy-400">HRC Twin City</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3" aria-label="Admin navigation">
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-navy-900 hover:text-white',
                isActive ? 'bg-navy-900 text-white' : 'text-navy-300'
              )
            }
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-navy-900 p-3">
        <div className="mb-2 px-2">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="text-[11px] text-navy-400">{user.role}</p>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-navy-300 hover:bg-navy-900 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
          <button className="rounded p-2 text-gray-600 hover:bg-gray-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Signed in as <span className="font-semibold text-navy-900">{user.name}</span></span>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
