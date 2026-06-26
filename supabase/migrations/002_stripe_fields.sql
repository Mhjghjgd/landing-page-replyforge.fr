-- Migration 002 : Ajout des champs Stripe sur la table profiles
-- À exécuter dans Supabase Dashboard → SQL Editor

-- Ajout des champs (idempotent — safe à re-exécuter)
alter table profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_current_period_end timestamptz,
  add column if not exists subscription_cancel_at timestamptz;

-- Index pour retrouver un user par stripe_customer_id (utilisé dans le webhook)
create index if not exists profiles_stripe_customer_id_idx
  on profiles(stripe_customer_id);

-- Index pour retrouver un user par stripe_subscription_id (utilisé dans subscription.updated)
create index if not exists profiles_stripe_subscription_id_idx
  on profiles(stripe_subscription_id);

-- Vérification : affiche la structure actuelle de la table
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'profiles'
order by ordinal_position;
