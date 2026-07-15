# Noite de Jogos

App web local para jogos presenciais de festa:

- `Impostor`
- `Polícia e Ladrão`
- `Cidade Dorme`
- `Quem sou eu?`
- `Mímica Rápida`

## Estrutura atual

O runtime web é modular e continua sem etapa de build:

- `index.html` e `styles.css`
- `script.js`, ponto de entrada do navegador
- `src/app.js`, fluxo da interface
- `src/data/`, catálogo e tutoriais
- `src/viewmodels/`, estado e regras de rodada
- `src/views/`, referências e renderização do DOM

## Organização adicionada

Para preparar a evolução para o app iOS e conteúdo remoto, a base também tem:

- `docs/architecture.md`
- `supabase/`, migrations PostgreSQL, RLS e seed do catálogo
- `backend/`, ferramentas administrativas protegidas
- `database/`, gerador reprodutível das seeds

## Direção de arquitetura

Frontend alvo:

- `models`
  - dados puros, catálogos, entidades e contratos
- `viewmodels`
  - estado de tela, regras de rodada, sincronização de inputs, seleção aleatória
- `views`
  - renderização, telas, bindings de DOM e feedback visual
- `shared`
  - utilitários puros, normalizadores, formatadores e helpers
- `data`
  - pools de palavras, personagens, categorias e dificuldades

Backend:

- Supabase como banco PostgreSQL e Data API
- catálogo público somente para leitura, protegido por RLS
- sessões e atribuições secretas fechadas até a introdução de autenticação
- chave privilegiada restrita às ferramentas de `backend/`

## Inicializar o Supabase

As instruções e o arquivo único para o SQL Editor estão em
`supabase/README.md` e `supabase/SQL_EDITOR_SETUP.sql`.
