# Arquitetura

## Objetivo

Organizar o projeto Noite de Jogos em uma arquitetura incremental, mantendo o app atual estável e abrindo caminho para:

- MVVM no frontend
- backend separado por módulos
- banco de dados para catálogo e sessões

## Estado atual

O app web roda sem build, mas já está dividido em módulos ES:

- `src/data` concentra catálogo e tutoriais;
- `src/viewmodels` concentra estado e criação de partidas;
- `src/views` concentra referências do DOM;
- `src/app.js` ainda concentra boa parte da orquestração da interface.

O Supabase é o backend canônico. As migrations ficam em `supabase/`, enquanto
`backend/` contém somente rotinas administrativas que usam a chave secreta.

## Segurança do backend

- o catálogo ativo é legível por `anon` e `authenticated`;
- nenhuma escrita pública é permitida no catálogo;
- sessões, jogadores e atribuições não têm acesso público;
- a chave `publishable` pertence ao site e ao app iOS;
- a chave `secret` pertence somente ao backend ou a Edge Functions;
- futuras sessões remotas exigirão Supabase Auth e políticas por proprietário.

## Arquitetura alvo de frontend

### View

Responsável por:

- HTML e CSS
- renderização de tela
- atualização visual
- binding de botões e inputs

Arquivos alvo:

- `src/views/dom-elements.js`
- `src/views/hero-view.js`
- `src/views/game-flow-view.js`
- `src/views/whoami-view.js`
- `src/views/mimica-view.js`

### ViewModel

Responsável por:

- estado da aplicação
- estado de cada jogo
- validação de setup
- sorteio de papéis, palavras e personagens
- composição de rodada

Arquivos alvo:

- `src/viewmodels/app-session.js`
- `src/viewmodels/impostor-viewmodel.js`
- `src/viewmodels/police-viewmodel.js`
- `src/viewmodels/city-viewmodel.js`
- `src/viewmodels/whoami-viewmodel.js`
- `src/viewmodels/mimica-viewmodel.js`

### Model

Responsável por:

- catálogos de conteúdo
- contratos de dados
- entidades conceituais

Arquivos alvo:

- `src/models/game.js`
- `src/models/category.js`
- `src/models/content-item.js`
- `src/models/session.js`

### Shared

Responsável por:

- aleatoriedade
- formatação
- clamp e normalização
- utilitários puros

Arquivos alvo:

- `src/shared/random.js`
- `src/shared/formatters.js`
- `src/shared/normalizers.js`

### Data

Responsável por:

- pools de palavras
- pools de personagens
- categorias
- dificuldades
- textos de apoio

Arquivos alvo:

- `src/data/word-pools.js`
- `src/data/character-pools.js`
- `src/data/game-configs.js`

## Fluxo de dados sugerido

1. A `View` recebe interação do usuário.
2. A `View` chama o `ViewModel`.
3. O `ViewModel` valida, atualiza estado e resolve regras de rodada.
4. O `ViewModel` busca dados nos `Models/Data`.
5. A `View` renderiza o novo estado.

## Arquitetura do backend administrativo

O Supabase fornece PostgreSQL, Data API e autenticação. Código Node privilegiado
continua organizado por módulos de negócio, não por tipo técnico puro.

Estrutura recomendada:

```text
backend/
  src/
    http/
      routes/
      controllers/
      middlewares/
    modules/
      catalog/
        application/
        domain/
        infra/
      sessions/
        application/
        domain/
        infra/
      games/
        application/
        domain/
        infra/
    shared/
      db/
      env/
      errors/
      utils/
```

## Responsabilidades do backend

### Módulo `catalog`

- listar jogos
- listar categorias
- listar dificuldades
- listar palavras e personagens por jogo
- alimentar o frontend com conteúdo sem depender de hardcode

### Módulo `games`

- metadados de cada jogo
- regras configuráveis
- limites mínimos e máximos

### Módulo `sessions`

- criar sessão opcional
- salvar configuração da rodada
- registrar composição da rodada
- permitir futura sincronização entre dispositivos

## Organização de banco

O banco precisa suportar dois casos:

- catálogo estático de conteúdo
- sessões opcionais de jogo

Principais entidades:

- `games`
- `categories`
- `difficulties`
- `content_items`
- `sessions`
- `session_players`
- `session_assignments`

Detalhamento inicial do schema está em:

- `database/schema.sql`

## Estratégia incremental

### Fase 1

- manter app atual funcionando
- documentar estrutura alvo
- preparar backend e database

### Fase 2

- extrair catálogos de `script.js`
- extrair utilitários puros
- extrair estado e regras para viewmodels

### Fase 3

- introduzir backend para catálogo
- mover pools do frontend para banco/API

### Fase 4

- adicionar sessões persistidas
- eventual sincronização entre aparelhos
