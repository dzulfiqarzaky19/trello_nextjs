import { createSupabaseServer } from '@/lib/supabase/server';
import { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { getErrorMessage } from '@/lib/supabase/types';
import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from '../schema';
import { MemberGuard } from '@/features/members/server/guard';
import { logActivity } from '@/lib/audit-logs';
import { hasProjectData } from '@/lib/supabase/types';
import { ProjectService } from '@/features/projects/server/services';

import { ServiceResult } from '@/lib/service-result';

export class TaskService {
  static async getTask(taskId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('tasks')
      .select('*, projects(workspace_id, name)')
      .eq('id', taskId)
      .single();

    if (error) return null;
    return data;
  }

  static async createTask(
    input: z.infer<typeof createTaskSchema>,
    userId: string
  ) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: input.title,
        description: input.description,
        project_id: input.projectId,
        column_id: input.columnId,
        position: input.position,
        assigned_to: input.assignedTo,
        deadlines: input.deadlines,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTask(taskId: string, updates: TablesUpdate<'tasks'>) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTask(taskId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTaskPosition(
    oldColumnId: string,
    oldPosition: number,
    newColumnId: string,
    newPosition: number
  ) {
    const supabase = await createSupabaseServer();

    if (oldColumnId === newColumnId) {
      if (oldPosition !== newPosition) {
        if (newPosition > oldPosition) {
          const { error: rpcError } = await supabase.rpc(
            'decrement_task_positions',
            {
              p_column_id: oldColumnId,
              p_start_pos: oldPosition + 1,
              p_end_pos: newPosition,
            }
          );
          if (rpcError) throw rpcError;
        } else {
          const { error: rpcError } = await supabase.rpc(
            'increment_task_positions',
            {
              p_column_id: oldColumnId,
              p_start_pos: newPosition,
              p_end_pos: oldPosition - 1,
            }
          );
          if (rpcError) throw rpcError;
        }
      }
    } else {
      const { error: rpcError1 } = await supabase.rpc(
        'decrement_task_positions_from',
        {
          p_column_id: oldColumnId,
          p_start_pos: oldPosition + 1,
        }
      );
      if (rpcError1) throw rpcError1;

      const { error: rpcError2 } = await supabase.rpc(
        'increment_task_positions_from',
        {
          p_column_id: newColumnId,
          p_start_pos: newPosition,
        }
      );
      if (rpcError2) throw rpcError2;
    }
  }

  static async moveTaskToColumnEnd(
    oldColumnId: string,
    oldPosition: number,
    newColumnId: string
  ): Promise<number> {
    const supabase = await createSupabaseServer();

    const { count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('column_id', newColumnId);
    const newPos = (count || 0) + 1;

    const { error: rpcError } = await supabase.rpc(
      'decrement_task_positions_from',
      {
        p_column_id: oldColumnId,
        p_start_pos: oldPosition + 1,
      }
    );
    if (rpcError) throw rpcError;

    return newPos;
  }

  static async getById(
    userId: string,
    taskId: string
  ): Promise<ServiceResult<Tables<'tasks'>>> {
    try {
      const task = await this.getTask(taskId);
      if (!task) return { ok: false, error: 'Task not found', status: 404 };

      let workspaceId = '';
      if (hasProjectData(task) && task.projects) {
        workspaceId = task.projects.workspace_id;
      }

      if (!workspaceId) {
        return { ok: false, error: 'Project data missing', status: 404 };
      }

      const member = await MemberGuard.validateMember(workspaceId, userId);
      if (!member) return { ok: false, error: 'Unauthorized', status: 401 };

      return { ok: true, data: task };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async create(
    userId: string,
    input: z.infer<typeof createTaskSchema>
  ): Promise<ServiceResult<Tables<'tasks'>>> {
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

      const data = await this.createTask(input, userId);

      await logActivity({
        action: 'CREATE',
        entityType: 'TASK',
        entityId: data.id,
        entityTitle: data.title,
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
    taskId: string,
    input: z.infer<typeof updateTaskSchema>
  ): Promise<ServiceResult<Tables<'tasks'>>> {
    try {
      const currentTask = await this.getTask(taskId);
      if (!currentTask) {
        return { ok: false, error: 'Task not found', status: 404 };
      }

      let workspaceId = '';
      let projectName = '';
      if (hasProjectData(currentTask) && currentTask.projects) {
        workspaceId = currentTask.projects.workspace_id;
        projectName = currentTask.projects.name;
      }

      if (!workspaceId) {
        return { ok: false, error: 'Project data missing', status: 404 };
      }

      const member = await MemberGuard.validateMember(workspaceId, userId);

      if (!member) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      const updates: TablesUpdate<'tasks'> = {
        updated_at: new Date().toISOString(),
        updated_by: userId,
      };

      if (input.title) updates.title = input.title;
      if (input.description) updates.description = input.description;
      if (input.assignedTo !== undefined)
        updates.assigned_to = input.assignedTo;
      if (input.deadlines !== undefined) updates.deadlines = input.deadlines;

      if (input.position !== undefined && input.columnId !== undefined) {
        await this.updateTaskPosition(
          currentTask.column_id,
          currentTask.position,
          input.columnId,
          input.position
        );
        updates.column_id = input.columnId;
        updates.position = input.position;
      } else if (
        input.columnId !== undefined &&
        input.columnId !== currentTask.column_id
      ) {
        const newPos = await this.moveTaskToColumnEnd(
          currentTask.column_id,
          currentTask.position,
          input.columnId
        );
        updates.column_id = input.columnId;
        updates.position = newPos;
      }

      const data = await this.updateTask(taskId, updates);

      await logActivity({
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: data.id,
        entityTitle: data.title,
        workspaceId: workspaceId,
        userId: userId,
        metadata: { projectName: projectName },
      });

      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async delete(
    userId: string,
    taskId: string
  ): Promise<ServiceResult<Tables<'tasks'>>> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        return { ok: false, error: 'Task not found', status: 404 };
      }

      let workspaceId = '';
      if (hasProjectData(task) && task.projects) {
        workspaceId = task.projects.workspace_id;
      }

      if (!workspaceId) {
        return { ok: false, error: 'Project data missing', status: 404 };
      }

      const member = await MemberGuard.validateMember(workspaceId, userId);
      if (!member) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      const data = await this.deleteTask(taskId);

      let projectName = '';
      if (hasProjectData(task) && task.projects) {
        projectName = task.projects.name;
      }

      await logActivity({
        action: 'DELETE',
        entityType: 'TASK',
        entityId: taskId,
        entityTitle: task.title,
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
