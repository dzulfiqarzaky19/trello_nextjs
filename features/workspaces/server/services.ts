import { createSupabaseServer } from '@/lib/supabase/server';
import { TablesUpdate } from '@/lib/supabase/database.types';
import { WORKSPACE_STORAGE_BUCKET } from '../constants';
import { getErrorMessage, isAppError } from '@/lib/supabase/types';
import { workspaceSchema, workspacesListSchema } from '../schema';
import { z } from 'zod';
import { isUuid } from '@/lib/utils/checkUuid';
import { MemberGuard } from '@/features/members/server/guard';
import { StorageService } from '@/lib/storage-service';

import { MemberService } from '@/features/members/server/services';

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

interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description?: string;
  image?: File | null;
  userId: string;
}

interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  description?: string;
  image?: File | string | null;
}

export class WorkspaceService {
  static async getWorkspace(idOrSlug: string) {
    const supabase = await createSupabaseServer();
    let query = supabase.from('workspaces').select(
      `
        *,
        user:user_id (
          id,
          full_name,
          avatar_url,
          email,
          role
        ),
        members (
          user_id,
          role,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            email
          )
        ),
        projects (*)
      `
    );

    if (isUuid(idOrSlug)) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  }

  static async listWorkspaces(userId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('workspaces')
      .select(
        `
          *,
          user:user_id ( 
            id,
            full_name,
            avatar_url,
            role,
            email
          ),
          members (
            user_id,
            role,
            profiles:user_id ( 
              id,
              full_name,
              avatar_url,
              email
            )
          )
        `
      )
      .eq('members.user_id', userId);

    if (error) throw error;
    return data;
  }

  static async createWorkspace(input: {
    name: string;
    slug: string;
    image_url: string | null;
    user_id: string;
    description?: string;
  }) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: input.name,
        slug: input.slug,
        image_url: input.image_url,
        user_id: input.user_id,
        description: input.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkspace(
    workspaceId: string,
    updateData: TablesUpdate<'workspaces'>
  ) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('workspaces')
      .update(updateData)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWorkspace(workspaceId: string): Promise<void> {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) throw error;
  }

  static async uploadImage(
    userId: string,
    file: File
  ): Promise<ServiceResult<{ url: string }>> {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const url = await StorageService.upload(
        file,
        WORKSPACE_STORAGE_BUCKET,
        fileName
      );
      return { ok: true, data: { url } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async getWorkspaceId(
    workspaceIdOrSlug: string
  ): Promise<string | null> {
    const supabase = await createSupabaseServer();

    if (isUuid(workspaceIdOrSlug)) {
      return workspaceIdOrSlug;
    }

    const { data } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', workspaceIdOrSlug)
      .single();

    return data ? data.id : null;
  }

  static async getById(
    workspaceIdOrSlug: string,
    userId: string
  ): Promise<ServiceResult<z.infer<typeof workspaceSchema>>> {
    try {
      const data = await this.getWorkspace(workspaceIdOrSlug);

      if (!data) {
        return { ok: false, error: 'Workspace not found', status: 404 };
      }

      const currentMember = data.members.find(
        (m: { user_id: string }) => m.user_id === userId
      );

      if (!currentMember) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      const isAdmin = currentMember.role === 'ADMIN';

      const result = workspaceSchema.safeParse({
        ...data,
        isAdmin,
        currentUserId: userId,
      });

      if (!result.success) {
        console.log('Validation Error:', result.error);
        return { ok: false, error: 'Data validation failed', status: 500 };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async list(
    userId: string
  ): Promise<ServiceResult<z.infer<typeof workspacesListSchema>>> {
    try {
      const data = await this.listWorkspaces(userId);

      const result = workspacesListSchema.safeParse(data);

      if (!result.success) {
        return { ok: false, error: 'Data validation failed', status: 500 };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      console.error(error);
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async create(
    input: CreateWorkspaceInput
  ): Promise<ServiceResult<{ id: string; name: string; slug: string }>> {
    try {
      let imageUrl: string | null = null;
      if (input.image instanceof File) {
        const fileName = `${input.userId}/${Date.now()}-${input.image.name}`;
        imageUrl = await StorageService.upload(
          input.image,
          WORKSPACE_STORAGE_BUCKET,
          fileName
        );
      }

      const workspace = await this.createWorkspace({
        name: input.name,
        slug: input.slug,
        image_url: imageUrl,
        user_id: input.userId,
        description: input.description,
      });

      try {
        await MemberService.createMember(workspace.id, input.userId, 'ADMIN');
      } catch (memberError) {
        await this.deleteWorkspace(workspace.id);
        throw memberError;
      }

      return { ok: true, data: workspace };
    } catch (error) {
      if (isAppError(error) && error.code === '23505') {
        return {
          ok: false,
          error: 'Workspace with this slug already exists',
          status: 400,
        };
      }
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async update(
    workspaceId: string,
    userId: string,
    input: UpdateWorkspaceInput
  ): Promise<ServiceResult<{ id: string; name: string; slug: string }>> {
    const adminCheck = await MemberGuard.validateAdmin(workspaceId, userId);

    if (!adminCheck) {
      return { ok: false, error: 'Unauthorized', status: 401 };
    }

    const currentWorkspace = await this.getWorkspace(workspaceId);

    const existingImageUrl = currentWorkspace?.image_url;

    try {
      let imageUrl: string | undefined | null = undefined;
      if (input.image instanceof File) {
        const fileName = `${userId}/${Date.now()}-${input.image.name}`;
        imageUrl = await StorageService.upload(
          input.image,
          WORKSPACE_STORAGE_BUCKET,
          fileName
        );
      } else if (typeof input.image === 'string') {
        imageUrl = input.image;
      } else if (input.image === null) {
        imageUrl = null;
      }

      const updateData: TablesUpdate<'workspaces'> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;

      const updatedWorkspace = await this.updateWorkspace(
        workspaceId,
        updateData
      );

      if (
        imageUrl !== undefined &&
        existingImageUrl &&
        existingImageUrl !== imageUrl
      ) {
        await StorageService.delete(existingImageUrl, WORKSPACE_STORAGE_BUCKET);
      }

      return { ok: true, data: updatedWorkspace };
    } catch (error) {
      if (isAppError(error) && error.code === '23505') {
        return {
          ok: false,
          error: 'Workspace with this slug already exists',
          status: 400,
        };
      }
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async delete(
    workspaceId: string,
    userId: string
  ): Promise<ServiceResult<{ id: string }>> {
    const adminCheck = await MemberGuard.validateAdmin(workspaceId, userId);

    if (!adminCheck) {
      return { ok: false, error: 'Unauthorized', status: 401 };
    }

    try {
      const currentWorkspace = await this.getWorkspace(workspaceId);
      const imageUrl = currentWorkspace?.image_url;

      if (imageUrl) {
        await StorageService.delete(imageUrl, WORKSPACE_STORAGE_BUCKET);
      }

      await this.deleteWorkspace(workspaceId);

      return { ok: true, data: { id: workspaceId } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
