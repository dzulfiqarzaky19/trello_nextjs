'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useLogout } from '@/features/auth/api/useLogout';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({
  children,
  initialSession,
  initialUser,
  initialProfile,
}: {
  children: ReactNode;
  initialSession: Session | null;
  initialUser: User | null;
  initialProfile: Profile | null;
}) => {
  const router = useRouter();

  const { mutate } = useLogout();

  const signOut = async () => {
    mutate(
      {},
      {
        onSuccess: () => {
          router.push('/sign-in');
        },
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user: initialUser,
        session: initialSession,
        profile: initialProfile,
        loading: false,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
