-- ============================================================
-- ReplyForge — Phase 4 : Connexion Zernio + Avis
-- À exécuter après 003_fix_webhook_upsert.sql
-- ============================================================
-- NOTE : Si la table public.reviews existe déjà (migration 001),
-- supprimez-la d'abord : DROP TABLE IF EXISTS public.reviews CASCADE;
-- ============================================================

-- ============================================================
-- TABLE : zernio_connections
-- ============================================================
create table if not exists public.zernio_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  zernio_profile_id text not null,
  zernio_account_id text,
  business_name text,
  business_address text,
  business_city text,
  rating numeric(3,2),
  review_count integer default 0,
  connected_at timestamptz default now(),
  last_sync_at timestamptz,
  sync_status text not null default 'idle' check (sync_status in ('idle', 'syncing', 'error')),
  sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zernio_connections_user_id_idx on public.zernio_connections(user_id);
create index if not exists zernio_connections_profile_id_idx on public.zernio_connections(zernio_profile_id);

create trigger set_updated_at_zernio_connections
  before update on public.zernio_connections
  for each row execute function public.update_updated_at_column();

alter table public.zernio_connections enable row level security;

create policy "Users see own zernio connection"
  on public.zernio_connections for select
  using (auth.uid() = user_id);

create policy "Service role manages zernio connections"
  on public.zernio_connections for all
  using (auth.role() = 'service_role');

-- ============================================================
-- TABLE : reviews (remplace la version Phase 1 si existante)
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  zernio_review_id text unique not null,
  author_name text,
  author_photo_url text,
  rating integer check (rating between 1 and 5),
  review_text text,
  review_language text,
  review_created_at timestamptz,
  review_updated_at timestamptz,
  reply_text text,
  reply_published_at timestamptz,
  reply_state text check (reply_state in ('PENDING', 'ACTIVE', 'REJECTED')),
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_user_id_idx on public.reviews(user_id);
create index if not exists reviews_created_at_idx on public.reviews(review_created_at desc);
create index if not exists reviews_rating_idx on public.reviews(rating);
create index if not exists reviews_no_reply_idx on public.reviews(user_id) where reply_text is null;
create index if not exists reviews_zernio_id_idx on public.reviews(zernio_review_id);

create trigger set_updated_at_reviews_phase4
  before update on public.reviews
  for each row execute function public.update_updated_at_column();

alter table public.reviews enable row level security;

create policy "Users see own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Service role manages reviews"
  on public.reviews for all
  using (auth.role() = 'service_role');
