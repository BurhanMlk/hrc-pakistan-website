import { Link } from 'react-router-dom';
import {
  Users, AlertTriangle, Megaphone, Calendar, FileText, Mail,
  ArrowRight, HeartHandshake, BookOpen, GraduationCap, Newspaper,
} from 'lucide-react';
import { Card, StatusBadge, ErrorState } from '../../components/ui/index.jsx';
import useApi from '../../hooks/useApi.js';
import { adminApi } from '../../services/adminApi.js';
import { getApiError } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

function StatCard({ label, value, icon: Icon, to }) {
  return (
    <Link to={to} className="card block p-5 transition hover:shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-extrabold text-navy-900">{value}</p>
          <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
        </div>
        <Icon className="h-8 w-8 text-accent-600" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { data, loading, error, reload } = useApi(() => adminApi.dashboard().then((r) => r.data.data), []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />)}
      </div>
    );
  }
  if (error) return <ErrorState message={getApiError(error)} onRetry={reload} />;

  const c = data.cards;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Members" value={c.members} icon={Users} to="/admin/members" />
        <StatCard label="Volunteers" value={c.volunteers} icon={HeartHandshake} to="/admin/volunteers" />
        <StatCard label="Total Complaints" value={c.complaints} icon={AlertTriangle} to="/admin/complaints" />
        <StatCard label="Pending Complaints" value={c.pendingComplaints} icon={AlertTriangle} to="/admin/complaints" />
        <StatCard label="Active Campaigns" value={c.activeCampaigns} icon={Megaphone} to="/admin/campaigns" />
        <StatCard label="Upcoming Events" value={c.upcomingEvents} icon={Calendar} to="/admin/events" />
        <StatCard label="Publications" value={c.publications} icon={BookOpen} to="/admin/publications" />
        <StatCard label="Contact Messages" value={c.contactMessages} icon={Mail} to="/admin/contact" />
      </div>

      {/* Complaint status breakdown */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Complaints by Status</h2>
          {Object.keys(data.complaintByStatus).length ? (
            <ul className="space-y-2">
              {Object.entries(data.complaintByStatus).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between border-b border-gray-100 py-2 text-sm">
                  <StatusBadge status={status} />
                  <span className="font-bold text-navy-900">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No complaints yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center justify-between text-lg font-bold text-navy-900">
            Recent Complaints
            <Link to="/admin/complaints" className="flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">View all <ArrowRight className="h-4 w-4" /></Link>
          </h2>
          {data.recent.complaints.length ? (
            <ul className="divide-y divide-gray-100">
              {data.recent.complaints.map((comp) => (
                <li key={comp._id} className="py-2.5">
                  <Link to={`/admin/complaints/${comp._id}`} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-900">{comp.complaintId}</p>
                      <p className="text-xs text-gray-500">{comp.incidentType || '—'} · {formatDate(comp.createdAt)}</p>
                    </div>
                    <StatusBadge status={comp.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No complaints yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Recent Members</h2>
          {data.recent.members.length ? (
            <ul className="space-y-2 text-sm">
              {data.recent.members.map((m) => (
                <li key={m._id} className="flex items-center justify-between">
                  <span className="text-gray-700">{m.fullName}</span>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No applications yet.</p>}
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Recent Messages</h2>
          {data.recent.messages.length ? (
            <ul className="space-y-2 text-sm">
              {data.recent.messages.map((m) => (
                <li key={m._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.subject || '—'}</p>
                  </div>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-red-500" title="Unread" />}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No messages yet.</p>}
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Recent News</h2>
          {data.recent.news.length ? (
            <ul className="space-y-2 text-sm">
              {data.recent.news.map((n) => (
                <li key={n._id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-gray-700">{n.title}</span>
                  <StatusBadge status={n.status} />
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No articles yet.</p>}
        </Card>
      </div>
    </div>
  );
}
