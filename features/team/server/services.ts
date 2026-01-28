import { createSupabaseServer } from '@/lib/supabase/server';

export class TeamService {
  static async getTeamStats(currentUserId: string) {
    const supabase = await createSupabaseServer();

    const { data: myMemberships } = await supabase
      .from('members')
      .select('workspace_id')
      .eq('user_id', currentUserId);

    const workspaceIds = myMemberships?.map((m) => m.workspace_id) || [];

    if (workspaceIds.length === 0) return [];

    const { data: allMembers, error } = await supabase
      .from('members')
      .select(
        `
        user_id,
        role,
        workspace_id,
        profiles:user_id (
            id,
            full_name,
            avatar_url,
            email,
            role
        ),
        workspaces (
            name
        )
      `
      )
      .in('workspace_id', workspaceIds)
      .neq('user_id', currentUserId);

    if (error) throw error;
    if (!allMembers || allMembers.length === 0) return [];

    const memberUserIds = Array.from(new Set(allMembers.map((m) => m.user_id)));

    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .in('workspace_id', workspaceIds);

    const projectIds = projects?.map((p) => p.id) || [];

    const taskCounts = new Map<string, number>();
    const projectParticipation = new Map<string, Set<string>>();

    if (projectIds.length > 0) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select(
          `
          assigned_to, 
          project_id, 
          columns (
            name
          )
        `
        )
        .in('project_id', projectIds)
        .in('assigned_to', memberUserIds);

      tasks?.forEach((t) => {
        if (t.assigned_to) {
          const columnsData = t.columns as { name: string } | null;
          const columnName = columnsData?.name?.toLowerCase();
          const isDone =
            columnName === 'done' ||
            columnName === 'completed' ||
            columnName === 'finished';

          if (!isDone) {
            taskCounts.set(
              t.assigned_to,
              (taskCounts.get(t.assigned_to) || 0) + 1
            );
          }

          if (t.project_id) {
            if (!projectParticipation.has(t.assigned_to)) {
              projectParticipation.set(t.assigned_to, new Set());
            }
            projectParticipation.get(t.assigned_to)?.add(t.project_id);
          }
        }
      });
    }

    const uniqueMembersMap = new Map();

    allMembers.forEach((member) => {
      const profile = member.profiles as {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
        role: string;
      } | null;

      if (!profile) return;

      if (!uniqueMembersMap.has(profile.id)) {
        uniqueMembersMap.set(profile.id, {
          userId: profile.id,
          name: profile.full_name || profile.email || 'Unknown',
          email: profile.email,
          image: profile.avatar_url,
          role: profile.role,
          activeTasks: taskCounts.get(profile.id) || 0,
          projectsCount: Math.max(
            1,
            projectParticipation.get(profile.id)?.size || 0
          ),
        });
      } else {
        const existing = uniqueMembersMap.get(profile.id);
        if (member.role === 'ADMIN') existing.role = 'ADMIN';
      }
    });

    return Array.from(uniqueMembersMap.values());
  }
}
