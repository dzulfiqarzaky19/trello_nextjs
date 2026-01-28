import { createSupabaseServer } from '@/lib/supabase/server';
import { AuditLogWithProfile, ChangeMetadata } from '@/lib/supabase/types';

export class DashboardService {
  private static async getWorkspaceIds(userId: string): Promise<string[]> {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', userId);
    return data?.map((m) => m.workspace_id) || [];
  }

  private static async getProjectIds(
    workspaceIds: string[]
  ): Promise<string[]> {
    if (workspaceIds.length === 0) return [];
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from('projects')
      .select('id')
      .in('workspace_id', workspaceIds);
    return data?.map((p) => p.id) || [];
  }

  private static isChangeMetadata(meta: unknown): meta is ChangeMetadata {
    return (
      typeof meta === 'object' &&
      meta !== null &&
      !Array.isArray(meta) &&
      ('from' in meta || 'to' in meta || 'projectName' in meta)
    );
  }

  private static formatAuditLog(log: AuditLogWithProfile) {
    const userProfile = log.profiles;
    const userName =
      userProfile?.full_name || userProfile?.email || 'Unknown User';
    const userImage = userProfile?.avatar_url || '';

    let type = 'status_update';
    let actionText = 'updated';
    let details: { from?: string | number; to?: string | number } | undefined =
      undefined;

    const meta = this.isChangeMetadata(log.metadata) ? log.metadata : null;

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
      user: { name: userName, image: userImage },
      type,
      action: actionText,
      target,
      time: new Date(log.created_at || '').toLocaleDateString(),
      details,
      message: undefined,
      files: undefined,
    };
  }

  static async getStats(userId: string) {
    const workspaceIds = await this.getWorkspaceIds(userId);
    const totalWorkspaces = workspaceIds.length;

    if (workspaceIds.length === 0) {
      return { workspaces: 0, projects: 0, tasks: 0, assignedTasks: 0 };
    }

    const supabase = await createSupabaseServer();

    const { count: totalProjects, data: projectsData } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .in('workspace_id', workspaceIds);

    const projectIds = projectsData?.map((p) => p.id) || [];

    const [totalTasksResult, assignedTasksResult] = await Promise.all([
      projectIds.length > 0
        ? supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .in('project_id', projectIds)
        : { count: 0 },
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', userId),
    ]);

    return {
      workspaces: totalWorkspaces,
      projects: totalProjects || 0,
      tasks: totalTasksResult.count || 0,
      assignedTasks: assignedTasksResult.count || 0,
    };
  }

  static async getTaskDistribution(userId: string) {
    const workspaceIds = await this.getWorkspaceIds(userId);
    if (workspaceIds.length === 0) return [];

    const supabase = await createSupabaseServer();
    const { data: projects } = await supabase
      .from('projects')
      .select('status')
      .in('workspace_id', workspaceIds);

    const counts = {
      Active: 0,
      Completed: 0,
      Archived: 0,
    };

    projects?.forEach((p) => {
      if (p.status === 'ACTIVE') counts.Active++;
      else if (p.status === 'COMPLETED') counts.Completed++;
      else if (p.status === 'ARCHIVED') counts.Archived++;
    });

    return [
      { name: 'Active', value: counts.Active, fill: '#8884d8' },
      { name: 'Completed', value: counts.Completed, fill: '#00C49F' },
      { name: 'Archived', value: counts.Archived, fill: '#FFBB28' },
    ];
  }

  static async getTeamWorkload(userId: string) {
    const workspaceIds = await this.getWorkspaceIds(userId);
    const projectIds = await this.getProjectIds(workspaceIds);
    if (projectIds.length === 0) return [];

    const supabase = await createSupabaseServer();
    const { data: tasks } = await supabase
      .from('tasks')
      .select('assigned_to')
      .not('assigned_to', 'is', null)
      .in('project_id', projectIds);

    if (!tasks || tasks.length === 0) return [];

    const workloadMap = new Map<string, number>();
    tasks.forEach((t) => {
      if (t.assigned_to) {
        workloadMap.set(
          t.assigned_to,
          (workloadMap.get(t.assigned_to) || 0) + 1
        );
      }
    });

    const assigneeIds = Array.from(workloadMap.keys());
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email')
      .in('id', assigneeIds);

    return (
      profiles?.map((profile) => ({
        name: profile.full_name || profile.email || 'Unknown',
        image: profile.avatar_url,
        count: workloadMap.get(profile.id) || 0,
        progress: Math.round(
          ((workloadMap.get(profile.id) || 0) / tasks.length) * 100
        ),
        color: 'bg-blue-500',
      })) || []
    );
  }

  static async getRecentActivity(userId: string) {
    const workspaceIds = await this.getWorkspaceIds(userId);
    if (workspaceIds.length === 0) return [];

    const supabase = await createSupabaseServer();
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*, profiles(full_name, email, avatar_url)')
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false })
      .limit(10);

    return auditLogs?.map((log) => this.formatAuditLog(log)) || [];
  }
}
