import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { fileUrl } from '../../services/api.js';
import { PARTNER_TYPES } from '../../config/constants.js';
import { StatusBadge } from '../../components/ui/index.jsx';

export default function PartnersAdminPage() {
  return (
    <ResourceAdmin
      title="Partners"
      description="Manage partner organizations, universities and institutions."
      api={{
        list: (p) => adminApi.partners(p),
        create: (d) => adminApi.createPartner(d),
        update: (id, d) => adminApi.updatePartner(id, d),
        remove: (id) => adminApi.deletePartner(id),
      }}
      columns={[
        { key: 'logo', header: 'Logo', render: (r) => r.logo ? <img src={fileUrl(r.logo)} alt="" className="h-10 w-16 object-contain" /> : '—' },
        { key: 'name', header: 'Name' },
        { key: 'type', header: 'Type', render: (r) => <StatusBadge status={r.type} /> },
        { key: 'displayOrder', header: 'Order' },
        { key: 'isPublished', header: 'Status', render: (r) => <StatusBadge status={r.isPublished ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'type', label: 'Partnership Type', type: 'select', options: PARTNER_TYPES },
        { name: 'website', label: 'Website URL', inputType: 'url' },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'logo', label: 'Logo', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'displayOrder', label: 'Display Order', type: 'number' },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
