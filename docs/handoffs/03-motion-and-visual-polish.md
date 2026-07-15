# Handoff 3 de 3: acabamento visual e Motion

Use este arquivo inteiro como prompt de uma nova tarefa.

## Pré-requisito

Comece somente depois que:

1. o Handoff 1 estiver concluído;
2. o Handoff 2 estiver concluído;
3. o usuário tiver testado manualmente o onboarding funcional;
4. os problemas funcionais encontrados pelo usuário estiverem corrigidos.

Leia os dois handoffs anteriores antes de alterar a interface.

Esta etapa não muda regras, persistência ou arquitetura. Ela refina hierarquia,
responsividade, acessibilidade visual e microinterações.

## Antes de trabalhar

1. Leia integralmente o `AGENTS.md`.
2. Confirme que entendeu cada ponto da anti-slop design law.
3. Inspecione o estado atual e preserve os dois handoffs anteriores.
4. Use primeiro o codebase-memory MCP para descobrir o fluxo de renderização.
5. Não altere o algoritmo do baralho.
6. Não mude regras ou introduza novas decisões de produto.
7. Não faça testes automatizados de navegação.

## Objetivo

Fazer o fluxo parecer simples, direto e intencional, com uma tarefa por tela e
microinterações que expliquem mudança de estado sem atrasar a brincadeira.

A identidade deve continuar cinematográfica e própria da Noite de Jogos. Não
transforme o produto em landing page, dashboard ou conjunto de cards genéricos.

## Regra de hierarquia

Cada tela deve ter:

1. contexto curto;
2. uma informação principal;
3. uma ação principal;
4. navegação secundária discreta.

Remova texto ou elementos que repitam a mesma informação. Não adicione decoração
para preencher espaço.

Priorize estas telas:

- criação e edição do grupo;
- resumo do grupo na configuração;
- passagem do aparelho;
- papel revelado;
- `Valendo!`;
- confirmação de resultado;
- resultado e revanche.

## Direção visual

- Preserve a paleta e os assets existentes quando funcionarem.
- Use o nome do jogador como principal elemento da tela de passagem.
- Trate o papel secreto como o artefato central da revelação.
- Use uma coluna focada no mobile.
- Evite formulários excessivamente largos no desktop.
- Mantenha títulos em uma ou duas linhas.
- Prefira superfícies tonais a bordas claras em todos os elementos.
- Use sombras somente se forem pequenas, direcionais e necessárias.
- Dê margem real a todo texto próximo de bordas.
- Verifique centralização matemática e óptica de textos e controles.
- Garanta que nenhuma ação principal fique parcialmente fora de 390 × 844.

Não adicionar:

- pills decorativas;
- chips para cada jogador;
- glows;
- gradientes azul-roxo;
- background de grid;
- cards flutuantes;
- ícones dentro de tiles;
- nova fonte genérica;
- hero de marketing;
- par padrão de botão preenchido e botão contornado;
- hover com salto, escala ou elevação;
- conteúdo escondido por animação de entrada;
- elementos que pareçam clicáveis sem funcionar.

## Motion for JavaScript

Integre Motion como melhoria progressiva.

Não use React, `motion/react`, Motion Primitives ou Tailwind apenas para animação.

Antes de adicionar dependência:

- entenda como os módulos atuais chegam ao navegador;
- prefira a menor integração compatível, como Motion Mini;
- não use URL `latest`;
- não adicione uma CDN capaz de impedir o app de abrir;
- não crie um pipeline de build grande só para animação;
- mantenha o fluxo funcional se Motion falhar ou estiver indisponível.

Se não houver integração local segura sem ampliar muito a arquitetura, documente
o bloqueio e use a Web Animations API existente no navegador. Não degrade a
confiabilidade para cumprir o nome de uma biblioteca.

## Microinterações permitidas

Use movimento somente para explicar estado:

