import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { fileUrl } from '../../services/api.js';
import { TEAM_CATEGORIES } from '../../config/constants.js';
import { StatusBadge } from '../../components/ui/index.jsx';

export default function AdminTeamPage() {
  return (
    <ResourceAdmin
      title="Team Members"
      description="Manage leadership, executive members, departments and coordinators."
      api={{
        list: (p) => adminApi.team(p),
        create: (d) => adminApi.createTeam(d),
        update: (id, d) => adminApi.updateTeam(id, d),
        remove: (id) => adminApi.deleteTeam(id),
      }}
      columns={[
        { key: 'photo', header: 'Photo', render: (r) => r.photo ? <img src={fileUrl(r.photo)} alt="" className="h-10 w-10 rounded-full object-cover" /> : '—' },
        { key: 'name', header: 'Name' },
        { key: 'position', header: 'Position' },
        { key: 'category', header: 'Category', render: (r) => <StatusBadge status={r.category} /> },
        { key: 'displayOrder', header: 'Order' },
        { key: 'isActive', header: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'position', label: 'Position', required: true },
        { name: 'department', label: 'Department' },
        { name: 'category', label: 'Category', type: 'select', options: TEAM_CATEGORIES },
        { name: 'bio', label: 'Short Biography', type: 'textarea', fullWidth: true },
        { name: 'photo', label: 'Photo', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'displayOrder', label: 'Display Order', type: 'number' },
        { name: 'isActive', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
