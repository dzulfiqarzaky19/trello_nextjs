import { CheckCircle, Clock, List, Calendar } from 'lucide-react';

export const DASHBOARD_STATS = [
  {
    label: 'Total Tasks',
    value: '148',
    icon: List,
    trend: '+12%',
    trendUp: true,
    color: 'bg-blue-50 text-blue-600',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Completed',
    value: '86',
    icon: CheckCircle,
    trend: '+8%',
    trendUp: true,
    color: 'bg-green-50 text-green-600',
    iconColor: 'text-green-600',
  },
  {
    label: 'In Progress',
    value: '42',
    icon: Clock,
    trend: '0%',
    trendUp: false,
    color: 'bg-orange-50 text-orange-600',
    iconColor: 'text-orange-600',
  },
  {
    label: 'Upcoming Deadlines',
    value: '12',
    icon: Calendar,
    trend: '! 5',
    trendUp: false,
    isAlert: true,
    color: 'bg-red-50 text-red-600',
    iconColor: 'text-red-600',
  },
];

export type DashboardStatsType = (typeof DASHBOARD_STATS)[number];

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
