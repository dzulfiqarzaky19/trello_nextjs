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

export interface Label {
  id: string;
  board_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface CardLabel {
  label_id: string;
  labels: Label;
}

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  title: string;
  completed: boolean;
  order: number;
  created_at: string;
}

export interface Checklist {
  id: string;
  card_id: string;
  title: string;
  order: number;
  created_at: string;
  checklist_items: ChecklistItem[];
}

export interface Comment {
  id: string;
  card_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

export interface Attachment {
  id: string;
  card_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
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
  card_labels?: CardLabel[];
  checklists?: Checklist[];
  comments?: Comment[];
  attachments?: Attachment[];
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
