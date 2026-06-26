-- Robust trigger: creates profile + tone_profile on auth.users insert
-- Uses ON CONFLICT DO NOTHING for full idempotency
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, hotel_name, email, role, subscription_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'hotel_name', ''),
    new.email,
    'hotel',
    'pending_payment'
  )
  on conflict (id) do nothing;

  insert into public.tone_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Drop and recreate trigger to ensure it's attached
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
