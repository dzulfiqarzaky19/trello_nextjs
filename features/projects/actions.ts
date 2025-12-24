'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBoard(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const imageUrl = formData.get('imageUrl') as string;

  if (!title) {
    return { error: 'Title is required' };
  }

  const { data, error } = await supabase
    .from('boards')
    .insert({
      title,
      image_url: imageUrl || null,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/projects');
  return { success: true, board: data };
}

export async function getBoards() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated', boards: [] };
  }

  const { data: boards, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_members!inner(user_id, role)
    `)
    .eq('board_members.user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, boards: [] };
  }

  return { boards: boards || [] };
}

export async function getBoardDetails(boardId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Fetch board with lists and cards
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .select(`
      *,
      lists (
        *,
        cards (
          *,
          card_members (
            user_id,
            profiles (id, full_name, avatar_url)
          )
        )
      ),
      board_members (
        user_id,
        role,
        profiles (id, full_name, avatar_url, role)
      )
    `)
    .eq('id', boardId)
    .single();

  console.log('getBoardDetails result:', { 
    boardId, 
    userId: user.id,
    hasBoard: !!board, 
    error: boardError?.message,
    errorDetails: boardError 
  });

  if (boardError) {
    console.error('Board fetch error:', boardError);
    return { error: boardError.message };
  }

  if (!board) {
    return { error: 'Board not found' };
  }

  return { board };
}
