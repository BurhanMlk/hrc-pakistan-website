import api from './api.js';

/** Helper to send multipart form data (for forms with file uploads). */
function multipart(data) {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((v) => fd.append(key, v));
    else fd.append(key, value);
  });
  return fd;
}

function postForm(url, data) {
  const hasFile = Object.values(data).some((v) => v instanceof File || (Array.isArray(v) && v.some((x) => x instanceof File)));
  const body = hasFile ? multipart(data) : data;
  const headers = hasFile ? { 'Content-Type': 'multipart/form-data' } : {};
  return api.post(url, body, { headers });
}

function patchForm(url, data) {
  const hasFile = Object.values(data).some((v) => v instanceof File || (Array.isArray(v) && v.some((x) => x instanceof File)));
  const body = hasFile ? multipart(data) : data;
  const headers = hasFile ? { 'Content-Type': 'multipart/form-data' } : {};
  return api.patch(url, body, { headers });
}

export const adminApi = {
  // Auth
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),

  // Dashboard
  dashboard: () => api.get('/dashboard'),

  // Users
  users: (params) => api.get('/users', { params }),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  resetUserPassword: (id, data) => api.post(`/users/${id}/reset-password`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Team
  team: (params) => api.get('/team', { params }),
  createTeam: (data) => postForm('/team', data),
  updateTeam: (id, data) => patchForm(`/team/${id}`, data),
  deleteTeam: (id) => api.delete(`/team/${id}`),

  // Members
  members: (params) => api.get('/members', { params }),
  memberStats: () => api.get('/members/stats'),
  updateMemberStatus: (id, data) => api.patch(`/members/${id}/status`, data),
  deleteMember: (id) => api.delete(`/members/${id}`),

  // Volunteers
  volunteers: (params) => api.get('/volunteers', { params }),
  volunteerStats: () => api.get('/volunteers/stats'),
  updateVolunteerStatus: (id, data) => api.patch(`/volunteers/${id}/status`, data),
  deleteVolunteer: (id) => api.delete(`/volunteers/${id}`),

  // Complaints
  complaints: (params) => api.get('/complaints', { params }),
  complaintStats: () => api.get('/complaints/stats'),
  complaint: (id) => api.get(`/complaints/${id}`),
  updateComplaintStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  assignComplaint: (id, data) => api.patch(`/complaints/${id}/assign`, data),
  setComplaintPriority: (id, data) => api.patch(`/complaints/${id}/priority`, data),
  addComplaintNote: (id, data) => api.post(`/complaints/${id}/notes`, data),
  addInvestigationUpdate: (id, data) => postForm(`/complaints/${id}/investigation`, data),
  closeComplaint: (id) => api.patch(`/complaints/${id}/close`),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),

  // Events
  events: (params) => api.get('/events', { params }),
  createEvent: (data) => postForm('/events', data),
  updateEvent: (id, data) => patchForm(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  eventRegistrations: (params) => api.get('/events/registrations', { params }),
  deleteEventRegistration: (id) => api.delete(`/events/registrations/${id}`),

  // Campaigns
  campaigns: (params) => api.get('/campaigns', { params }),
  createCampaign: (data) => postForm('/campaigns', data),
  updateCampaign: (id, data) => patchForm(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),

  // News
  news: (params) => api.get('/news', { params }),
  createNews: (data) => postForm('/news', data),
  updateNews: (id, data) => patchForm(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),

  // Publications
  publications: (params) => api.get('/publications', { params }),
  createPublication: (data) => postForm('/publications', data),
  updatePublication: (id, data) => patchForm(`/publications/${id}`, data),
  deletePublication: (id) => api.delete(`/publications/${id}`),

  // Gallery
  gallery: (params) => api.get('/gallery', { params }),
  createGallery: (data) => postForm('/gallery', data),
  updateGallery: (id, data) => patchForm(`/gallery/${id}`, data),
  deleteGallery: (id) => api.delete(`/gallery/${id}`),

  // Partners
  partners: (params) => api.get('/partners', { params }),
  createPartner: (data) => postForm('/partners', data),
  updatePartner: (id, data) => patchForm(`/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/partners/${id}`),

  // Awards
  awards: () => api.get('/awards'),
  award: (id) => api.get(`/awards/${id}`),
  createAward: (data) => postForm('/awards', data),
  updateAward: (id, data) => patchForm(`/awards/${id}`, data),
  deleteAward: (id) => api.delete(`/awards/${id}`),
  addWinner: (data) => postForm('/awards/winners', data),
  updateWinner: (id, data) => patchForm(`/awards/winners/${id}`, data),
  deleteWinner: (id) => api.delete(`/awards/winners/${id}`),

  // Trainings
  trainings: () => api.get('/trainings'),
  createTraining: (data) => postForm('/trainings', data),
  updateTraining: (id, data) => patchForm(`/trainings/${id}`, data),
  deleteTraining: (id) => api.delete(`/trainings/${id}`),
  trainingRegistrations: (params) => api.get('/trainings/registrations', { params }),

  // Testimonials
  testimonials: (params) => api.get('/testimonials', { params }),
  createTestimonial: (data) => postForm('/testimonials', data),
  updateTestimonial: (id, data) => patchForm(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Contact
  contact: (params) => api.get('/contact', { params }),
  contactMessage: (id) => api.get(`/contact/${id}`),
  markContactRead: (id) => api.patch(`/contact/${id}/read`),
  deleteContact: (id) => api.delete(`/contact/${id}`),

  // Newsletter
  newsletter: (params) => api.get('/newsletter', { params }),
  deleteSubscriber: (id) => api.delete(`/newsletter/${id}`),

  // Settings
  settings: () => api.get('/settings'),
  saveSetting: (data) => api.post('/settings', data),
  saveSettingsBulk: (settings) => api.post('/settings/bulk', { settings }),

  // Audit
  auditLogs: (params) => api.get('/audit-logs', { params }),
};

export default adminApi;
