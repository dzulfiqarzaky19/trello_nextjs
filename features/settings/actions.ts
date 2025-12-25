'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const fullName = formData.get('fullName') as string;
  const bio = formData.get('bio') as string;
  const role = formData.get('role') as string;
  // Tags handling might need specific UI logic, for now assuming it's not in the main form submission
  // or handled separately. If passed as JSON string:
  // const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined;

  const updates = {
    full_name: fullName,
    bio: bio,
    role: role, // Optional: ensure this is a valid role if you have constraints
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/settings');
  revalidatePath('/'); // Update sidebar avatar/name
  return { success: true };
}
