/** Frontend mirror of backend enums/constants. */

export const ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'COMPLAINT_OFFICER', 'EVENT_MANAGER', 'CONTENT_MANAGER'];

export const COMPLAINT_STATUSES = ['Submitted', 'Under Review', 'Assigned', 'Under Investigation', 'Action Taken', 'Resolved', 'Closed'];

export const COMPLAINT_CATEGORIES = [
  'Violence',
  'Discrimination',
  'Child Rights',
  'Women Rights',
  'Minority Rights',
  'Labour Rights',
  'Disability Rights',
  'Digital Rights',
  'Freedom of Expression',
  'Other',
];

export const COMPLAINT_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

export const CAMPAIGN_STATUSES = ['Upcoming', 'Active', 'Completed'];

export const MEMBER_TYPES = [
  'General Member',
  'Student Member',
  'Volunteer',
  'Human Rights Defender',
  'Professional Member',
  'Institutional Partner',
];

export const MEMBER_STATUSES = ['Pending', 'Approved', 'Rejected'];

export const NEWS_CATEGORIES = ['News', 'Press Release', 'Statement', 'Media Coverage', 'Success Story'];

export const PUBLICATION_CATEGORIES = [
  'Annual Report',
  'Human Rights Report',
  'Research Paper',
  'Policy Brief',
  'Awareness Material',
  'Event Report',
  'Training Material',
];

export const TEAM_CATEGORIES = ['Leadership', 'Executive Member', 'Department', 'Volunteer/Coordinator'];

export const PARTNER_TYPES = ['NGO', 'University', 'Institution', 'Government', 'Media', 'International'];

export const VOLUNTEER_STATUSES = ['Pending', 'Approved', 'Rejected'];
