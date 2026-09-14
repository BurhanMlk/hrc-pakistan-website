import { useState } from 'react';
import ResourceAdmin from '../../components/admin/ResourceAdmin.jsx';
import { adminApi } from '../../services/adminApi.js';
import { StatusBadge, Button } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { formatDate } from '../../utils/helpers.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';

export default function EventsAdminPage() {
  const [registrations, setRegistrations] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const toast = useToast();

  const viewRegistrations = async () => {
    setRegLoading(true);
    setRegistrations([]);
    try {
      const res = await adminApi.eventRegistrations({ limit: 100 });
      setRegistrations(res.data.data || []);
    } catch {
      setRegistrations([]);
    } finally {
      setRegLoading(false);
    }
  };

  const deleteRegistration = async (reg) => {
    if (!window.confirm(`Delete registration for "${reg.name}" (${reg.email})?`)) return;
    try {
      await adminApi.deleteEventRegistration(reg.id);
      toast.success('Registration deleted.');
      await viewRegistrations();
    } catch (err) {
      toast.error(getApiError(err, 'Could not delete registration.'));
    }
  };

  return (
    <>
      <ResourceAdmin
        title="Events"
        description="Manage events and view registrations."
        api={{
        list: (p) => adminApi.events(p),
        create: (d) => adminApi.createEvent(d),
        update: (id, d) => adminApi.updateEvent(id, d),
        remove: (id) => adminApi.deleteEvent(id),
      }}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
          { key: 'venue', header: 'Venue' },
          { key: 'registrationOpen', header: 'Registration', render: (r) => <StatusBadge status={r.registrationOpen ? 'Active' : 'Closed'} /> },
        ]}
        fields={[
          { name: 'title', label: 'Title', required: true, fullWidth: true },
          { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'startTime', label: 'Start Time' },
          { name: 'endTime', label: 'End Time' },
          { name: 'venue', label: 'Venue' },
          { name: 'city', label: 'City' },
          { name: 'speaker', label: 'Speaker' },
          { name: 'organizer', label: 'Organizer' },
          { name: 'capacity', label: 'Capacity (0 = unlimited)', type: 'number' },
          { name: 'poster', label: 'Poster', type: 'file', accept: 'image/*', fullWidth: true },
          { name: 'registrationOpen', label: 'Registration Open', type: 'checkbox' },
          { name: 'isPublished', label: 'Published', type: 'checkbox' },
        ]}
      />
      <div className="mt-6">
        <Button variant="outline" onClick={viewRegistrations} loading={regLoading}>View Event Registrations</Button>
      </div>

      <Modal open={!!registrations} onClose={() => setRegistrations(null)} title="Event Registrations" size="lg">
        <DataTable
          loading={regLoading}
          data={registrations || []}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'event.title', header: 'Event', render: (r) => r.event?.title || '—' },
            { key: 'createdAt', header: 'Registered', render: (r) => formatDate(r.createdAt) },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); deleteRegistration(r); }}
                  className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              ),
            },
          ]}
          emptyMessage="No registrations yet."
        />
      </Modal>
    </>
  );
}
