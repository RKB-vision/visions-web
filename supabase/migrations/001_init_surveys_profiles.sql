-- Create survey_responses
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text,
  email text,
  rating int check (rating between 1 and 5),
  feedback text,
  user_email text
);
alter table public.survey_responses enable row level security;

-- Create profiles
create table if not exists public.profiles (
  email text primary key,
  avatar_path text,
  updated_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

-- No public policies; service role API enforces access via NextAuth roles.