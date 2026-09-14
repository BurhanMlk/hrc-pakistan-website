import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { fileUrl } from '../../services/api.js';
import { StatusBadge } from '../../components/ui/index.jsx';

export default function GalleryAdminPage() {
  return (
    <ResourceAdmin
      title="Gallery"
      description="Manage photos and videos shown in the public gallery."
      api={{
        list: (p) => adminApi.gallery(p),
        create: (d) => adminApi.createGallery(d),
        update: (id, d) => adminApi.updateGallery(id, d),
        remove: (id) => adminApi.deleteGallery(id),
      }}
      columns={[
        { key: 'image', header: 'Preview', render: (r) => r.image ? <img src={fileUrl(r.image)} alt="" className="h-10 w-14 rounded object-cover" /> : '—' },
        { key: 'title', header: 'Title' },
        { key: 'type', header: 'Type', render: (r) => <StatusBadge status={r.type} /> },
        { key: 'category', header: 'Category' },
        { key: 'isPublished', header: 'Status', render: (r) => <StatusBadge status={r.isPublished ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['photo', 'video'] },
        { name: 'category', label: 'Category', type: 'select', options: ['Events', 'Campaigns', 'Trainings', 'Community', 'Other'] },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'image', label: 'Image', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'videoUrl', label: 'Video URL (for videos)', inputType: 'url', fullWidth: true },
        { name: 'displayOrder', label: 'Display Order', type: 'number' },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
