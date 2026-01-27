import { createSupabaseServer } from '@/lib/supabase/server';
import { Member } from '../types';

export class MemberGuard {
  static async validateMember(
    workspaceId: string,
    userId: string
  ): Promise<{ member: Member } | null> {
    const supabase = await createSupabaseServer();
    const { data: member, error } = await supabase
      .from('members')
      .select('*, profiles:user_id(*)')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error || !member) {
      return null;
    }

    return { member };
  }

  static async validateAdmin(
    workspaceId: string,
    userId: string
  ): Promise<{ member: Member } | null> {
    const supabase = await createSupabaseServer();

    const { data: member, error } = await supabase
      .from('members')
      .select('*, profiles:user_id(*)')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error || !member || member.role !== 'ADMIN') {
      return null;
    }

    return { member };
  }
}
