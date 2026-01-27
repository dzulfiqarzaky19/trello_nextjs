import { createSupabaseServer } from '@/lib/supabase/server';
import { TablesUpdate } from '@/lib/supabase/database.types';
import { WORKSPACE_STORAGE_BUCKET } from '../constants';
import {
  getErrorMessage,
  isAppError,
  getWorkspaceImageUrl,
} from '@/lib/supabase/types';
import { workspaceSchema, workspacesListSchema } from '../schema';
import { z } from 'zod';


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

  static async getById(
    workspaceIdOrSlug: string,
    userId: string
  ): Promise<ServiceResult<z.infer<typeof workspaceSchema>>> {
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

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        workspaceIdOrSlug
      );

    if (isUuid) {
      query = query.eq('id', workspaceIdOrSlug);
    } else {
      query = query.eq('slug', workspaceIdOrSlug);
    }

    const { data, error } = await query.single();

    if (error) {
      return { ok: false, error: error.message, status: 500 };
    }

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
  }

  // ----------------------------------------
  // GET List Workspaces
  // ----------------------------------------
  static async list(
    userId: string
  ): Promise<ServiceResult<z.infer<typeof workspacesListSchema>>> {
    const supabase = await createSupabaseServer();

    try {
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

  // ----------------------------------------
  // POST Create Workspace
  // ----------------------------------------
  static async create(
    input: CreateWorkspaceInput
  ): Promise<ServiceResult<{ id: string; name: string; slug: string }>> {
    const supabase = await createSupabaseServer();

    try {
      // Step 1: Upload image if provided
      let imageUrl: string | null = null;
      if (input.image instanceof File) {
        imageUrl = await this.uploadImageInternal(
          supabase,
          input.userId,
          input.image
        );
      }

      // Step 2: Create workspace
      const { data: workspace, error: createError } = await supabase
        .from('workspaces')
        .insert({
          name: input.name,
          slug: input.slug,
          image_url: imageUrl,
          user_id: input.userId,
          description: input.description,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Step 3: Add creator as admin member (with rollback on failure)
      try {
        const { error: memberError } = await supabase.from('members').insert({
          workspace_id: workspace.id,
          user_id: input.userId,
          role: 'ADMIN',
        });

        if (memberError) throw memberError;
      } catch (memberError) {
        // Rollback: delete the workspace we just created
        await supabase.from('workspaces').delete().eq('id', workspace.id);
        throw memberError;
      }

      return { ok: true, data: workspace };
    } catch (error) {
      // Handle unique constraint violation
      if (isAppError(error) && error.code === '23505') {
        return { ok: false, error: 'Workspace with this slug already exists', status: 400 };
      }
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  // ----------------------------------------
  // PATCH Update Workspace
  // ----------------------------------------
  static async update(
    workspaceId: string,
    userId: string,
    input: UpdateWorkspaceInput
  ): Promise<ServiceResult<{ id: string; name: string; slug: string }>> {
    const supabase = await createSupabaseServer();

    // Authorization check
    const member = await this.getMemberInternal(supabase, workspaceId, userId);

    if (!member || member.role !== 'ADMIN') {
      return { ok: false, error: 'Unauthorized', status: 401 };
    }

    const existingImageUrl = getWorkspaceImageUrl(member);

    try {
      // Handle image upload/update
      let imageUrl: string | undefined | null = undefined;
      if (input.image instanceof File) {
        imageUrl = await this.uploadImageInternal(supabase, userId, input.image);
      } else if (typeof input.image === 'string') {
        imageUrl = input.image;
      } else if (input.image === null) {
        imageUrl = null;
      }

      // Build update object
      const updateData: TablesUpdate<'workspaces'> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;

      // Update workspace
      const { data: updatedWorkspace, error } = await supabase
        .from('workspaces')
        .update(updateData)
        .eq('id', workspaceId)
        .select()
        .single();

      if (error) throw error;

      // Cleanup old image if replaced
      if (
        imageUrl !== undefined &&
        existingImageUrl &&
        existingImageUrl !== imageUrl
      ) {
        await this.deleteImageInternal(supabase, existingImageUrl);
      }

      return { ok: true, data: updatedWorkspace };
    } catch (error) {
      if (isAppError(error) && error.code === '23505') {
        return { ok: false, error: 'Workspace with this slug already exists', status: 400 };
      }
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  // ----------------------------------------
  // DELETE Workspace
  // ----------------------------------------
  static async delete(
    workspaceId: string,
    userId: string
  ): Promise<ServiceResult<{ id: string }>> {
    const supabase = await createSupabaseServer();

    // Authorization check
    const member = await this.getMemberInternal(supabase, workspaceId, userId);

    if (!member || member.role !== 'ADMIN') {
      return { ok: false, error: 'Unauthorized', status: 401 };
    }

    const imageUrl = getWorkspaceImageUrl(member);

    try {
      // Delete image from storage
      if (imageUrl) {
        await this.deleteImageInternal(supabase, imageUrl);
      }

      // Delete workspace
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (error) throw error;

      return { ok: true, data: { id: workspaceId } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  // ----------------------------------------
  // Upload Image (Public API)
  // ----------------------------------------
  static async uploadImage(
    userId: string,
    file: File
  ): Promise<ServiceResult<{ url: string }>> {
    const supabase = await createSupabaseServer();

    try {
      const url = await this.uploadImageInternal(supabase, userId, file);
      return { ok: true, data: { url } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  // ============================================
  // Internal Helper Methods
  // ============================================

  private static async uploadImageInternal(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    userId: string,
    image: File
  ): Promise<string> {
    const fileName = `${userId}/${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from(WORKSPACE_STORAGE_BUCKET)
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(WORKSPACE_STORAGE_BUCKET).getPublicUrl(data.path);

    return publicUrl;
  }

  private static async deleteImageInternal(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    imageUrl: string
  ): Promise<void> {
    const parts = imageUrl.split(`${WORKSPACE_STORAGE_BUCKET}/`);
    if (parts.length > 1) {
      const path = parts[parts.length - 1];
      await supabase.storage.from(WORKSPACE_STORAGE_BUCKET).remove([path]);
    }
  }

  private static async getMemberInternal(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    workspaceId: string,
    userId: string
  ) {
    const { data, error } = await supabase
      .from('members')
      .select('role, workspaces(image_url)')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
