pragma foreign_keys = on;

-- Schema da Noite de Jogos
-- Foco desta versão:
-- 1. Catálogo centralizado por jogo
-- 2. Tutoriais e passos reutilizáveis
-- 3. Categorias, dificuldades e bancos de conteúdo
-- 4. Base para futuras sessões distribuídas

create table games (
  id integer primary key,
  slug text not null unique,
  name text not null,
  short_description text not null,
  setup_screen text not null,
  card_image_path text,
  modal_image_path text,
  min_players integer,
  max_players integer,
  supports_categories integer not null default 0 check (supports_categories in (0, 1)),
  supports_difficulties integer not null default 0 check (supports_difficulties in (0, 1)),
  supports_timer integer not null default 0 check (supports_timer in (0, 1)),
  is_active integer not null default 1 check (is_active in (0, 1)),
  created_at text not null,
  updated_at text not null
);

create table game_tutorials (
  id integer primary key,
  game_id integer not null unique references games(id) on delete cascade,
  title text not null,
  copy text not null,
  created_at text not null,
  updated_at text not null
);

create table tutorial_steps (
  id integer primary key,
  tutorial_id integer not null references game_tutorials(id) on delete cascade,
  step_order integer not null,
  title text not null,
  copy text not null,
  created_at text not null,
  updated_at text not null,
  unique (tutorial_id, step_order)
);

create table role_templates (
  id integer primary key,
  game_id integer not null references games(id) on delete cascade,
  slug text not null,
  name text not null,
  badge text,
  title text not null,
  description text not null,
  tone text not null,
  sort_order integer not null default 0,
  is_active integer not null default 1 check (is_active in (0, 1)),
  created_at text not null,
  updated_at text not null,
  unique (game_id, slug)
);

create table categories (
  id integer primary key,
  game_id integer not null references games(id) on delete cascade,
  slug text not null,
  name text not null,
  content_kind text not null,
  sort_order integer not null default 0,
  is_active integer not null default 1 check (is_active in (0, 1)),
  created_at text not null,
  updated_at text not null,
  unique (game_id, slug)
);

create table difficulties (
  id integer primary key,
  game_id integer not null references games(id) on delete cascade,
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  is_active integer not null default 1 check (is_active in (0, 1)),
  created_at text not null,
  updated_at text not null,
  unique (game_id, slug)
);

create table content_items (
  id integer primary key,
  game_id integer not null references games(id) on delete cascade,
  category_id integer references categories(id) on delete set null,
  difficulty_id integer references difficulties(id) on delete set null,
  content_kind text not null,
  label text not null,
  normalized_label text not null,
  source_title text,
  source_studio text,
  metadata_json text,
  sort_order integer not null default 0,
  is_active integer not null default 1 check (is_active in (0, 1)),
  created_at text not null,
  updated_at text not null
);

create index idx_categories_game on categories(game_id);
create index idx_difficulties_game on difficulties(game_id);
create index idx_role_templates_game on role_templates(game_id);
create index idx_tutorial_steps_tutorial on tutorial_steps(tutorial_id);
create index idx_content_items_game on content_items(game_id);
create index idx_content_items_category on content_items(category_id);
create index idx_content_items_difficulty on content_items(difficulty_id);
create index idx_content_items_normalized_label on content_items(normalized_label);

create table sessions (
  id integer primary key,
  game_id integer not null references games(id) on delete cascade,
  session_code text unique,
  status text not null default 'draft',
  settings_json text,
  created_at text not null,
  updated_at text not null
);

create table session_players (
  id integer primary key,
  session_id integer not null references sessions(id) on delete cascade,
  display_order integer not null,
  nickname text,
  created_at text not null,
  updated_at text not null
);

create table session_assignments (
  id integer primary key,
  session_id integer not null references sessions(id) on delete cascade,
  session_player_id integer references session_players(id) on delete set null,
  role_template_id integer references role_templates(id) on delete set null,
  content_item_id integer references content_items(id) on delete set null,
  assignment_type text not null,
  assignment_value text not null,
  hidden_metadata_json text,
  created_at text not null,
  updated_at text not null
);

create index idx_sessions_game on sessions(game_id);
create index idx_session_players_session on session_players(session_id);
create index idx_session_assignments_session on session_assignments(session_id);
create index idx_session_assignments_player on session_assignments(session_player_id);

-- assignment_type sugeridos:
--   role
--   secret_word
--   character
--   mimica_word
--
-- content_kind sugeridos:
--   secret_word
--   character
--   mimica_word
