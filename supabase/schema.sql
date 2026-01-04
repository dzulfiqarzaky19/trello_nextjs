-- ==========================================
-- 1. CLEANUP (Reverse order of dependencies)
-- ==========================================
drop table if exists tasks cascade;
drop table if exists columns cascade;
drop table if exists projects cascade;
drop table if exists members cascade;
drop table if exists workspaces cascade;
drop type if exists member_role cascade;
drop type if exists project_status cascade;

-- ==========================================
-- 2. ENUMS & EXTENSIONS
-- ==========================================
create type member_role as enum ('ADMIN', 'MEMBER');

-- ==========================================
-- 3. TABLES
-- ==========================================

-- WORKSPACES: The top-level container
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  user_id uuid references public.profiles(id) on delete cascade not null,
  invite_code text unique default substring(md5(random()::text), 0, 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MEMBERS: Join table for Workspace access
create table members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role member_role not null default 'MEMBER',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROJECTS: Boards inside a workspace
create type project_status as enum ('ACTIVE', 'COMPLETED', 'ARCHIVED');

create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  image_url text,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  status project_status default 'ACTIVE',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- COLUMNS: Lists inside a project (To Do, Doing, etc.)
create table columns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  project_id uuid references projects(id) on delete cascade not null,
  position int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TASKS: The actual cards
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  project_id uuid references projects(id) on delete cascade not null,
  column_id uuid references columns(id) on delete cascade not null,
  position int not null default 0, -- For vertical ordering within a column
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table workspaces enable row level security;
alter table members enable row level security;
alter table projects enable row level security;
alter table columns enable row level security;
alter table tasks enable row level security;

-- 1. Create the safe "peek" function
create or replace function get_member_workspace_ids(user_uuid uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
    select workspace_id from members where user_id = user_uuid;
$$;

-- ==========================================
-- RLS WORKSPACE
-- ==========================================

-- VIEW: Use the function to check membership. 
-- This avoids querying the 'members' table directly, breaking the loop.
drop policy if exists "Members can view workspace" on workspaces;
create policy "Members can view workspace" on workspaces
  for select using (
    auth.uid() = user_id -- Owner can always see
    OR
    id in ( select get_member_workspace_ids(auth.uid()) ) -- Members check via safe function
  );

-- CRUD: Only the creator (user_id) can edit/delete
drop policy if exists "Owners can manage workspace" on workspaces;
create policy "Owners can manage workspace" on workspaces
  for all using (auth.uid() = user_id);

-- ==========================================
-- RLS MEMBERS
-- ==========================================

-- 2. Drop OLD Member policies
drop policy if exists "Members can view members" on members;
drop policy if exists "Users can join workspaces" on members;
drop policy if exists "Admins can manage members" on members;
drop policy if exists "Owners can manage members" on members;

-- VIEW (Uses the function to stop recursion)
create policy "Members can view members" on members
  for select using (
    auth.uid() = user_id 
    OR 
    workspace_id in ( select get_member_workspace_ids(auth.uid()) )
  );

-- INSERT (Needed for creating workspace)
create policy "Users can join workspaces" on members
  for insert with check (auth.uid() = user_id);

-- UPDATE/DELETE (Checks Workspace table instead of Members to stop recursion)
create policy "Owners can manage members" on members
  for all using (
    exists (
      select 1 from workspaces 
      where workspaces.id = members.workspace_id 
      and workspaces.user_id = auth.uid()
    )
  );

-- ==========================================
-- RLS PROJECTS
-- ==========================================

-- View: Any member of the workspace can see Projects, Columns, and Tasks
drop policy if exists "Members can view projects" on projects;
create policy "Members can view projects" on projects for select using 
  (workspace_id in (select get_member_workspace_ids(auth.uid())));

-- CRUD: Check the Workspace table directly (Safe because Workspace CRUD doesn't check Projects)
drop policy if exists "Admins can manage projects" on projects;
create policy "Admins can manage projects" on projects for all using 
  (exists (select 1 from workspaces where id = projects.workspace_id and user_id = auth.uid()));

-- ==========================================
-- RLS COLLUMNS
-- ==========================================

drop policy if exists "Members can view columns" on columns;
create policy "Members can view columns" on columns for select using (
  exists (
    select 1 from projects 
    where projects.id = columns.project_id 
    and projects.workspace_id in (select get_member_workspace_ids(auth.uid()))
  )
);

drop policy if exists "Admins can manage columns" on columns;
create policy "Admins can manage columns" on columns for all using (
  exists (
    select 1 from projects
    join workspaces on workspaces.id = projects.workspace_id
    where projects.id = columns.project_id 
    and workspaces.user_id = auth.uid()
  )
);

-- ==========================================
-- RLS TASKS
-- ==========================================

drop policy if exists "Members can view tasks" on tasks;
create policy "Members can view tasks" on tasks for select using (
  exists (
    select 1 from projects 
    where projects.id = tasks.project_id 
    and projects.workspace_id in (select get_member_workspace_ids(auth.uid()))
  )
);

drop policy if exists "Admins can manage tasks" on tasks;
create policy "Admins can manage tasks" on tasks for all using (
  exists (
    select 1 from projects
    join workspaces on workspaces.id = projects.workspace_id
    where projects.id = tasks.project_id 
    and workspaces.user_id = auth.uid()
  )
);

-- ==========================================
-- TRIGGER UPDATE
-- ==========================================



-- we have public.handle_updated_at
-- Apply it to workspaces
drop trigger if exists on_workspaces_updated on public.workspaces;
-- Apply your existing function to the new tables
create trigger on_workspaces_updated
  before update on workspaces
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_members_updated on public.members;
create trigger on_members_updated 
  before update on members 
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_projects_updated on public.projects;
create trigger on_projects_updated
  before update on projects
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_columns_updated on public.columns;
create trigger on_columns_updated
  before update on columns
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_tasks_updated on public.tasks;
create trigger on_tasks_updated
  before update on tasks
  for each row execute procedure public.handle_updated_at();
