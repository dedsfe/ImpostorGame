# Arquitetura simples

## Decisão

O site usa módulos organizados por jogo, não MVVM formal.

Cada jogo concentra suas regras, validação, eventos e telas relacionadas em um
arquivo dentro de `src/games/`. O `src/app.js` mantém somente o que é realmente
compartilhado: hub, navegação, modais e distribuição de papéis.

Essa organização foi escolhida porque responde diretamente à pergunta mais
comum de manutenção: “onde altero este jogo?”.

## Contrato de um jogo

Cada controller registrado no site expõe:

```js
{
  id,
  setupScreen,
  bind,
  initialize,
  openSetup,
  cleanup // opcional
}
```

- `bind`: conecta os eventos uma única vez.
- `initialize`: ajusta valores iniciais e pode ser chamado após atualizar o
  catálogo.
- `openSetup`: abre o jogo a partir do hub ou de “jogar novamente”.
- `cleanup`: encerra recursos como timers ao sair do jogo.

Adicionar um jogo significa criar um módulo, implementar esse contrato e
registrá-lo em `gameControllers`.

## Separação mantida

- Regras e cálculos são funções puras sempre que possível.
- Controllers traduzem eventos do DOM para regras do jogo.
- O estado compartilhado fica em `src/state.js`.
- Funções usadas por mais de um jogo ficam em `src/shared/utils.js`.
- Referências ao HTML ficam em `src/views/elements.js`.

Não criamos classes, repositories, services ou novas camadas preventivamente.

## Catálogo e backend

O Supabase é o catálogo canônico de produção. A função da Vercel em
`api/catalog.js` entrega um snapshot compatível com o site. O catálogo local é
um fallback para o jogo continuar abrindo sem rede.

O acesso público é somente leitura. Ferramentas que usam a chave secreta ficam
isoladas em `backend/` e não são enviadas no deploy do site.

As tabelas de sessões estão fechadas e não fazem parte do runtime atual. Só
serão ativadas quando existir uma funcionalidade concreta de sincronização
entre aparelhos.

## App iOS

O futuro app SwiftUI pode usar MVVM leve porque o padrão combina com o ciclo de
estado e renderização da plataforma. O site não precisa imitar a arquitetura do
iOS.

As duas plataformas compartilharão:

- schema e catálogo do Supabase;
- nomes e contratos dos jogos;
- regras documentadas;
- casos de teste equivalentes.

Não tentaremos compartilhar código JavaScript com Swift.

## Regras para manter simples

1. Um jogo novo começa com um único módulo.
2. Uma função só vai para `shared/` depois de ser usada por mais de um jogo.
3. Regras devem ser testáveis sem navegador.
4. Todo commit precisa passar em `npm run check`.
5. Não adicionar dependência ou camada sem um problema atual que a justifique.
