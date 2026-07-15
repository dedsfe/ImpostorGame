# Supabase

Esta pasta é a fonte canônica do banco PostgreSQL da Noite de Jogos.

## Aplicar pelo SQL Editor

Para um projeto Supabase vazio:

1. Abra **SQL Editor → New query**.
2. Copie todo o conteúdo de `SQL_EDITOR_SETUP.sql`.
3. Cole no editor e clique em **Run**.
4. Abra uma segunda query, cole `verify.sql` e execute a validação.

`SQL_EDITOR_SETUP.sql` é um bundle gerado das duas migrations abaixo:

1. `migrations/20260715000100_initial_schema.sql`;
2. `migrations/20260715000200_catalog_seed.sql`.

O bundle pode ser executado novamente. O schema usa `if not exists`, recria
triggers e políticas com segurança, e a seed atualiza registros pelos IDs
estáveis.

## Segurança adotada

- RLS está habilitado em todas as tabelas.
- `anon` e `authenticated` recebem somente leitura do catálogo ativo.
- escrita no catálogo exige backend/Edge Function privilegiado.
- `sessions`, `session_players` e `session_assignments` não têm política
  pública e permanecem inacessíveis pelo site.
- a chave secreta nunca aparece nas migrations ou no frontend.

As tabelas de sessão só devem ser abertas depois da implementação de Supabase
Auth e de políticas baseadas no proprietário da sessão. Isso evita que um
jogador consulte papéis ou palavras secretas de outra pessoa.

## Conteúdo inicial esperado

| Tabela | Registros |
|---|---:|
| `games` | 5 |
| `game_tutorials` | 5 |
| `tutorial_steps` | 15 |
| `role_templates` | 8 |
| `categories` | 19 |
| `difficulties` | 6 |
| `content_items` | 4.716 |

Distribuição atual do conteúdo:

| Jogo | Itens |
|---|---:|
| Impostor | 328 |
| Quem sou eu? | 1.257 |
| Mímica Rápida | 3.131 |

## Chaves

- Site e iOS: chave `publishable`.
- Backend e Edge Functions: chave `secret`, somente por variável de ambiente.

Antes de configurar o backend local, revogue a chave secreta que foi exposta
e gere uma nova no painel do Supabase.
