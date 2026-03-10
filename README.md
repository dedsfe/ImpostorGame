# Hub de Jogos

App web local para jogos presenciais de festa:

- `Impostor`
- `Polícia e Ladrão`
- `Cidade Dorme`
- `Quem sou eu?`
- `Mímica Rápida`

## Estrutura atual

Hoje o runtime do app continua simples para não quebrar o localhost:

- `index.html`
- `styles.css`
- `script.js`

## Organização adicionada

Para preparar a evolução para MVVM, backend e banco, a base agora também tem:

- `docs/architecture.md`
- `backend/`
- `database/`

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

Backend alvo:

- catálogo central de jogos, categorias, palavras e personagens
- sessões de jogo opcionais
- persistência de conteúdo e administração futura

Banco alvo:

- catálogo unificado de conteúdo por jogo
- categorias
- dificuldades
- sessões e composição de rodada quando necessário

## Próximo passo recomendado

Migrar o monolito de `script.js` para módulos ES seguindo:

1. `src/data/catalogs.js`
2. `src/shared/helpers.js`
3. `src/viewmodels/game-session.js`
4. `src/views/dom.js`
5. `src/app.js`
