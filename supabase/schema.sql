create extension if not exists "pgcrypto";

create type prediction_style as enum ('Safe', 'Bold', 'Chaos', 'Defensive', 'Neutral');
create type match_status as enum ('scheduled', 'live', 'completed');
create type match_stage as enum ('group', 'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'final');
create type predicted_result as enum ('home', 'draw', 'away');
create type goals_range as enum ('0-1', '2-3', '4+');
create type group_role as enum ('creator', 'member');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  favourite_team_id uuid,
  supported_country text not null,
  city text not null,
  country text not null,
  school_or_workplace text,
  prediction_style prediction_style not null default 'Neutral',
  total_points integer not null default 0,
  accuracy_percentage numeric(5,2) not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null,
  flag_emoji text not null,
  group_letter text,
  fifa_ranking_placeholder integer
);

alter table profiles
  add constraint profiles_favourite_team_fk foreign key (favourite_team_id) references teams(id) on delete set null;

create table matches (
  id uuid primary key default gen_random_uuid(),
  home_team_id uuid not null references teams(id),
  away_team_id uuid not null references teams(id),
  kickoff_time timestamptz not null,
  venue text not null,
  city text not null,
  stage match_stage not null,
  group_letter text,
  status match_status not null default 'scheduled',
  home_score integer check (home_score is null or home_score >= 0),
  away_score integer check (away_score is null or away_score >= 0),
  first_team_to_score_id uuid references teams(id),
  player_of_match_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);

create table predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id uuid not null references matches(id) on delete cascade,
  predicted_home_score integer not null check (predicted_home_score between 0 and 20),
  predicted_away_score integer not null check (predicted_away_score between 0 and 20),
  predicted_result predicted_result not null,
  predicted_first_team_to_score_id uuid not null references teams(id),
  predicted_total_goals_range goals_range not null,
  predicted_player_of_match text not null,
  confidence_percentage integer not null check (confidence_percentage between 0 and 100),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, match_id)
);

create table prediction_scores (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null unique references predictions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id uuid not null references matches(id) on delete cascade,
  result_points integer not null default 0,
  exact_score_points integer not null default 0,
  first_goal_points integer not null default 0,
  total_goals_points integer not null default 0,
  player_of_match_points integer not null default 0,
  confidence_points integer not null default 0,
  streak_bonus_points integer not null default 0,
  total_points integer not null default 0,
  scored_at timestamptz not null default now()
);

create table leaderboards_cache (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  scope_value text not null default 'global',
  user_id uuid not null references auth.users(id) on delete cascade,
  rank integer not null,
  display_name text not null,
  favourite_team text,
  points integer not null,
  accuracy numeric(5,2) not null,
  current_streak integer not null,
  predictions_made integer not null,
  refreshed_at timestamptz not null default now(),
  unique (scope, scope_value, user_id)
);

create table private_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table private_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references private_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role group_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table fan_confidence_snapshots (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  home_win_percentage numeric(5,2) not null default 0,
  draw_percentage numeric(5,2) not null default 0,
  away_win_percentage numeric(5,2) not null default 0,
  average_home_confidence numeric(5,2) not null default 0,
  average_away_confidence numeric(5,2) not null default 0,
  total_predictions integer not null default 0,
  created_at timestamptz not null default now()
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  icon text not null,
  criteria_key text not null unique
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table share_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function set_prediction_locked_at()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from matches where id = new.match_id and now() >= kickoff_time) then
    new.locked_at = coalesce(new.locked_at, now());
  end if;
  return new;
end;
$$;

create trigger predictions_set_locked_at
before insert or update on predictions
for each row execute function set_prediction_locked_at();

create index matches_status_kickoff_idx on matches(status, kickoff_time);
create index predictions_user_idx on predictions(user_id);
create index predictions_match_idx on predictions(match_id);
create index leaderboards_scope_idx on leaderboards_cache(scope, scope_value, rank);
create index private_group_members_user_idx on private_group_members(user_id);
create index fan_confidence_match_idx on fan_confidence_snapshots(match_id, created_at desc);
