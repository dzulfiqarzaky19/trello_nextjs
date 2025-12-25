'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Note: This is a placeholder. Full file upload requires Supabase Storage setup
// For now, we'll support adding attachments via URL

export async function addAttachment(cardId: string, fileName: string, fileUrl: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('attachments')
    .insert({
      card_id: cardId,
      file_name: fileName,
      file_url: fileUrl,
      uploaded_by: user.id,
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

  return { success: true, attachment: data };
}

export async function deleteAttachment(attachmentId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get board_id before deleting
  const { data: attachment } = await supabase
    .from('attachments')
    .select('card_id, cards(list_id, lists(board_id))')
    .eq('id', attachmentId)
    .single();

  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', attachmentId)
    .eq('uploaded_by', user.id); // Only allow deleting own attachments

  if (error) {
    return { error: error.message };
  }

  if (attachment && attachment.cards) {
    const cardData = attachment.cards as any;
    if (cardData.lists) {
      revalidatePath(`/projects/${cardData.lists.board_id}`);
    }
  }

  return { success: true };
}
