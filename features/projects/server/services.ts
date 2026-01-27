import { createSupabaseServer } from '@/lib/supabase/server';
import { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { WORKSPACE_STORAGE_BUCKET } from '@/features/workspaces/constants';
import { getErrorMessage } from '@/lib/supabase/types';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from '../schema';
import { MemberGuard } from '@/features/members/server/guard';
import { WorkspaceService } from '@/features/workspaces/server/services';
import { StorageService } from '@/lib/storage-service';
import { logActivity } from '@/lib/audit-logs';
import { isUuid } from '@/lib/utils/checkUuid';

type HttpErrorStatus = 400 | 401 | 404 | 500;

interface ServiceSuccess<T> {
  ok: true;
  data: T;
}

interface ServiceError {
  ok: false;
  error: string;
  status: HttpErrorStatus;
}

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export class ProjectService {
  // --- Internal Basic CRUD Methods ---

  static async getProject(projectId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  }

  static async listProjects(userId: string, workspaceId: string | null) {
    const supabase = await createSupabaseServer();
    let query = supabase.from('projects').select('*');

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    } else {
      const { data: userMemberWorkspaces } = await supabase
        .from('members')
        .select('workspace_id')
        .eq('user_id', userId);

      const workspaceIds =
        userMemberWorkspaces?.map((m) => m.workspace_id) || [];

      if (workspaceIds.length === 0) {
        return [];
      }

      query = query.in('workspace_id', workspaceIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createProject(input: {
    name: string;
    workspace_id: string;
    image_url: string | null;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    created_by: string;
    updated_by: string;
  }) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('projects')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProject(
    projectId: string,
    updateData: TablesUpdate<'projects'>
  ) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProject(projectId: string) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  static async getById(
    projectId: string,
    userId: string
  ): Promise<ServiceResult<Tables<'projects'>>> {
    try {
      const project = await this.getProject(projectId);

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

      return { ok: true, data: project };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async list(
    userId: string,
    workspaceIdOrSlug?: string
  ): Promise<
    ServiceResult<{
      projects: Tables<'projects'>[];
      isAdmin: boolean;
      workspaceId: string | null;
    }>
  > {
    try {
      let workspaceId: string | null = null;
      let isAdmin = false;

      if (workspaceIdOrSlug) {
        workspaceId = await WorkspaceService.getWorkspaceId(workspaceIdOrSlug);

        if (!workspaceId) {
          return {
            ok: true,
            data: { projects: [], isAdmin: false, workspaceId: null },
          };
        }

        const memberCheck = await MemberGuard.validateMember(
          workspaceId,
          userId
        );
        if (!memberCheck) {
          return {
            ok: true,
            data: { projects: [], isAdmin: false, workspaceId: null },
          };
        }

        isAdmin = memberCheck.member.role === 'ADMIN';
      }

      const projects = await this.listProjects(userId, workspaceId);

      return {
        ok: true,
        data: {
          projects: projects || [],
          isAdmin,
          workspaceId,
        },
      };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async create(
    input: z.infer<typeof createProjectSchema> & { userId: string }
  ): Promise<ServiceResult<Tables<'projects'>>> {
    try {
      const member = await MemberGuard.validateMember(
        input.workspace_id,
        input.userId
      );

      if (!member) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      let imageUrl: string | null = null;
      if (input.image instanceof File) {
        const fileName = `${input.workspace_id}/${Date.now()}-${input.image.name}`;
        try {
          imageUrl = await StorageService.upload(
            input.image,
            WORKSPACE_STORAGE_BUCKET,
            fileName
          );
        } catch (e) {
          return {
            ok: false,
            error: e instanceof Error ? e.message : 'Unknown error',
            status: 500,
          };
        }
      }

      const project = await this.createProject({
        name: input.name,
        workspace_id: input.workspace_id,
        image_url: imageUrl,
        status: input.status || 'ACTIVE',
        created_by: input.userId,
        updated_by: input.userId,
      });

      await logActivity({
        action: 'CREATE',
        entityType: 'PROJECT',
        entityId: project.id,
        entityTitle: project.name,
        workspaceId: input.workspace_id,
        userId: input.userId,
      });

      return { ok: true, data: project };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async update(
    projectId: string,
    userId: string,
    input: z.infer<typeof updateProjectSchema>
  ): Promise<ServiceResult<Tables<'projects'>>> {
    try {
      const project = await this.getProject(projectId);
      if (!project)
        return { ok: false, error: 'Project not found', status: 404 };

      const member = await MemberGuard.validateMember(
        project.workspace_id,
        userId
      );
      if (!member) return { ok: false, error: 'Unauthorized', status: 401 };

      let imageUrl: string | undefined = undefined;
      if (input.image instanceof File) {
        const fileName = `${project.workspace_id}/${Date.now()}-${input.image.name}`;
        try {
          imageUrl = await StorageService.upload(
            input.image,
            WORKSPACE_STORAGE_BUCKET,
            fileName
          );
        } catch (e) {
          return {
            ok: false,
            error: e instanceof Error ? e.message : 'Unknown error',
            status: 500,
          };
        }
      }

      const updateData: TablesUpdate<'projects'> = {
        updated_by: userId,
      };
      if (input.name) updateData.name = input.name;
      if (input.status) updateData.status = input.status;
      if (imageUrl) updateData.image_url = imageUrl;

      const updatedProject = await this.updateProject(projectId, updateData);

      if (input.status && input.status !== project.status) {
        await logActivity({
          action: 'UPDATE_STATUS',
          entityType: 'PROJECT',
          entityId: projectId,
          entityTitle: project.name,
          workspaceId: project.workspace_id,
          userId: userId,
          metadata: { from: project.status, to: input.status },
        });
      } else if (input.name && input.name !== project.name) {
        await logActivity({
          action: 'UPDATE_NAME',
          entityType: 'PROJECT',
          entityId: projectId,
          entityTitle: input.name,
          workspaceId: project.workspace_id,
          userId: userId,
          metadata: { from: project.name, to: input.name },
        });
      }

      return { ok: true, data: updatedProject };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async delete(
    projectId: string,
    userId: string
  ): Promise<ServiceResult<{ success: true }>> {
    try {
      const project = await this.getProject(projectId);
      if (!project)
        return { ok: false, error: 'Project not found', status: 404 };

      const adminCheck = await MemberGuard.validateAdmin(
        project.workspace_id,
        userId
      );

      if (!adminCheck) return { ok: false, error: 'Unauthorized', status: 401 };

      await this.deleteProject(projectId);

      await logActivity({
        action: 'DELETE',
        entityType: 'PROJECT',
        entityId: projectId,
        entityTitle: project.name,
        workspaceId: project.workspace_id,
        userId: userId,
      });

      return { ok: true, data: { success: true } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
