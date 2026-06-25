insert into teams (id, name, country_code, flag_emoji, group_letter, fifa_ranking_placeholder) values
  ('00000000-0000-0000-0000-0000000000ca', 'Canada', 'CAN', '🇨🇦', 'A', 31),
  ('00000000-0000-0000-0000-0000000000qa', 'Qatar', 'QAT', '🇶🇦', 'A', 58),
  ('00000000-0000-0000-0000-0000000000ar', 'Argentina', 'ARG', '🇦🇷', 'B', 1),
  ('00000000-0000-0000-0000-0000000000jp', 'Japan', 'JPN', '🇯🇵', 'B', 18),
  ('00000000-0000-0000-0000-0000000000br', 'Brazil', 'BRA', '🇧🇷', 'C', 5),
  ('00000000-0000-0000-0000-0000000000en', 'England', 'ENG', '🏴', 'C', 4)
on conflict do nothing;

insert into matches (home_team_id, away_team_id, kickoff_time, venue, city, stage, group_letter, status, home_score, away_score, first_team_to_score_id, player_of_match_name) values
  ('00000000-0000-0000-0000-0000000000ca', '00000000-0000-0000-0000-0000000000qa', '2026-06-16 22:00:00+00', 'BMO Field', 'Toronto', 'group', 'A', 'scheduled', null, null, null, null),
  ('00000000-0000-0000-0000-0000000000ar', '00000000-0000-0000-0000-0000000000jp', '2026-06-17 01:00:00+00', 'MetLife Stadium', 'New York', 'group', 'B', 'scheduled', null, null, null, null),
  ('00000000-0000-0000-0000-0000000000br', '00000000-0000-0000-0000-0000000000en', '2026-06-15 19:00:00+00', 'SoFi Stadium', 'Los Angeles', 'group', 'C', 'live', 1, 1, '00000000-0000-0000-0000-0000000000en', null);

insert into badges (name, description, icon, criteria_key) values
  ('First Prediction', 'Submit your first match prediction.', 'sparkles', 'first_prediction'),
  ('Perfect Score', 'Predict an exact final score.', 'target', 'perfect_score'),
  ('3 Match Streak', 'Correctly predict three match results in a row.', 'flame', 'streak_3'),
  ('5 Match Streak', 'Correctly predict five match results in a row.', 'flame', 'streak_5'),
  ('Upset Genius', 'Correctly call an upset.', 'zap', 'upset_genius'),
  ('Loyal Fan', 'Keep backing your favourite team.', 'heart', 'loyal_fan'),
  ('Top 10 City', 'Reach the top 10 in a city leaderboard.', 'map', 'top_10_city'),
  ('Group Champion', 'Lead a private group.', 'trophy', 'group_champion'),
  ('Final Prophet', 'Correctly predict the final.', 'crown', 'final_prophet')
on conflict do nothing;
