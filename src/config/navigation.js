export const workAreas = [
  { slug: 'women-rights', title: 'Women Rights' },
  { slug: 'child-rights', title: 'Child Rights' },
  { slug: 'minority-rights', title: 'Minority Rights' },
  { slug: 'disability-rights', title: 'Disability Rights' },
  { slug: 'education-rights', title: 'Education Rights' },
  { slug: 'freedom-of-expression', title: 'Freedom of Expression' },
  { slug: 'prisoners-rights', title: "Prisoners' Rights" },
  { slug: 'labour-rights', title: 'Labour Rights' },
  { slug: 'refugee-rights', title: 'Refugee Rights' },
  { slug: 'digital-rights', title: 'Digital Rights' },
  { slug: 'environmental-rights', title: 'Environmental Rights' },
  { slug: 'youth-rights', title: 'Youth Rights' },
  { slug: 'protection-from-violence', title: 'Protection from Violence' },
  { slug: 'access-to-justice', title: 'Access to Justice' },
];

export const newsCategories = [
  { slug: 'News', title: 'News' },
  { slug: 'Press Release', title: 'Press Releases' },
  { slug: 'Statement', title: 'Statements' },
  { slug: 'Media Coverage', title: 'Media Coverage' },
  { slug: 'Success Story', title: 'Success Stories' },
];

export const publicationCategories = [
  'Annual Report',
  'Human Rights Report',
  'Research Paper',
  'Policy Brief',
  'Awareness Material',
  'Event Report',
  'Training Material',
];

export const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'About',
    children: [
      { label: 'Who We Are', path: '/about/who-we-are' },
      { label: 'Mission & Vision', path: '/about/mission-vision' },
      { label: 'Objectives', path: '/about/objectives' },
      { label: 'Core Values', path: '/about/core-values' },
      { label: 'History', path: '/about/history' },
      { label: 'Organizational Structure', path: '/about/organizational-structure' },
    ],
  },
  {
    label: 'Our Work',
    children: workAreas.map((a) => ({ label: a.title, path: `/our-work/${a.slug}` })),
    wide: true,
  },
  { label: 'Leadership & Team', path: '/leadership' },
  { label: 'Campaigns', path: '/campaigns' },
  { label: 'Events', path: '/events' },
  {
    label: 'News & Media',
    children: newsCategories.map((c) => ({ label: c.title, path: `/news?category=${encodeURIComponent(c.slug)}` })),
  },
  {
    label: 'Publications',
    children: publicationCategories.map((c) => ({ label: c, path: `/publications?category=${encodeURIComponent(c)}` })),
    wide: true,
  },
  {
    label: 'Get Involved',
    children: [
      { label: 'Membership', path: '/get-involved/membership' },
      { label: 'Volunteer', path: '/get-involved/volunteer' },
      { label: 'Training', path: '/get-involved/training' },
      { label: 'Partnerships', path: '/get-involved/partnerships' },
    ],
  },
  { label: 'Awards & Recognition', path: '/awards' },
  {
    label: 'Gallery',
    children: [
      { label: 'Photos', path: '/gallery/photos' },
      { label: 'Videos', path: '/gallery/videos' },
      { label: 'Events', path: '/gallery/events' },
    ],
  },
  { label: 'Impact', path: '/impact' },
  { label: 'Contact', path: '/contact' },
];
