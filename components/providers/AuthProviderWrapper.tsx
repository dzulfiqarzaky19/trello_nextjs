import { AuthProvider } from '@/context/AuthContext';
import { createSupabaseServer } from '@/lib/supabase/server';
import React from 'react';

interface IAuthProviderWrapper {
  children: React.ReactNode;
}
export const AuthProviderWrapper = async ({
  children,
}: IAuthProviderWrapper) => {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user || null;

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <AuthProvider
      initialSession={session}
      initialUser={user}
      initialProfile={profile}
    >
      {children}
    </AuthProvider>
  );
};
