import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { StatusBadge } from '../../components/ui/index.jsx';
import { PUBLICATION_CATEGORIES } from '../../config/constants.js';
import { formatDate } from '../../utils/helpers.js';

export default function PublicationsAdminPage() {
  return (
    <ResourceAdmin
      title="Publications"
      description="Manage reports, research papers, policy briefs and materials."
      api={{
        list: (p) => adminApi.publications(p),
        create: (d) => adminApi.createPublication(d),
        update: (id, d) => adminApi.updatePublication(id, d),
        remove: (id) => adminApi.deletePublication(id),
      }}
      filters={[{ key: 'category', label: 'Category', options: PUBLICATION_CATEGORIES }]}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'category', header: 'Category', render: (r) => <StatusBadge status={r.category} /> },
        { key: 'author', header: 'Author' },
        { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
        { key: 'file', header: 'PDF', render: (r) => r.file ? '✓' : '—' },
        { key: 'isPublished', header: 'Status', render: (r) => <StatusBadge status={r.isPublished ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, fullWidth: true },
        { name: 'category', label: 'Category', type: 'select', options: PUBLICATION_CATEGORIES },
        { name: 'author', label: 'Author' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'coverImage', label: 'Cover Image', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'file', label: 'PDF File', type: 'file', accept: '.pdf', fullWidth: true },
        { name: 'tags', label: 'Tags (comma separated)', type: 'array', multiText: true, fullWidth: true },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
