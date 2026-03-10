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

O app atual ainda executa via:

- `index.html`
- `styles.css`
- `script.js`

Essa pasta existe para orientar a migração sem quebrar o comportamento já validado.
