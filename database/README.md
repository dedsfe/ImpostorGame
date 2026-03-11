# Database

Esta pasta concentra a base relacional da `Noite de Jogos`.

## Objetivo desta etapa

Sair do hardcode puro de frontend e preparar uma fonte centralizada para:

- jogos e metadados do hub
- tutoriais de `Como jogar`
- categorias e dificuldades
- bancos de palavras e personagens
- papéis-base dos jogos sociais
- futuras sessões com distribuição persistida

## Arquivos

- `schema.sql`
  - schema relacional atual
- `migrations/001_catalog_seed.sql`
  - seed gerada a partir dos catálogos atuais do frontend
- `scripts/build-seed.mjs`
  - gerador da seed SQL

## Como regenerar a seed

```bash
node database/scripts/build-seed.mjs
```

## Como validar localmente com SQLite

```bash
sqlite3 /tmp/noite-de-jogos.db < database/schema.sql
sqlite3 /tmp/noite-de-jogos.db < database/migrations/001_catalog_seed.sql
```

## Tabelas principais

- `games`
  - catálogo do hub e capacidades de cada jogo
- `game_tutorials`
  - tutorial principal por jogo
- `tutorial_steps`
  - passos curtos do modal `Como jogar`
- `role_templates`
  - papéis base de jogos como `Impostor`, `Polícia e Ladrão` e `Cidade Dorme`
- `categories`
  - categorias por jogo
- `difficulties`
  - dificuldades por jogo quando existirem
- `content_items`
  - palavras, personagens e entradas de mímica
- `sessions`, `session_players`, `session_assignments`
  - base para persistir rodadas no futuro
