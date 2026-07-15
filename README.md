# Noite de Jogos

Site de jogos presenciais para jogar usando um único celular:

- Impostor
- Polícia e Ladrão
- Cidade Dorme
- Quem sou eu?
- Mímica Rápida

## Começar

```bash
npm run dev
```

O comando inicia o ambiente local da Vercel. As variáveis públicas do Supabase
ficam no Vercel e em `.env.local`, que nunca deve entrar no Git.

## Verificar tudo

```bash
npm run check
```

Esse é o comando que deve passar antes de qualquer commit.

## Estrutura

```text
index.html                 telas e conteúdo visual
styles.css                estilos
src/app.js                inicialização, hub e fluxo compartilhado
src/state.js              estado inicial
src/games/                um módulo por jogo
src/data/                 catálogo e tutoriais
src/shared/utils.js       funções reutilizadas
src/views/elements.js     referências do HTML
api/catalog.js            endpoint público da Vercel
server/catalog-snapshot.cjs
supabase/                 schema, migrations e verificação
```

Para alterar um jogo, comece pelo arquivo com seu nome em `src/games/`. Consulte
`src/README.md` para adicionar um jogo novo.

## Catálogo

O site tenta carregar o catálogo do Supabase em segundo plano. Se a rede ou a
API falhar, o catálogo local assume imediatamente.

Para regenerar as migrations do catálogo:

```bash
npm run catalog:build
```

Os arquivos SQL gerados não devem ser editados manualmente.

## Segurança

- O navegador usa somente a chave publicável do Supabase.
- A chave secreta é aceita apenas pelas ferramentas administrativas em
  `backend/`.
- O catálogo é público somente para leitura e protegido por RLS.
- Sessões de jogo continuam locais; nenhuma atribuição secreta é enviada ao
  banco.

Veja `docs/architecture.md` para as decisões técnicas do projeto.
