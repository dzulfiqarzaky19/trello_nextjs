'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createList(boardId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;

  if (!title) {
    return { error: 'Title is required' };
  }

  // Get the current max order for lists in this board
  const { data: lists } = await supabase
    .from('lists')
    .select('order')
    .eq('board_id', boardId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = lists && lists.length > 0 ? lists[0].order + 1 : 0;

  const { data, error } = await supabase
    .from('lists')
    .insert({
      title,
      board_id: boardId,
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${boardId}`);
  return { success: true, list: data };
}

export async function updateList(listId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const order = formData.get('order') as string;

  const updates: { title?: string; order?: number } = {};
  if (title) updates.title = title;
  if (order) updates.order = parseInt(order);

  const { data, error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', listId)
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

  return { success: true, list: data };
}

export async function deleteList(listId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get board_id before deleting
  const { data: list } = await supabase
    .from('lists')
    .select('board_id')
    .eq('id', listId)
    .single();

  const { error } = await supabase.from('lists').delete().eq('id', listId);

  if (error) {
    return { error: error.message };
  }

  if (list) {
    revalidatePath(`/projects/${list.board_id}`);
  }

  return { success: true };
}
