export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface CardMember {
  user_id: string;
  profiles: Profile;
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  order: number;
  list_id: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  created_at: string;
  card_members: CardMember[];
}

export interface List {
  id: string;
  title: string;
  order: number;
  board_id: string;
  created_at: string;
  cards: Card[];
}

export interface BoardMember {
  user_id: string;
  role: 'admin' | 'member' | 'observer';
  profiles: Profile;
}

export interface Board {
  id: string;
  title: string;
  image_url: string | null;
  owner_id: string;
  created_at: string;
  lists: List[];
  board_members: BoardMember[];
}
