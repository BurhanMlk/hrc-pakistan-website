import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { StatusBadge } from '../../components/ui/index.jsx';
import { NEWS_CATEGORIES } from '../../config/constants.js';
import { formatDate } from '../../utils/helpers.js';

export default function NewsAdminPage() {
  return (
    <ResourceAdmin
      title="News & Media"
      description="Manage news, press releases, statements, media coverage and success stories."
      api={{
        list: (p) => adminApi.news(p),
        create: (d) => adminApi.createNews(d),
        update: (id, d) => adminApi.updateNews(id, d),
        remove: (id) => adminApi.deleteNews(id),
      }}
      filters={[
        { key: 'category', label: 'Category', options: NEWS_CATEGORIES },
        { key: 'status', label: 'Status', options: ['draft', 'published'] },
      ]}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'category', header: 'Category', render: (r) => <StatusBadge status={r.category} /> },
        { key: 'author', header: 'Author' },
        { key: 'publishedAt', header: 'Published', render: (r) => formatDate(r.publishedAt) },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, fullWidth: true },
        { name: 'category', label: 'Category', type: 'select', options: NEWS_CATEGORIES },
        { name: 'author', label: 'Author' },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'] },
        { name: 'publishedAt', label: 'Publication Date', type: 'date' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', fullWidth: true },
        { name: 'content', label: 'Content (HTML allowed)', type: 'textarea', rows: 8, fullWidth: true },
        { name: 'featuredImage', label: 'Featured Image', type: 'file', accept: 'image/*', fullWidth: true },
        { name: 'tags', label: 'Tags (comma separated)', type: 'array', multiText: true, fullWidth: true },
        { name: 'seoTitle', label: 'SEO Title', fullWidth: true },
        { name: 'seoDescription', label: 'SEO Description', type: 'textarea', fullWidth: true },
      ]}
    />
  );
}
