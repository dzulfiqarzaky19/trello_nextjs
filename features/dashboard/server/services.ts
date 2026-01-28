import { createSupabaseServer } from '@/lib/supabase/server';
import { AuditLogWithProfile, ChangeMetadata } from '@/lib/supabase/types';

export class DashboardService {
  static async getStats(userId: string) {
    const supabase = await createSupabaseServer();

    // 1. Get User's Workspaces
    // We reuse the logic: user is a member of the workspace.
    const { data: memberWorkspaces } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', userId);

    const workspaceIds = memberWorkspaces?.map((m) => m.workspace_id) || [];
    const totalWorkspaces = workspaceIds.length; // or perform specific count query if needed, but this is fine for now

    if (workspaceIds.length === 0) {
      return {
        workspaces: 0,
        projects: 0,
        tasks: 0,
        assignedTasks: 0,
      };
    }

    // 2. Get User's Projects (in those workspaces)
    const { count: totalProjects, data: projectsData } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .in('workspace_id', workspaceIds);

    const projectIds = projectsData?.map((p) => p.id) || [];

    // 3. Get Total Tasks (in those projects)
    let totalTasks = 0;
    if (projectIds.length > 0) {
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds);
      totalTasks = count || 0;
    }

    // 4. Get Tasks Assigned to User
    const { count: assignedTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to', userId);

    return {
      workspaces: totalWorkspaces,
      projects: totalProjects || 0,
      tasks: totalTasks,
      assignedTasks: assignedTasks || 0,
    };
  }

  static async getTaskDistribution(userId: string) {
    const supabase = await createSupabaseServer();

    // Get User's Workspaces
    const { data: memberWorkspaces } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', userId);

    const workspaceIds = memberWorkspaces?.map((m) => m.workspace_id) || [];

    if (workspaceIds.length === 0) {
      return [];
    }

    // Get Projects Status
    // Currently "Task Distribution" chart in route.ts was actually showing PROJECT status distribution?
    // "active: projects?.filter((p) => p.status === 'ACTIVE').length"
    // Yes, the previous implementation visualized PROJECT status, but labeled it "Task Distribution" in UI sometimes?
    // Wait, the UI said "Task Distribution" but the code was `projects?.filter...`.
    // The previous code in `DashboardMain` showed "Active", "Completed", "Archived".
    // And `TaskDistributionChart` (now) calculates based on `data` provided.
    // The previous `route.ts` returned `chartData` based on PROJECT status.
    // "active: projects?.filter((p) => p.status === 'ACTIVE').length"
    // I should probably stick to what it was (Project Status) OR change it to Task status if the name implies "Task".
    // The user asked for "task-distribution".
    // Let's look at `route.ts` again.
    // `const { data: projects } = await supabase.from('projects').select('status')...`
    // `distribution = { active: projects... }`
    // So it WAS measuring Projects.
    // However, the component is called `TaskDistributionChart`.
    // And the User Request in Step 1737 showed "name": "Active", "value": 3.
    // I will stick to the existing logic (Projects) to avoid breaking changes, but maybe rename it to 'project-distribution' internally or just keep it compatible.
    // ACTUALLY, if the chart says "Total Tasks" (which I added in Step 1756), then it expects TASKS.
    // The user might be confused or I might be.
    // Let's check `route.ts` lines 50-60.
    // It filters `projects`.
    // If I want "Task Distribution", I should probably query tasks.
    // But since the USER provided data sample had "Active", "Completed", "Archived", and previously it was Project status...
    // I will stick to the previous implementation logic (Project Status) for now to produce the same numbers,
    // UNLESS I explicitly change it to Tasks.
    // "Task Distribution" usually means "Todo", "In Progress", "Done".
    // Project statuses are "ACTIVE", "COMPLETED", "ARCHIVED".
    // Okay, I will implement it as PROJECT distribution because that's what the backend code `route.ts` was doing.
    // But I will fix the name if needed. Or maybe I should switch to TASKS distribution?
    // `tasks` table doesn't have a simple 'status' field like Active/Completed. It handles Columns.
    // So it's hard to categorize tasks without knowing column meanings.
    // So it MUST be Project distribution.

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

    return chartData;
  }

  static async getTeamWorkload(userId: string) {
    const supabase = await createSupabaseServer();

    // Get User's Workspaces
    const { data: memberWorkspaces } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', userId);
    const workspaceIds = memberWorkspaces?.map((m) => m.workspace_id) || [];

    // Get Projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id')
      .in('workspace_id', workspaceIds);

    const projectIds = projectsData?.map((p) => p.id) || [];

    if (projectIds.length === 0) return [];

    const { data: workloadTasks } = await supabase
      .from('tasks')
      .select('assigned_to')
      .not('assigned_to', 'is', null)
      .in('project_id', projectIds);

    const assigneeIds = [
      ...new Set(workloadTasks?.map((t) => t.assigned_to).filter(Boolean)),
    ] as string[];

    if (assigneeIds.length === 0) return [];

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

    return (
      profiles?.map((profile) => ({
        name: profile.full_name || profile.email || 'Unknown',
        image: profile.avatar_url,
        count: workloadMap.get(profile.id) || 0,
        progress: Math.round(
          ((workloadMap.get(profile.id) || 0) / (workloadTasks?.length || 1)) *
            100
        ),
        color: 'bg-blue-500',
      })) || []
    );
  }

  static async getRecentActivity(userId: string) {
    const supabase = await createSupabaseServer();

    // Get User's Workspaces
    const { data: memberWorkspaces } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', userId);
    const workspaceIds = memberWorkspaces?.map((m) => m.workspace_id) || [];

    if (workspaceIds.length === 0) return [];

    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*, profiles(full_name, email, avatar_url)')
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false })
      .limit(10);

    return (
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
          message: undefined as string | undefined,
          files: undefined as string[] | undefined,
        };
      }) || []
    );
  }
}
