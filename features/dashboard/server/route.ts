import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono().get('/', sessionMiddleware, async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');

    // 1. Fetch Aggregated Stats
    try {
        const { count: totalWorkspaces } = await supabase
            .from('workspaces')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Fetch workspace IDs the user is a member of
        const { data: members } = await supabase
            .from('members')
            .select('workspace_id')
            .eq('user_id', user.id);

        const workspaceIds = members?.map(m => m.workspace_id) || [];

        const { count: totalProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .in('workspace_id', workspaceIds);

        // Fetch project IDs for these workspaces to filter tasks
        const { data: projectsData } = await supabase
            .from('projects')
            .select('id')
            .in('workspace_id', workspaceIds);

        const projectIds = projectsData?.map(p => p.id) || [];

        const { count: totalTasks } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .in('project_id', projectIds);

        const { count: assignedTasks } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', user.id);

        // 2. Task Distribution (by Project Status for now)
        const { data: projects } = await supabase
            .from('projects')
            .select('status')
            .in('workspace_id', workspaceIds);

        const distribution = {
            active: projects?.filter((p) => p.status === 'ACTIVE').length || 0,
            completed: projects?.filter((p) => p.status === 'COMPLETED').length || 0,
            archived: projects?.filter((p) => p.status === 'ARCHIVED').length || 0,
        };

        const chartData = [
            { name: 'Active', value: distribution.active, fill: '#8884d8' },
            { name: 'Completed', value: distribution.completed, fill: '#00C49F' },
            { name: 'Archived', value: distribution.archived, fill: '#FFBB28' },
        ];

        // 3. Team Workload (Tasks per assignee)
        // Fetch tasks with assignee info
        const { data: workloadTasks } = await supabase
            .from('tasks')
            .select('assigned_to')
            .not('assigned_to', 'is', null)
            .in('project_id', projectIds);

        // Group by assignee and get counts (this ideally needs a join with profiles, 
        // but for now we aggregate by ID. We might need profiles to show names).
        // Let's fetch profiles for the unique assigned_to IDs.
        const assigneeIds = [
            ...new Set(workloadTasks?.map((t) => t.assigned_to).filter(Boolean)),
        ] as string[];

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, email')
            .in('id', assigneeIds);

        const workloadMap = new Map();
        workloadTasks?.forEach((task) => {
            if (task.assigned_to) {
                workloadMap.set(task.assigned_to, (workloadMap.get(task.assigned_to) || 0) + 1);
            }
        });

        const teamWorkload = profiles?.map((profile) => ({
            name: profile.full_name || profile.email || 'Unknown',
            image: profile.avatar_url,
            count: workloadMap.get(profile.id) || 0,
            // Calculate percentage relative to total assigned tasks
            progress: Math.round(((workloadMap.get(profile.id) || 0) / (workloadTasks?.length || 1)) * 100),
            color: 'bg-blue-500', // Default color
        })) || [];

        // 4. Recent Activity
        // Fetch latest 5 tasks
        const { data: recentTasks } = await supabase
            .from('tasks')
            .select('title, created_at, project_id')
            .order('created_at', { ascending: false })
            .limit(5)
            .in('project_id', projectIds);

        // We'll simulate the "Activity" format from the dashboard constant
        const recentActivity = recentTasks?.map(task => ({
            user: {
                name: 'System', // Or fetch creator if we tracked it
                image: ''
            },
            type: 'status_update', // Generic type
            action: 'created task',
            target: task.title,
            time: new Date(task.created_at || '').toLocaleDateString(),
        })) || [];


        return c.json({
            stats: {
                workspaces: totalWorkspaces || 0,
                projects: totalProjects || 0,
                tasks: totalTasks || 0,
                assignedTasks: assignedTasks || 0,
            },
            chartData,
            teamWorkload,
            recentActivity
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

export default app;
