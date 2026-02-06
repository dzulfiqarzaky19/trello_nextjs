import { createSupabaseServer } from '@/lib/supabase/server';
import { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { getErrorMessage } from '@/lib/supabase/types';
import { z } from 'zod';
import { createColumnSchema, updateColumnSchema } from '../schema';
import { MemberGuard } from '@/features/members/server/guard';
import { logActivity } from '@/lib/audit-logs';
import { ProjectService } from '@/features/projects/server/services';

import { ServiceResult } from '@/lib/service-result';

type ColumnWithTasks = Tables<'columns'> & { tasks: Tables<'tasks'>[] };

export class ColumnService {
  static async getColumn(columnId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('columns')
      .select('*, projects(workspace_id, name)')
      .eq('id', columnId)
      .single();

    if (error) return null;
    return data;
  }

  private static async validateColumnAccess(
    columnId: string,
    userId: string
  ): Promise<
    ServiceResult<
      NonNullable<Awaited<ReturnType<typeof ColumnService.getColumn>>>
    >
  > {
    const column = await this.getColumn(columnId);
    if (!column) return { ok: false, error: 'Column not found', status: 404 };

    const workspaceId = column.projects?.workspace_id;

    if (!workspaceId) {
      return { ok: false, error: 'Project data missing', status: 404 };
    }

    const member = await MemberGuard.validateMember(workspaceId, userId);
    if (!member) return { ok: false, error: 'Unauthorized', status: 401 };

    return { ok: true, data: column };
  }

  static async listColumns(projectId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('columns')
      .select(
        '*, tasks(*, comments:task_comments(count))'
      )
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createColumn(input: {
    name: string;
    project_id: string;
    position: number;
    created_by: string;
    updated_by: string;
  }) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('columns')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateColumn(
    columnId: string,
    updates: TablesUpdate<'columns'>
  ) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('columns')
      .update(updates)
      .eq('id', columnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteColumn(columnId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('columns')
      .delete()
      .eq('id', columnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateColumnPosition(
    projectId: string,
    oldPosition: number,
    newPosition: number
  ) {
    const supabase = await createSupabaseServer();

    if (newPosition > oldPosition) {
      const { error: rpcError } = await supabase.rpc(
        'decrement_column_positions',
        {
          p_project_id: projectId,
          p_start_pos: oldPosition + 1,
          p_end_pos: newPosition,
        }
      );
      if (rpcError) throw rpcError;
    } else {
      const { error: rpcError } = await supabase.rpc(
        'increment_column_positions',
        {
          p_project_id: projectId,
          p_start_pos: newPosition,
          p_end_pos: oldPosition - 1,
        }
      );
      if (rpcError) throw rpcError;
    }
  }

  static async getNextPosition(projectId: string): Promise<number> {
    const supabase = await createSupabaseServer();
    const { data: maxPosData } = await supabase
      .from('columns')
      .select('position')
      .eq('project_id', projectId)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    return (maxPosData?.position ?? 0) + 1;
  }

  static async list(
    userId: string,
    projectId: string
  ): Promise<ServiceResult<ColumnWithTasks[]>> {
    try {
      const project = await ProjectService.getProject(projectId);
      if (!project)
        return { ok: false, error: 'Project not found', status: 404 };

      const member = await MemberGuard.validateMember(
        project.workspace_id,
        userId
      );
      if (!member) return { ok: false, error: 'Unauthorized', status: 401 };

      const data = await this.listColumns(projectId);

      // Collect all user IDs from tasks to fetch profiles manually
      // because there is no foreign key relationship in the database schema
      const userIds = new Set<string>();
      data?.forEach((col) => {
        col.tasks.forEach((task) => {
          if (task.assigned_to) {
            userIds.add(task.assigned_to);
          }
        });
      });

      const supabase = await createSupabaseServer();
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const columnsWithSortedTasks: ColumnWithTasks[] =
        data?.map((column) => {
          const tasks = Array.isArray(column.tasks) ? column.tasks : [];

          const tasksWithProfiles = tasks.map((task) => ({
            ...task,
            assigned_to_user: task.assigned_to
              ? profileMap.get(task.assigned_to)
              : null,
          }));

          return {
            ...column,
            tasks: tasksWithProfiles.sort((a, b) => a.position - b.position),
          } as ColumnWithTasks;
        }) || [];

      return { ok: true, data: columnsWithSortedTasks };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async getById(
    userId: string,
    columnId: string
  ): Promise<ServiceResult<Tables<'columns'>>> {
    try {
      const result = await this.validateColumnAccess(columnId, userId);

      if (!result.ok) return result;

      return { ok: true, data: result.data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async create(
    userId: string,
    input: z.infer<typeof createColumnSchema>
  ): Promise<ServiceResult<Tables<'columns'>>> {
    try {
      const project = await ProjectService.getProject(input.projectId);

      if (!project) {
        return { ok: false, error: 'Project not found', status: 404 };
      }

      const member = await MemberGuard.validateMember(
        project.workspace_id,
        userId
      );
      if (!member) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      const newPosition = await this.getNextPosition(input.projectId);

      const data = await this.createColumn({
        name: input.title,
        project_id: input.projectId,
        position: newPosition,
        created_by: userId,
        updated_by: userId,
      });

      await logActivity({
        action: 'CREATE',
        entityType: 'COLUMN',
        entityId: data.id,
        entityTitle: data.name,
        workspaceId: project.workspace_id,
        userId: userId,
        metadata: { projectName: project.name },
      });

      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async update(
    userId: string,
    columnId: string,
    input: z.infer<typeof updateColumnSchema>
  ): Promise<ServiceResult<Tables<'columns'>>> {
    try {
      const result = await this.validateColumnAccess(columnId, userId);
      if (!result.ok) return result;

      const currentColumn = result.data;
      const workspaceId = currentColumn.projects!.workspace_id;
      const projectName = currentColumn.projects!.name;
      const isPositionChanged =
        input.position !== undefined &&
        input.position !== currentColumn.position;
      const isTitleChanged = input.title && input.title !== currentColumn.name;

      const updates: TablesUpdate<'columns'> = {
        updated_at: new Date().toISOString(),
        updated_by: userId,
        ...(input.title && { name: input.title }),
        ...(isPositionChanged && { position: input.position }),
      };

      if (isPositionChanged) {
        await this.updateColumnPosition(
          currentColumn.project_id,
          currentColumn.position,
          input.position || 0
        );
      }

      const data = await this.updateColumn(columnId, updates);

      if (isPositionChanged) {
        await logActivity({
          action: 'MOVE',
          entityType: 'COLUMN',
          entityId: columnId,
          entityTitle: currentColumn.name,
          workspaceId: workspaceId,
          userId: userId,
          metadata: {
            from: currentColumn.position,
            to: input.position,
            projectName,
          },
        });

        return { ok: true, data };
      }

      if (isTitleChanged) {
        await logActivity({
          action: 'UPDATE_NAME',
          entityType: 'COLUMN',
          entityId: columnId,
          entityTitle: input.title || '',
          workspaceId: workspaceId,
          userId: userId,
          metadata: { from: currentColumn.name, to: input.title, projectName },
        });

        return { ok: true, data };
      }

      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async delete(
    userId: string,
    columnId: string
  ): Promise<ServiceResult<Tables<'columns'>>> {
    try {
      const result = await this.validateColumnAccess(columnId, userId);
      if (!result.ok) return result;

      const column = result.data;
      const workspaceId = column.projects!.workspace_id;
      const projectName = column.projects!.name;

      const data = await this.deleteColumn(columnId);

      await logActivity({
        action: 'DELETE',
        entityType: 'COLUMN',
        entityId: columnId,
        entityTitle: column.name,
        workspaceId: workspaceId,
        userId: userId,
        metadata: { projectName },
      });

      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
