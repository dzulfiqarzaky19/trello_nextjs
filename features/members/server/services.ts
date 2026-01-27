import { createSupabaseServer } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/supabase/types';
import { membersListSchema } from '../schema';
import { z } from 'zod';
import { MemberGuard } from './guard';
import { WorkspaceService } from '@/features/workspaces/server/services';

import { ServiceResult } from '@/lib/service-result';

interface AddMemberInput {
  workspaceId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER';
}

interface UpdateMemberRoleInput {
  workspaceId: string;
  targetUserId: string;
  role: 'ADMIN' | 'MEMBER';
}

interface RemoveMemberInput {
  workspaceId: string;
  targetUserId: string;
}

export class MemberService {
  static async getById(workspaceId: string, userId: string) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  static async listMembers(workspaceId: string) {
    const supabase = await createSupabaseServer();
    const { data: members, error } = await supabase
      .from('members')
      .select(
        `
      user_id,
      role,
      profiles:user_id (
          id,
          full_name,
          avatar_url,
          email
      )
    `
      )
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    return members;
  }

  static async createMember(
    workspaceId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER'
  ): Promise<void> {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from('members').insert({
      workspace_id: workspaceId,
      user_id: userId,
      role: role,
    });

    if (error) throw error;
  }

  static async updateMember(
    workspaceId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER'
  ): Promise<void> {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from('members')
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async deleteMember(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Helper to fetch profile (as we don't have ProfileService yet)
  static async getProfile(userId: string) {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    return data;
  }

  static async list(
    workspaceIdOrSlug: string,
    currentUserId: string
  ): Promise<ServiceResult<z.infer<typeof membersListSchema>>> {
    try {
      let workspaceUuid = workspaceIdOrSlug;
      const resolvedId =
        await WorkspaceService.getWorkspaceId(workspaceIdOrSlug);

      if (!resolvedId) {
        return { ok: false, error: 'Workspace not found', status: 404 };
      }
      workspaceUuid = resolvedId;

      const memberCheck = await MemberGuard.validateMember(
        workspaceUuid,
        currentUserId
      );

      if (!memberCheck) {
        return { ok: false, error: 'Unauthorized', status: 401 };
      }

      const currentMember = memberCheck.member;

      const members = await this.listMembers(workspaceUuid);

      const result = membersListSchema.safeParse({
        members: members || [],
        isAdmin: currentMember.role === 'ADMIN',
        currentUserId,
        workspaceId: workspaceUuid,
      });

      if (!result.success) {
        return { ok: false, error: 'Data validation failed', status: 500 };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async add(
    input: AddMemberInput,
    currentUserId: string
  ): Promise<ServiceResult<{ success: true }>> {
    try {
      const adminCheck = await MemberGuard.validateAdmin(
        input.workspaceId,
        currentUserId
      );

      if (!adminCheck) {
        return { ok: false, error: 'Only admins can add members', status: 403 };
      }

      // Using internal helper
      const userToAdd = await this.getProfile(input.userId);

      if (!userToAdd) {
        return { ok: false, error: 'User not found', status: 404 };
      }

      const existingMember = await this.getById(
        input.workspaceId,
        input.userId
      );

      if (existingMember) {
        return { ok: false, error: 'User is already a member', status: 400 };
      }

      await this.createMember(input.workspaceId, input.userId, input.role);

      return { ok: true, data: { success: true } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async updateRole(
    input: UpdateMemberRoleInput,
    currentUserId: string
  ): Promise<ServiceResult<{ success: true }>> {
    try {
      const adminCheck = await MemberGuard.validateAdmin(
        input.workspaceId,
        currentUserId
      );

      if (!adminCheck) {
        return {
          ok: false,
          error: 'Only admins can update member roles',
          status: 403,
        };
      }

      if (input.targetUserId === currentUserId) {
        return { ok: false, error: 'Cannot change your own role', status: 400 };
      }

      await this.updateMember(
        input.workspaceId,
        input.targetUserId,
        input.role
      );

      return { ok: true, data: { success: true } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }

  static async remove(
    input: RemoveMemberInput,
    currentUserId: string
  ): Promise<ServiceResult<{ success: true }>> {
    try {
      const adminCheck = await MemberGuard.validateAdmin(
        input.workspaceId,
        currentUserId
      );

      if (!adminCheck) {
        return {
          ok: false,
          error: 'Only admins can remove members',
          status: 403,
        };
      }

      if (input.targetUserId === currentUserId) {
        return { ok: false, error: 'Cannot remove yourself', status: 400 };
      }

      await this.deleteMember(input.workspaceId, input.targetUserId);

      return { ok: true, data: { success: true } };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error), status: 500 };
    }
  }
}
