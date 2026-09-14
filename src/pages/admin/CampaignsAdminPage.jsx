import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { StatusBadge } from '../../components/ui/index.jsx';
import { CAMPAIGN_STATUSES } from '../../config/constants.js';
import { formatDate } from '../../utils/helpers.js';

export default function CampaignsAdminPage() {
  return (
    <ResourceAdmin
      title="Campaigns"
      description="Manage awareness and advocacy campaigns."
      api={{
        list: (p) => adminApi.campaigns(p),
        create: (d) => adminApi.createCampaign(d),
        update: (id, d) => adminApi.updateCampaign(id, d),
        remove: (id) => adminApi.deleteCampaign(id),
      }}
      filters={[{ key: 'status', label: 'Status', options: CAMPAIGN_STATUSES }]}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'startDate', header: 'Start', render: (r) => formatDate(r.startDate) },
        { key: 'endDate', header: 'End', render: (r) => formatDate(r.endDate) },
        { key: 'isPublished', header: 'Published', render: (r) => <StatusBadge status={r.isPublished ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, fullWidth: true },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'status', label: 'Status', type: 'select', options: CAMPAIGN_STATUSES },
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'endDate', label: 'End Date', type: 'date' },
        { name: 'featuredImage', label: 'Featured Image', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'objectives', label: 'Objectives (comma separated)', type: 'array', multiText: true, fullWidth: true },
        { name: 'activities', label: 'Activities (comma separated)', type: 'array', multiText: true, fullWidth: true },
        { name: 'results', label: 'Results (comma separated)', type: 'array', multiText: true, fullWidth: true },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
