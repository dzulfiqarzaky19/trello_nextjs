

export const CHART_DATA = [
  { name: 'Design', value: 35, fill: '#3B82F6' },
  { name: 'Done', value: 20, fill: '#22C55E' },
  { name: 'Backlog', value: 30, fill: '#EF4444' },
  { name: 'Review', value: 15, fill: '#EAB308' },
];

export const TEAM_WORKLOAD = [
  {
    name: 'Alex',
    image: 'https://github.com/shadcn.png',
    progress: 85,
    color: 'bg-blue-500',
  },
  {
    name: 'Maria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    progress: 60,
    color: 'bg-purple-500',
  },
  {
    name: 'David',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    progress: 45,
    color: 'bg-orange-500',
  },
  {
    name: 'Sarah',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    progress: 92,
    color: 'bg-green-500',
  },
  {
    name: 'James',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    progress: 30,
    color: 'bg-red-500',
  },
];

export const RECENT_ACTIVITY = [
  {
    user: {
      name: 'Alex Morgan',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    action: 'updated the status of',
    target: 'Homepage Redesign',
    time: '2m ago',
    details: { from: 'In Progress', to: 'Done' },
    type: 'status_update',
  },
  {
    user: {
      name: 'Maria Garcia',
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    action: 'commented on',
    target: 'User Research Phase 1',
    time: '1h ago',
    message:
      '"Great insights here, especially regarding the mobile user flow."',
    type: 'comment',
  },
  {
    user: {
      name: 'Sarah Jenkins',
      image: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    action: 'uploaded 3 new files to',
    target: 'Brand Guidelines',
    time: '3h ago',
    files: ['logo-v2.svg', 'font-guide.pdf'],
    type: 'upload',
  },
];
