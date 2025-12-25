'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(cardId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      card_id: cardId,
      user_id: user.id,
      content,
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

  return { success: true, comment: data };
}

export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', user.id) // Only allow editing own comments
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get board_id to revalidate
  const { data: comment } = await supabase
    .from('comments')
    .select('card_id, cards(list_id, lists(board_id))')
    .eq('id', commentId)
    .single();

  if (comment && comment.cards) {
    const cardData = comment.cards as any;
    if (cardData.lists) {
      revalidatePath(`/projects/${cardData.lists.board_id}`);
    }
  }

  return { success: true, comment: data };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get board_id before deleting
  const { data: comment } = await supabase
    .from('comments')
    .select('card_id, cards(list_id, lists(board_id))')
    .eq('id', commentId)
    .single();

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id); // Only allow deleting own comments

  if (error) {
    return { error: error.message };
  }

  if (comment && comment.cards) {
    const cardData = comment.cards as any;
    if (cardData.lists) {
      revalidatePath(`/projects/${cardData.lists.board_id}`);
    }
  }

  return { success: true };
}

export async function getCardComments(cardId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated', comments: [] };
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*, profiles(id, full_name, avatar_url)')
    .eq('card_id', cardId)
    .order('created_at', { ascending: true });

  if (error) {
    return { error: error.message, comments: [] };
  }

  return { comments: comments || [] };
}
