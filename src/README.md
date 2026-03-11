# Frontend MVVM

Esta pasta prepara a migração do frontend para uma estrutura MVVM incremental.

## Estrutura alvo

```text
src/
  data/
  models/
  shared/
  viewmodels/
  views/
```

## Responsabilidade por camada

- `data`
  - catálogos de palavras, personagens, categorias e dificuldades
- `models`
  - contratos de dados e entidades conceituais
- `shared`
  - utilitários puros e helpers
- `viewmodels`
  - estado e regras do fluxo de jogo
- `views`
  - renderização, bindings e telas

## Observação

Entrada atual:

- `index.html`
- `script.js`

Módulos já extraídos:

- `src/app.js`
- `src/data/catalogs.js`
- `src/data/tutorials.js`
- `src/shared/utils.js`
- `src/viewmodels/app-state.js`
- `src/viewmodels/game-factories.js`
- `src/views/elements.js`

O CSS ainda permanece em `styles.css` na raiz, e parte da lógica de UI continua em `src/app.js`.
