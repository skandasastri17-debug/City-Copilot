alter table profiles enable row level security;
alter table teams enable row level security;
alter table matches enable row level security;
alter table predictions enable row level security;
alter table prediction_scores enable row level security;
alter table leaderboards_cache enable row level security;
alter table private_groups enable row level security;
alter table private_group_members enable row level security;
alter table fan_confidence_snapshots enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table share_cards enable row level security;
alter table notifications enable row level security;

create or replace function public.is_group_member(group_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from private_group_members
    where group_id = group_uuid and user_id = auth.uid()
  );
$$;

create or replace function public.is_group_creator(group_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from private_groups
    where id = group_uuid and created_by = auth.uid()
  );
$$;

create policy "profiles read public leaderboard fields" on profiles for select using (true);
create policy "profiles insert own" on profiles for insert with check (user_id = auth.uid());
create policy "profiles update own" on profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "teams public read" on teams for select using (true);
create policy "matches public read" on matches for select using (true);
create policy "confidence public read" on fan_confidence_snapshots for select using (true);
create policy "badges public read" on badges for select using (true);
create policy "leaderboards public read" on leaderboards_cache for select using (true);
create policy "scores own read" on prediction_scores for select using (user_id = auth.uid());

create policy "predictions own read" on predictions for select using (user_id = auth.uid());
create policy "predictions create own before kickoff" on predictions for insert
with check (
  user_id = auth.uid()
  and exists (select 1 from matches where matches.id = match_id and now() < matches.kickoff_time)
);
create policy "predictions update own before kickoff" on predictions for update
using (
  user_id = auth.uid()
  and exists (select 1 from matches where matches.id = match_id and now() < matches.kickoff_time)
)
with check (
  user_id = auth.uid()
  and exists (select 1 from matches where matches.id = match_id and now() < matches.kickoff_time)
);
create policy "predictions delete own before kickoff" on predictions for delete
using (
  user_id = auth.uid()
  and exists (select 1 from matches where matches.id = match_id and now() < matches.kickoff_time)
);

create policy "groups create authenticated" on private_groups for insert with check (created_by = auth.uid());
create policy "groups member read" on private_groups for select using (public.is_group_member(id) or created_by = auth.uid());
create policy "groups creator update" on private_groups for update using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "groups creator delete" on private_groups for delete using (created_by = auth.uid());

create policy "group members read same group" on private_group_members for select using (public.is_group_member(group_id));
create policy "group members join self" on private_group_members for insert with check (user_id = auth.uid());
create policy "group members leave self" on private_group_members for delete using (user_id = auth.uid() or public.is_group_creator(group_id));
create policy "group members creator manage" on private_group_members for update using (public.is_group_creator(group_id)) with check (public.is_group_creator(group_id));

create policy "user badges own read" on user_badges for select using (user_id = auth.uid());
create policy "share cards own" on share_cards for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications own" on notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
