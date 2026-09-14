import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

/* Public pages */
import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import WorkAreaPage from './pages/public/WorkAreaPage.jsx';
import LeadershipPage from './pages/public/LeadershipPage.jsx';
import CampaignsPage from './pages/public/CampaignsPage.jsx';
import CampaignDetailPage from './pages/public/CampaignDetailPage.jsx';
import EventsPage from './pages/public/EventsPage.jsx';
import EventDetailPage from './pages/public/EventDetailPage.jsx';
import NewsPage from './pages/public/NewsPage.jsx';
import NewsDetailPage from './pages/public/NewsDetailPage.jsx';
import PublicationsPage from './pages/public/PublicationsPage.jsx';
import PublicationDetailPage from './pages/public/PublicationDetailPage.jsx';
import MembershipPage from './pages/public/MembershipPage.jsx';
import VolunteerPage from './pages/public/VolunteerPage.jsx';
import TrainingPage from './pages/public/TrainingPage.jsx';
import PartnershipsPage from './pages/public/PartnershipsPage.jsx';
import AwardsPage from './pages/public/AwardsPage.jsx';
import GalleryPage from './pages/public/GalleryPage.jsx';
import ImpactPage from './pages/public/ImpactPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import ReportConcernPage from './pages/public/ReportConcernPage.jsx';
import TrackComplaintPage from './pages/public/TrackComplaintPage.jsx';
import SearchPage from './pages/public/SearchPage.jsx';
import LegalPage from './pages/public/LegalPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

/* Admin pages */
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import UsersPage from './pages/admin/UsersPage.jsx';
import AdminTeamPage from './pages/admin/AdminTeamPage.jsx';
import MembersAdminPage from './pages/admin/MembersAdminPage.jsx';
import VolunteersAdminPage from './pages/admin/VolunteersAdminPage.jsx';
import ComplaintsAdminPage from './pages/admin/ComplaintsAdminPage.jsx';
import ComplaintDetailPage from './pages/admin/ComplaintDetailPage.jsx';
import EventsAdminPage from './pages/admin/EventsAdminPage.jsx';
import CampaignsAdminPage from './pages/admin/CampaignsAdminPage.jsx';
import NewsAdminPage from './pages/admin/NewsAdminPage.jsx';
import PublicationsAdminPage from './pages/admin/PublicationsAdminPage.jsx';
import GalleryAdminPage from './pages/admin/GalleryAdminPage.jsx';
import PartnersAdminPage from './pages/admin/PartnersAdminPage.jsx';
import AwardsAdminPage from './pages/admin/AwardsAdminPage.jsx';
import TrainingsAdminPage from './pages/admin/TrainingsAdminPage.jsx';
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage.jsx';
import ContactAdminPage from './pages/admin/ContactAdminPage.jsx';
import NewsletterAdminPage from './pages/admin/NewsletterAdminPage.jsx';
import SettingsAdminPage from './pages/admin/SettingsAdminPage.jsx';
import AuditLogsPage from './pages/admin/AuditLogsPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/:section" element={<AboutPage />} />
        <Route path="/our-work/:slug" element={<WorkAreaPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:slug" element={<CampaignDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/publications/:slug" element={<PublicationDetailPage />} />
        <Route path="/get-involved/membership" element={<MembershipPage />} />
        <Route path="/get-involved/volunteer" element={<VolunteerPage />} />
        <Route path="/get-involved/training" element={<TrainingPage />} />
        <Route path="/get-involved/partnerships" element={<PartnershipsPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/gallery/:type" element={<GalleryPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/report-a-concern" element={<ReportConcernPage />} />
        <Route path="/track-complaint" element={<TrackComplaintPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/terms-of-use" element={<LegalPage type="terms" />} />
        <Route path="/data-protection" element={<LegalPage type="data" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="members" element={<MembersAdminPage />} />
        <Route path="volunteers" element={<VolunteersAdminPage />} />
        <Route path="complaints" element={<ComplaintsAdminPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="events" element={<EventsAdminPage />} />
        <Route path="campaigns" element={<CampaignsAdminPage />} />
        <Route path="news" element={<NewsAdminPage />} />
        <Route path="publications" element={<PublicationsAdminPage />} />
        <Route path="gallery" element={<GalleryAdminPage />} />
        <Route path="partners" element={<PartnersAdminPage />} />
        <Route path="awards" element={<AwardsAdminPage />} />
        <Route path="trainings" element={<TrainingsAdminPage />} />
        <Route path="testimonials" element={<TestimonialsAdminPage />} />
        <Route path="contact" element={<ContactAdminPage />} />
        <Route path="newsletter" element={<NewsletterAdminPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>
    </Routes>
  );
}
