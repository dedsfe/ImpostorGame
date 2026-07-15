# Frontend

O frontend usa módulos JavaScript simples, sem framework e sem etapa de build.
Código relacionado a um jogo fica junto no arquivo daquele jogo.

## Estrutura

```text
src/
  app.js
  state.js
  games/
    impostor.js
    police.js
    city.js
    mimica.js
    whoami.js
  data/
  shared/
  views/
```

## Onde alterar

- `app.js`: inicialização, hub e fluxo compartilhado de revelação de papéis.
- `state.js`: estado inicial da aplicação.
- `games/`: regras, controles e eventos específicos de cada jogo.
- `data/`: catálogo remoto, fallback local e textos de tutorial.
- `shared/`: funções pequenas que mais de um jogo utiliza.
- `views/elements.js`: referências dos elementos existentes no HTML.

## Adicionar um jogo

1. Crie `games/novo-jogo.js`.
2. Exporte um controller com `id`, `setupScreen`, `bind`, `initialize` e
   `openSetup`.
3. Registre o controller na lista `gameControllers` em `app.js`.
4. Adicione a tela no HTML e suas referências em `views/elements.js`.
5. Cubra as regras puras com testes em `test/game-rules.test.mjs`.

Não crie uma camada, classe ou serviço novo até existir uma necessidade concreta
que não caiba claramente em um desses lugares.
