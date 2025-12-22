export const TEAM_PAGE_HEADER = {
  label: 'Team Members',
  description: 'Manage permissions, roles, and view team availability.',
};

export const TEAM_MEMBERS = [
  {
    name: 'Sarah Jenkins',
    role: 'Product Manager',
    tags: [
      { label: 'STRATEGY', className: 'bg-purple-100 text-purple-600' },
      { label: 'LEAD', className: 'bg-blue-100 text-blue-600' },
    ],
    stats: {
      activeTasks: 12,
      projects: 4,
    },
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    isOnline: true,
  },
  {
    name: 'Michael Chen',
    role: 'Senior Developer',
    tags: [
      { label: 'FRONTEND', className: 'bg-blue-100 text-blue-600' },
      { label: 'REACT', className: 'bg-gray-100 text-gray-600' },
    ],
    stats: {
      activeTasks: 8,
      projects: 2,
    },
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    isOnline: true,
  },
  {
    name: 'Elena Rodriguez',
    role: 'UX Designer',
    tags: [
      { label: 'DESIGN', className: 'bg-pink-100 text-pink-600' },
      { label: 'FIGMA', className: 'bg-purple-100 text-purple-600' },
    ],
    stats: {
      activeTasks: 5,
      projects: 3,
    },
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    isOnline: false,
  },
  {
    name: 'David Kim',
    role: 'Backend Engineer',
    tags: [
      { label: 'API', className: 'bg-red-100 text-red-600' },
      { label: 'CLOUD', className: 'bg-orange-100 text-orange-600' },
    ],
    stats: {
      activeTasks: 15,
      projects: 2,
    },
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    isOnline: true,
  },
  {
    name: 'Jessica Wong',
    role: 'Marketing Lead',
    tags: [
      { label: 'GROWTH', className: 'bg-green-100 text-green-600' },
      { label: 'SEO', className: 'bg-teal-100 text-teal-600' },
    ],
    stats: {
      activeTasks: 6,
      projects: 5,
    },
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isOnline: false,
  },
  {
    name: 'Alex Johnson',
    role: 'QA Engineer',
    tags: [
      { label: 'TESTING', className: 'bg-yellow-100 text-yellow-600' },
      { label: 'AUTO', className: 'bg-gray-100 text-gray-600' },
    ],
    stats: {
      activeTasks: 22,
      projects: 1,
    },
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    isOnline: true,
  },
  {
    name: 'Sam Wilson',
    role: 'Product Designer',
    tags: [{ label: 'UI/UX', className: 'bg-pink-100 text-pink-600' }],
    stats: {
      activeTasks: 3,
      projects: 2,
    },
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    isOnline: false,
  },
];
