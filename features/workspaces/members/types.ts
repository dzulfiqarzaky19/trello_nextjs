export interface Member {
  user_id: string;
  role: 'ADMIN' | 'MEMBER';
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;
}
