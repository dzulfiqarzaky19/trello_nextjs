-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  role text,
  bio text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- BOARDS
create table public.boards (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- LISTS
create table public.lists (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  "order" integer not null default 0,
  board_id uuid references public.boards(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- CARDS
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  "order" integer not null default 0,
  list_id uuid references public.lists(id) on delete cascade not null,
  due_date timestamp with time zone,
  priority text check (priority in ('low', 'medium', 'high')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- BOARD MEMBERS (Many-to-Many)
create table public.board_members (
  board_id uuid references public.boards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'member', 'observer')) default 'member',
  primary key (board_id, user_id)
);

-- CARD MEMBERS (Assignees)
create table public.card_members (
  card_id uuid references public.cards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  primary key (card_id, user_id)
);

-- COMMENTS
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  card_id uuid references public.cards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ACTIVITY LOGS
create table public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null,
  entity_title text,
  entity_type text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- EVENTS (Calendar)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  color text,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Basic Setup - Allow All for Prototype, refine later)
alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.lists enable row level security;
alter table public.cards enable row level security;

-- Simple policies for now (Authenticated users can do everything)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- For prototype speed, we'll allow authenticated users to view/edit all boards.
-- In production, strict policies based on `board_members` are needed.
create policy "Enable all access for authenticated users" on public.boards for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.lists for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.cards for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.board_members for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.card_members for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.comments for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.activity_logs for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.events for all using (auth.role() = 'authenticated');

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
