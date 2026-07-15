# Catálogo e geração de seeds

Os catálogos JavaScript em `src/data/` ainda são a fonte usada pelo site. O
gerador desta pasta transforma esse conteúdo em seeds reprodutíveis para:

- SQLite, apenas para validação local e compatibilidade;
- PostgreSQL/Supabase, que é o banco canônico daqui para frente.

## Regenerar as seeds

```bash
node database/scripts/build-seed.mjs
```

O comando atualiza:

- `database/migrations/001_catalog_seed.sql`;
- `supabase/migrations/20260715000200_catalog_seed.sql`;
- `supabase/SQL_EDITOR_SETUP.sql`.

Nunca edite esses três arquivos gerados manualmente. Altere os catálogos em
`src/data/` ou o próprio gerador e execute o comando novamente.

## SQLite local

`schema.sql` é mantido como schema auxiliar SQLite. Ele não deve ser colado no
Supabase.

```bash
sqlite3 /tmp/noite-de-jogos.db < database/schema.sql
sqlite3 /tmp/noite-de-jogos.db < database/migrations/001_catalog_seed.sql
```

As migrations oficiais do backend ficam em `supabase/migrations/`.
