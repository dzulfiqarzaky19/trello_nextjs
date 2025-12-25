'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCard(listId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    return { error: 'Title is required' };
  }

  // Get the current max order for cards in this list
  const { data: cards } = await supabase
    .from('cards')
    .select('order')
    .eq('list_id', listId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = cards && cards.length > 0 ? cards[0].order + 1 : 0;

  const { data, error } = await supabase
    .from('cards')
    .insert({
      title,
      description: description || null,
      list_id: listId,
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate the correct path
  const { data: list } = await supabase
    .from('lists')
    .select('board_id')
    .eq('id', listId)
    .single();

  if (list) {
    revalidatePath(`/projects/${list.board_id}`);
  }

  return { success: true, card: data };
}

export async function updateCard(cardId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as
    | 'low'
    | 'medium'
    | 'high'
    | 'none';
  const dueDate = formData.get('dueDate') as string;

  const updates: {
    title?: string;
    description?: string | null;
    priority?: 'low' | 'medium' | 'high' | null;
    due_date?: string | null;
  } = {};

  if (title) updates.title = title;
  if (description !== undefined) updates.description = description || null;
  if (priority && priority !== 'none') {
    updates.priority = priority;
  } else if (priority === 'none') {
    updates.priority = null;
  }
  if (dueDate !== undefined) updates.due_date = dueDate || null;

  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate the correct path
  const { data: card } = await supabase
    .from('cards')
    .select('list_id, lists(board_id)')
    .eq('id', cardId)
    .single();

  if (card && card.lists) {
    revalidatePath(`/projects/${(card.lists as any).board_id}`);
  }

  return { success: true, card: data };
}

export async function deleteCard(cardId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get board_id before deleting
  const { data: card } = await supabase
    .from('cards')
    .select('list_id, lists(board_id)')
    .eq('id', cardId)
    .single();

  const { error } = await supabase.from('cards').delete().eq('id', cardId);

  if (error) {
    return { error: error.message };
  }

  if (card && card.lists) {
    revalidatePath(`/projects/${(card.lists as any).board_id}`);
  }

  return { success: true };
}
