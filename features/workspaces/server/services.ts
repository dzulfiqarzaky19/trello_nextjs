import { SupabaseClient } from '@supabase/supabase-js';
import { TablesUpdate } from '@/lib/supabase/database.types';
import { WORKSPACE_STORAGE_BUCKET } from '../constants';

export class WorkspaceService {
  constructor(private supabase: SupabaseClient) {}

  async uploadImage(userId: string, image: File) {
    const fileName = `${userId}/${Date.now()}-${image.name}`;
    const { data, error } = await this.supabase.storage
      .from(WORKSPACE_STORAGE_BUCKET)
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = this.supabase.storage
      .from(WORKSPACE_STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async deleteImage(imageUrl: string) {
    const parts = imageUrl.split(`${WORKSPACE_STORAGE_BUCKET}/`);
    if (parts.length > 1) {
      const path = parts[parts.length - 1];
      await this.supabase.storage.from(WORKSPACE_STORAGE_BUCKET).remove([path]);
    }
  }

  async createWorkspace(data: {
    name: string;
    slug: string;
    image_url: string | null;
    user_id: string;
    description?: string;
  }) {
    const { data: workspace, error } = await this.supabase
      .from('workspaces')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return workspace;
  }

  async updateWorkspace(workspaceId: string, data: TablesUpdate<'workspaces'>) {
    const { data: updatedWorkspace, error } = await this.supabase
      .from('workspaces')
      .update(data)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return updatedWorkspace;
  }

  async deleteWorkspace(workspaceId: string) {
    const { error } = await this.supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) throw error;
    return workspaceId;
  }

  async getMember(workspaceId: string, userId: string) {
    const { data, error } = await this.supabase
      .from('members')
      .select('role, workspaces(image_url)')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER'
  ) {
    const { error } = await this.supabase.from('members').insert({
      workspace_id: workspaceId,
      user_id: userId,
      role,
    });

    if (error) throw error;
  }

  async listWorkspaces(userId: string) {
    const { data, error } = await this.supabase
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
}
