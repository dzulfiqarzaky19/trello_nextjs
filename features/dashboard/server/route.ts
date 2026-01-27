import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { AuditLogWithProfile, ChangeMetadata } from '@/lib/supabase/types';

const app = new Hono().get('/', sessionMiddleware, async (c) => {
  const supabase = await createSupabaseServer();
  const user = c.get('user');

  try {
    const { count: totalWorkspaces } = await supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { data: members } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', user.id);

    const workspaceIds = members?.map((m) => m.workspace_id) || [];

    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('workspace_id', workspaceIds);

    const { data: projectsData } = await supabase
      .from('projects')
      .select('id')
      .in('workspace_id', workspaceIds);

    const projectIds = projectsData?.map((p) => p.id) || [];

    const { count: totalTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .in('project_id', projectIds);

    const { count: assignedTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to', user.id);

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

    const { data: workloadTasks } = await supabase
      .from('tasks')
      .select('assigned_to')
      .not('assigned_to', 'is', null)
      .in('project_id', projectIds);

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
        workloadMap.set(
          task.assigned_to,
          (workloadMap.get(task.assigned_to) || 0) + 1
        );
      }
    });

    const teamWorkload =
      profiles?.map((profile) => ({
        name: profile.full_name || profile.email || 'Unknown',
        image: profile.avatar_url,
        count: workloadMap.get(profile.id) || 0,
        progress: Math.round(
          ((workloadMap.get(profile.id) || 0) / (workloadTasks?.length || 1)) *
            100
        ),
        color: 'bg-blue-500',
      })) || [];

    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*, profiles(full_name, email, avatar_url)')
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentActivity =
      auditLogs?.map((log) => {
        const typedLog = log as AuditLogWithProfile;
        const userProfile = typedLog.profiles;
        const userName =
          userProfile?.full_name || userProfile?.email || 'Unknown User';
        const userImage = userProfile?.avatar_url || '';

        let type = 'status_update';
        let actionText = 'updated';
        let details:
          | { from?: string | number; to?: string | number }
          | undefined = undefined;

        const meta = typedLog.metadata as ChangeMetadata | null;

        switch (log.action) {
          case 'CREATE':
            actionText = 'created';
            type = 'upload';
            break;
          case 'DELETE':
            actionText = 'deleted';
            break;
          case 'UPDATE_STATUS':
            actionText = 'changed status of';
            type = 'status_update';
            if (meta?.from !== undefined && meta?.to !== undefined) {
              details = { from: meta.from, to: meta.to };
            }
            break;
          case 'UPDATE_NAME':
            actionText = 'renamed';
            if (meta?.from !== undefined && meta?.to !== undefined) {
              details = { from: meta.from, to: meta.to };
            }
            break;
          case 'MOVE':
            actionText = 'moved';
            break;
          case 'ASSIGN':
            actionText = 'assigned';
            break;
          default:
            actionText = log.action.toLowerCase().replace('_', ' ');
        }

        let target = `${log.entity_type.toLowerCase()} "${log.entity_title}"`;

        if (meta?.projectName) {
          target += ` in project "${meta.projectName}"`;
        }

        return {
          user: {
            name: userName,
            image: userImage,
          },
          type,
          action: actionText,
          target,
          time: new Date(log.created_at || '').toLocaleDateString(),
          details,
        };
      }) || [];

    return c.json({
      stats: {
        workspaces: totalWorkspaces || 0,
        projects: totalProjects || 0,
        tasks: totalTasks || 0,
        assignedTasks: assignedTasks || 0,
      },
      chartData,
      teamWorkload,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default app;
