-- Tone profiles table (idempotent)
create table if not exists tone_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  positioning text,
  tone_level integer check (tone_level between 1 and 10),
  response_length text check (response_length in ('short', 'medium', 'long')),
  signature text,
  strengths text[],
  sensitive_topics text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Add columns if table already existed without them
alter table tone_profiles
  add column if not exists positioning text,
  add column if not exists tone_level integer,
  add column if not exists response_length text,
  add column if not exists signature text,
  add column if not exists strengths text[],
  add column if not exists sensitive_topics text[],
  add column if not exists updated_at timestamptz;

-- Enable RLS
alter table tone_profiles enable row level security;

create policy if not exists "Users can manage their own tone profile"
  on tone_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
