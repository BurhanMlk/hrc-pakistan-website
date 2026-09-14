import { useState } from 'react';
import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { StatusBadge, Button } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { formatDate } from '../../utils/helpers.js';

export default function TrainingsAdminPage() {
  const [registrations, setRegistrations] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const viewRegistrations = async () => {
    setRegLoading(true);
    setRegistrations([]);
    try {
      const res = await adminApi.trainingRegistrations({});
      setRegistrations(res.data.data || []);
    } catch {
      setRegistrations([]);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <ResourceAdmin
        title="Training & Workshops"
        description="Manage training programs and registrations."
        api={{
        list: (p) => adminApi.trainings(p),
        create: (d) => adminApi.createTraining(d),
        update: (id, d) => adminApi.updateTraining(id, d),
        remove: (id) => adminApi.deleteTraining(id),
      }}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'trainer', header: 'Trainer' },
          { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
          { key: 'venue', header: 'Venue' },
          { key: 'registrationOpen', header: 'Registration', render: (r) => <StatusBadge status={r.registrationOpen ? 'Active' : 'Closed'} /> },
        ]}
        fields={[
          { name: 'title', label: 'Title', required: true, fullWidth: true },
          { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
          { name: 'trainer', label: 'Trainer' },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'time', label: 'Time' },
          { name: 'venue', label: 'Venue' },
          { name: 'capacity', label: 'Capacity (0 = unlimited)', type: 'number' },
          { name: 'poster', label: 'Poster', type: 'file', accept: 'image/*', fullWidth: true },
          { name: 'registrationOpen', label: 'Registration Open', type: 'checkbox' },
          { name: 'isPublished', label: 'Published', type: 'checkbox' },
        ]}
      />
      <div className="mt-6">
        <Button variant="outline" onClick={viewRegistrations} loading={regLoading}>View Training Registrations</Button>
      </div>

      <Modal open={!!registrations} onClose={() => setRegistrations(null)} title="Training Registrations" size="lg">
        <DataTable
          loading={regLoading}
          data={registrations || []}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'training.title', header: 'Training', render: (r) => r.training?.title || '—' },
          ]}
          emptyMessage="No registrations yet."
        />
      </Modal>
    </>
  );
}
