# Backend

Esta pasta prepara a organização do backend da Noite de Jogos.

## Objetivo

Centralizar:

- catálogo de jogos
- categorias
- dificuldades
- palavras e personagens
- sessões de jogo futuras

## Estrutura recomendada

```text
backend/
  src/
    http/
      routes/
      controllers/
      middlewares/
    modules/
      catalog/
      games/
      sessions/
    shared/
      db/
      env/
      errors/
      utils/
```

## Regras de organização

- separar por módulo de negócio primeiro
- usar `application`, `domain` e `infra` dentro de cada módulo
- evitar controllers acessando banco diretamente
- concentrar queries e persistência em `infra`
- manter contratos compartilhados em `shared`

## Escopo inicial do backend

### `catalog`

- jogos disponíveis no hub
- categorias por jogo
- dificuldades por jogo
- conteúdo de palavras e personagens

### `games`

- regras mínimas e máximas
- metadados de cada modo

### `sessions`

- configuração de rodada
- composição de papéis
- futura persistência de partidas
