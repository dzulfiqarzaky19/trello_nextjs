export const CALENDAR_PAGE_HEADER = {
  label: 'Project Calendar',
  description: 'Track deadlines, milestones, and team availability.',
};

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CALENDAR_EVENTS = [
  {
    id: 1,
    date: 1,
    title: 'Kickoff Meeting',
    time: '10:00 AM - Client A',
    color: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
  },
  {
    id: 2,
    date: 3,
    title: 'Research Phase',
    time: 'All Day',
    color: 'bg-purple-100 text-purple-700 border-l-4 border-purple-500',
  },
  {
    id: 3,
    date: 7,
    title: 'Review Wireframes',
    time: '2:00 PM - Design Team',
    color: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
  },
  {
    id: 4,
    date: 7,
    title: 'Client Feedback',
    time: '4:30 PM',
    color: 'bg-green-100 text-green-700 border-l-4 border-green-500',
  },
  {
    id: 5,
    date: 10,
    title: 'Hero Section Design',
    time: '5:00 PM - Urgent',
    color: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  },
  {
    id: 6,
    date: 15, // Today
    title: 'Dark Mode Impl.',
    time: 'In Progress',
    color: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
  },
  {
    id: 7,
    date: 15, // Today
    title: 'Weekly Sync',
    time: '3:00 PM',
    color: 'bg-gray-100 text-gray-700 border-l-4 border-gray-500',
  },
  {
    id: 8,
    date: 23,
    title: 'User Testing',
    time: 'Group A',
    color: 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500',
  },
  {
    id: 9,
    date: 24,
    title: 'Flag Deadline',
    time: 'Sprint End',
    color: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
  },
  {
    id: 10,
    date: 28,
    title: 'QA Regression',
    time: 'Start',
    color: 'bg-purple-100 text-purple-700 border-l-4 border-purple-500',
  },
  {
    id: 11,
    date: 30,
    title: 'Launch Prep',
    time: 'Marketing',
    color: 'bg-green-100 text-green-700 border-l-4 border-green-500',
  },
];

// Generating grid for November 2023
// Starts on Wednesday (Nov 1st)
// Previous month (Oct) ends on 31st.
// 29, 30, 31 exist in previous month row.
export const CALENDAR_DAYS = [
  // Previous month (Oct)
  { day: 29, isCurrentMonth: false },
  { day: 30, isCurrentMonth: false },
  { day: 31, isCurrentMonth: false },
  // Current month (Nov)
  ...Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    isToday: i + 1 === 15,
  })),
  // Next month (Dec)
  { day: 1, isCurrentMonth: false },
  { day: 2, isCurrentMonth: false },
];
