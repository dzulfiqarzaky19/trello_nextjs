export const PROJECTS_PAGE_HEADER = {
  label: 'Website Redesign Project',
  description: 'Manage tasks, track progress, and collaborate with your team',
};

export const PROJECTS_PAGE_CONTENT_DUMMY = [
  {
    id: 'todo',
    title: 'TO DO',
    color: 'bg-gray-500',
    cards: [
      {
        id: 'card-1',
        title: 'Draft Wireframes',
        labels: [
          { id: 'label-design', name: 'DESIGN', color: '#3B82F6' },
          { id: 'label-high', name: 'HIGH', color: '#EF4444' },
        ],
        description:
          'Create initial wireframes for the homepage and product listing pages...',
        assignees: [
          {
            id: 'user-1',
            name: 'Alice',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
          },
          {
            id: 'user-2',
            name: 'Bob',
            image: 'https://randomuser.me/api/portraits/men/2.jpg',
          },
        ],
        comments: 2,
        attachments: 4,
        status: 'todo',
        progress: { completed: 0, total: 3, percent: 0 },
        dueDate: '2025-12-18',
        createdAt: '2025-12-01',
        updatedAt: '2025-12-10',
      },
      {
        id: 'card-2',
        title: 'Competitor Analysis',
        labels: [{ id: 'label-research', name: 'RESEARCH', color: '#10B981' }],
        assignees: [
          {
            id: 'user-3',
            name: 'Charlie',
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
          },
        ],
        comments: 1,
        attachments: 0,
        status: 'todo',
        progress: { completed: 0, total: 8, percent: 0 },
        dueDate: '2025-12-20',
        createdAt: '2025-12-05',
        updatedAt: '2025-12-12',
      },
      {
        id: 'card-3',
        title: 'Client Meeting Prep',
        labels: [{ id: 'label-client', name: 'CLIENT', color: '#F59E0B' }],
        description: 'Prepare slide deck for the weekly sync with the client.',
        assignees: [
          {
            id: 'user-4',
            name: 'Diana',
            image: 'https://randomuser.me/api/portraits/women/4.jpg',
          },
        ],
        comments: 0,
        attachments: 1,
        status: 'todo',
        progress: { completed: 1, total: 8, percent: 12 },
        dueDate: '2025-12-15',
        createdAt: '2025-12-07',
        updatedAt: '2025-12-14',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    color: 'bg-blue-500',
    cards: [
      {
        id: 'card-4',
        title: 'Homepage Hero Section',
        labels: [
          { id: 'label-urgent', name: 'URGENT', color: '#DC2626' },
          { id: 'label-dev', name: 'DEV', color: '#6366F1' },
        ],
        description:
          'Implement the responsive hero section with video background component.',
        assignees: [
          {
            id: 'user-5',
            name: 'Eve',
            image: 'https://randomuser.me/api/portraits/women/5.jpg',
          },
          {
            id: 'user-6',
            name: 'Frank',
            image: 'https://randomuser.me/api/portraits/men/6.jpg',
          },
          {
            id: 'user-7',
            name: 'Grace',
            image: 'https://randomuser.me/api/portraits/women/7.jpg',
          },
        ],
        comments: 3,
        attachments: 2,
        status: 'in-progress',
        progress: { completed: 3, total: 5, percent: 60 },
        dueDate: '2025-12-19',
        createdAt: '2025-12-02',
        updatedAt: '2025-12-13',
      },
      {
        id: 'card-5',
        title: 'Dark Mode Implementation',
        labels: [{ id: 'label-dev', name: 'DEV', color: '#6366F1' }],
        assignees: [
          {
            id: 'user-8',
            name: 'Henry',
            image: 'https://randomuser.me/api/portraits/men/8.jpg',
          },
        ],
        comments: 0,
        attachments: 0,
        status: 'in-progress',
        progress: { completed: 0, total: 10, percent: 60 },
        dueDate: '2025-12-24',
        createdAt: '2025-12-04',
        updatedAt: '2025-12-14',
      },
    ],
  },
  {
    id: 'done',
    title: 'DONE',
    color: 'bg-green-500',
    cards: [
      {
        id: 'card-6',
        title: 'Project Kickoff',
        labels: [{ id: 'label-admin', name: 'ADMIN', color: '#6B7280' }],
        description:
          'Initial meeting with stakeholders to define scope and requirements.',
        assignees: [
          {
            id: 'user-9',
            name: 'Max',
            image: 'https://github.com/maxleiter.png',
          },
          {
            id: 'user-10',
            name: 'Shadcn',
            image: 'https://github.com/shadcn.png',
          },
        ],
        comments: 0,
        attachments: 0,
        progress: { completed: 1, total: 1, percent: 100 },
        dueDate: '2025-11-20',
        status: 'done',
        createdAt: '2025-11-20',
        updatedAt: '2025-11-21',
      },
      {
        id: 'card-7',
        title: 'Brand Assets Collection',
        labels: [{ id: 'label-design', name: 'DESIGN', color: '#3B82F6' }],
        assignees: [
          {
            id: 'user-11',
            name: 'Shadcn',
            image: 'https://github.com/shadcn.png',
          },
        ],
        comments: 12,
        attachments: 3,
        progress: { completed: 4, total: 4, percent: 100 },
        dueDate: '2025-11-25',
        status: 'done',
        createdAt: '2025-11-22',
        updatedAt: '2025-11-25',
      },
    ],
  },
];

export type IProjectsPageContentDummy = typeof PROJECTS_PAGE_CONTENT_DUMMY;
export type ProjectCard = (typeof PROJECTS_PAGE_CONTENT_DUMMY)[0]['cards'][0];
