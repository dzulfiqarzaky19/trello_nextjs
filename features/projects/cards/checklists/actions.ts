'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createChecklist(cardId: string, title: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get current max order
  const { data: checklists } = await supabase
    .from('checklists')
    .select('order')
    .eq('card_id', cardId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = checklists && checklists.length > 0 ? checklists[0].order + 1 : 0;

  const { data, error } = await supabase
    .from('checklists')
    .insert({
      card_id: cardId,
      title,
      order: nextOrder,
    })
    .select()
    .single();

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

  return { success: true, checklist: data };
}

export async function addChecklistItem(checklistId: string, title: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get current max order
  const { data: items } = await supabase
    .from('checklist_items')
    .select('order')
    .eq('checklist_id', checklistId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = items && items.length > 0 ? items[0].order + 1 : 0;

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      checklist_id: checklistId,
      title,
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate
  const { data: checklist } = await supabase
    .from('checklists')
    .select('card_id, cards(list_id, lists(board_id))')
    .eq('id', checklistId)
    .single();

  if (checklist && checklist.cards) {
    const cardData = checklist.cards as any;
    if (cardData.lists) {
      revalidatePath(`/projects/${cardData.lists.board_id}`);
    }
  }

  return { success: true, item: data };
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .update({ completed })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate
  const { data: item } = await supabase
    .from('checklist_items')
    .select('checklist_id, checklists(card_id, cards(list_id, lists(board_id)))')
    .eq('id', itemId)
    .single();

  if (item && item.checklists) {
    const checklistData = item.checklists as any;
    if (checklistData.cards && checklistData.cards.lists) {
      revalidatePath(`/projects/${checklistData.cards.lists.board_id}`);
    }
  }

  return { success: true, item: data };
}

export async function deleteChecklistItem(itemId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get board_id before deleting
  const { data: item } = await supabase
    .from('checklist_items')
    .select('checklist_id, checklists(card_id, cards(list_id, lists(board_id)))')
    .eq('id', itemId)
    .single();

  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    return { error: error.message };
  }

  if (item && item.checklists) {
    const checklistData = item.checklists as any;
    if (checklistData.cards && checklistData.cards.lists) {
      revalidatePath(`/projects/${checklistData.cards.lists.board_id}`);
    }
  }

  return { success: true };
}
