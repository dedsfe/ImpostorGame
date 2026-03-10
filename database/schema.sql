-- Schema inicial para o Hub de Jogos
-- Foco: catálogo de conteúdo + sessões opcionais

create table games (
  id integer primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  is_active integer not null default 1,
  created_at text not null,
  updated_at text not null
);

create table categories (
  id integer primary key,
  game_id integer not null references games(id),
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  created_at text not null,
  updated_at text not null,
  unique (game_id, slug)
);

create table difficulties (
  id integer primary key,
  game_id integer not null references games(id),
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  created_at text not null,
  updated_at text not null,
  unique (game_id, slug)
);

create table content_items (
  id integer primary key,
  game_id integer not null references games(id),
  category_id integer references categories(id),
  difficulty_id integer references difficulties(id),
  label text not null,
  source_title text,
  source_studio text,
  metadata_json text,
  is_active integer not null default 1,
  created_at text not null,
  updated_at text not null
);

create index idx_content_items_game on content_items(game_id);
create index idx_content_items_category on content_items(category_id);
create index idx_content_items_difficulty on content_items(difficulty_id);

create table sessions (
  id integer primary key,
  game_id integer not null references games(id),
  session_code text unique,
  status text not null default 'draft',
  settings_json text,
  created_at text not null,
  updated_at text not null
);

create table session_players (
  id integer primary key,
  session_id integer not null references sessions(id),
  display_order integer not null,
  nickname text,
  created_at text not null,
  updated_at text not null
);

create table session_assignments (
  id integer primary key,
  session_id integer not null references sessions(id),
  session_player_id integer references session_players(id),
  assignment_type text not null,
  assignment_value text not null,
  hidden_metadata_json text,
  created_at text not null,
  updated_at text not null
);

-- Exemplos de uso:
-- assignment_type:
--   role
--   secret_word
--   character
--   mimica_word
--
-- metadata_json / hidden_metadata_json:
--   payload flexível para expansão sem quebrar schema
