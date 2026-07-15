-- Run after SQL_EDITOR_SETUP.sql in the Supabase SQL Editor.

select 'games' as table_name, count(*) as row_count from public.games
union all
select 'game_tutorials', count(*) from public.game_tutorials
union all
select 'tutorial_steps', count(*) from public.tutorial_steps
union all
select 'role_templates', count(*) from public.role_templates
union all
select 'categories', count(*) from public.categories
union all
select 'difficulties', count(*) from public.difficulties
union all
select 'content_items', count(*) from public.content_items
union all
select 'sessions', count(*) from public.sessions
union all
select 'session_players', count(*) from public.session_players
union all
select 'session_assignments', count(*) from public.session_assignments
order by table_name;

select
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'games',
    'game_tutorials',
    'tutorial_steps',
    'role_templates',
    'categories',
    'difficulties',
    'content_items',
    'sessions',
    'session_players',
    'session_assignments'
  )
order by tablename;

select
  tablename,
  policyname,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

