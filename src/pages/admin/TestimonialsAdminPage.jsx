import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { truncate } from '../../utils/helpers.js';
import { StatusBadge } from '../../components/ui/index.jsx';

export default function TestimonialsAdminPage() {
  return (
    <ResourceAdmin
      title="Testimonials"
      description="Manage community voices shown on the homepage."
      api={{
        list: (p) => adminApi.testimonials(p),
        create: (d) => adminApi.createTestimonial(d),
        update: (id, d) => adminApi.updateTestimonial(id, d),
        remove: (id) => adminApi.deleteTestimonial(id),
      }}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'role', header: 'Role' },
        { key: 'content', header: 'Content', render: (r) => truncate(r.content, 60) },
        { key: 'displayOrder', header: 'Order' },
        { key: 'isPublished', header: 'Status', render: (r) => <StatusBadge status={r.isPublished ? 'Active' : 'Closed'} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Role' },
        { name: 'organization', label: 'Organization' },
        { name: 'content', label: 'Testimonial', type: 'textarea', required: true, fullWidth: true },
        { name: 'displayOrder', label: 'Display Order', type: 'number' },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
