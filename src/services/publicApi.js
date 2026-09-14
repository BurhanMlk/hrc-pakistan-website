import api from './api.js';

/** Public content services — grouped for reuse across pages. */
export const publicApi = {
  settings: () => api.get('/settings/public').then((r) => r.data.data),
  team: (params) => api.get('/team/public', { params }).then((r) => r.data),
  campaigns: (params) => api.get('/campaigns/public', { params }).then((r) => r.data),
  campaignBySlug: (slug) => api.get(`/campaigns/public/slug/${slug}`).then((r) => r.data.data),
  events: (params) => api.get('/events/public', { params }).then((r) => r.data),
  eventBySlug: (slug) => api.get(`/events/public/slug/${slug}`).then((r) => r.data.data),
  registerEvent: (id, data) => api.post(`/events/${id}/register`, data).then((r) => r.data),
  news: (params) => api.get('/news/public', { params }).then((r) => r.data),
  newsBySlug: (slug) => api.get(`/news/public/slug/${slug}`).then((r) => r.data.data),
  publications: (params) => api.get('/publications/public', { params }).then((r) => r.data),
  publicationBySlug: (slug) => api.get(`/publications/public/slug/${slug}`).then((r) => r.data.data),
  gallery: (params) => api.get('/gallery/public', { params }).then((r) => r.data),
  partners: () => api.get('/partners/public').then((r) => r.data.data),
  testimonials: () => api.get('/testimonials/public').then((r) => r.data.data),
  awards: () => api.get('/awards/public').then((r) => r.data.data),
  trainings: () => api.get('/trainings/public').then((r) => r.data.data),
  registerTraining: (id, data) => api.post(`/trainings/${id}/register`, data).then((r) => r.data),
  search: (params) => api.get('/search', { params }).then((r) => r.data),
  subscribeNewsletter: (email) => api.post('/newsletter/subscribe', { email }).then((r) => r.data),
  sendContact: (data) => api.post('/contact', data).then((r) => r.data),
  submitComplaint: (formData) =>
    api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  trackComplaint: (id) => api.get(`/complaints/track/${id}`).then((r) => r.data.data),
  submitMember: (formData) =>
    api.post('/members/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  submitVolunteer: (data) => api.post('/volunteers/apply', data).then((r) => r.data),
  askAssistant: (messages, language) => api.post('/ai/chat', { messages, language }).then((r) => r.data.data),
};

export default publicApi;