- adicionar uma linha de jogador;
- remover e reorganizar linhas;
- mudar de grupo para configuração;
- trocar o jogador atual;
- revelar o papel;
- ocultar e passar;
- abrir a confirmação;
- organizar o resultado;
- atualizar progresso do baralho.

Parâmetros gerais:

- duração aproximada entre 140 e 240 ms;
- movimento pequeno e direcional;
- conteúdo visível por padrão;
- nunca iniciar conteúdo essencial em `opacity: 0`;
- cancelar animações anteriores em navegação rápida;
- respeitar `prefers-reduced-motion`;
- não usar animação infinita;
- não animar hover com movimento;
- não permitir que uma palavra secreta apareça durante a transição protegida;
- não depender da animação para comunicar estado.

Exemplos de intenção:

- Uma nova pessoa entra na lista e as linhas existentes abrem espaço suavemente.
- O nome do próximo jogador muda com deslocamento curto coerente com a passagem.
- O papel se assenta ao ser revelado, mas já está legível sem a animação.
- A confirmação surge com ajuste mínimo, sem começar invisível.
- O resultado reorganiza informação sem espetáculo ou atraso.

## Responsividade

Em 390 × 844:

- input, lista e ação do grupo permanecem compreensíveis;
- listas longas podem rolar sem cortar controles;
- a ação principal não cobre a lista;
- papel e botão de ocultar cabem sem corte;
- diálogos cabem e continuam roláveis;
- áreas seguras são respeitadas.

No desktop:

- não estique formulários até as bordas;
- não crie um split hero apenas para ocupar espaço;
- mantenha o foco visual no estágio atual;
- evite grandes vazios sem composição.

## Acessibilidade visual e movimento

- Contraste suficiente em todo texto.
- Foco visível e não cortado.
- Touch targets confortáveis.
- Estado `disabled` perceptível sem depender só de opacidade baixa.
- Movimento reduzido realmente remove deslocamentos desnecessários.
- Teclado e leitor de tela preservam a mesma ordem lógica.
- Motion não altera o DOM semântico ou a ordem de foco.

## Testes técnicos

Adicione testes apenas quando a integração de Motion ou helpers tiver lógica
testável. Preserve todos os testes dos handoffs anteriores.

Execute:

```bash
npm test
npm run check
git diff --check
```

Não faça teste automatizado do fluxo, screenshots ou ajustes subjetivos baseados
em browser automation. O usuário fará a validação manual em celular e desktop.

## Fora de escopo

- Novas regras.
- Novas opções de jogo.
- Mudança do schema do grupo.
- Supabase para nomes ou sessões.
- Refatoração do baralho.
- Votação ou placar.
- Commit, push ou PR antes da aprovação manual.

## Critérios de aceite

- O fluxo continua funcionando sem Motion.
- Cada tela mantém uma única ação principal.
- Nenhuma informação essencial fica escondida por animação.
- Movimento reduzido funciona.
- Nenhum conteúdo é cortado em mobile.
- Não existem controles mortos.
- Não há hover lift, glow ou animação ornamental infinita.
- A identidade atual permanece reconhecível.
- Todos os testes técnicos passam.

## Ponto de parada

Ao concluir, pare com o projeto executável e sem commit. Entregue para o usuário
testar manualmente.

Use este formato:

```text
HANDOFF 3 CONCLUÍDO

Base e feedback manual utilizados:
Arquivos alterados:
Integração de Motion escolhida:
Fallback sem Motion:
Microinterações adicionadas:
Ajustes visuais realizados:
Comportamentos funcionais preservados:
Testes executados e resultados:
Pontos para teste manual em mobile:
Pontos para teste manual em desktop:
Estado do git:
Como iniciar o projeto:
Endereço local esperado:
```

Antes de entregar, releia integralmente o `AGENTS.md`. Faça a revisão final ponto
por ponto, corrija todas as violações objetivas e relate qualquer ponto que dependa
de julgamento manual do usuário.
