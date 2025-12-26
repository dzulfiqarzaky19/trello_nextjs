'use server';

import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function assignMemberToCard(cardId: string, userId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase.from('card_members').insert({
    card_id: cardId,
    user_id: userId,
  });

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate
  const { data: card } = await supabase
    .from('cards')
    .select('list_id, lists(board_id)')
    .eq('id', cardId)
    .single();

  if (card && card.lists) {
    revalidatePath(`/projects/${(card.lists as any).board_id}`);
  }

  return { success: true };
}

export async function removeMemberFromCard(cardId: string, userId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('card_members')
    .delete()
    .eq('card_id', cardId)
    .eq('user_id', userId);

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate
  const { data: card } = await supabase
    .from('cards')
    .select('list_id, lists(board_id)')
    .eq('id', cardId)
    .single();

  if (card && card.lists) {
    revalidatePath(`/projects/${(card.lists as any).board_id}`);
  }

  return { success: true };
}

export async function getAvailableMembers(boardId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated', members: [] };
  }

  const { data: members, error } = await supabase
    .from('board_members')
    .select('user_id, profiles(id, full_name, avatar_url)')
    .eq('board_id', boardId);

  if (error) {
    return { error: error.message, members: [] };
  }

  return { members: members || [] };
}
