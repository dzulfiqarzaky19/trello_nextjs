'use server';

import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createLabel(
  boardId: string,
  name: string,
  color: string
) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('labels')
    .insert({
      board_id: boardId,
      name,
      color,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${boardId}`);
  return { success: true, label: data };
}

export async function getBoardLabels(boardId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated', labels: [] };
  }

  const { data: labels, error } = await supabase
    .from('labels')
    .select('*')
    .eq('board_id', boardId)
    .order('name');

  if (error) {
    return { error: error.message, labels: [] };
  }

  return { labels: labels || [] };
}

export async function assignLabelToCard(cardId: string, labelId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase.from('card_labels').insert({
    card_id: cardId,
    label_id: labelId,
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

export async function removeLabelFromCard(cardId: string, labelId: string) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('card_labels')
    .delete()
    .eq('card_id', cardId)
    .eq('label_id', labelId);

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
