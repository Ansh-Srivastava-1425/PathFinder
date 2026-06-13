-- Actual schema for roadmap_steps table in Supabase
create table roadmap_steps (
  id uuid primary key default gen_random_uuid(),
  field_slug text not null,
  slug text,
  title text not null,
  description text,
  week_number integer,
  resources jsonb default '[]',
  project_instructions text,
  requires_submission boolean default false,
  created_at timestamptz default now(),
  step_number integer not null,
  meta text,
  is_locked boolean default false,
  unique(field_slug, step_number)
);

-- Enable RLS
alter table roadmap_steps enable row level security;

-- Allow all authenticated users to read
create policy "Authenticated users can read roadmap_steps"
on roadmap_steps for select
to authenticated
using (true);
