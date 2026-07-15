# Handoff 2 de 3: onboarding do grupo e integração funcional

Use este arquivo inteiro como prompt de uma nova tarefa.

## Pré-requisito

Comece somente depois que o Handoff 1 estiver concluído e aprovado. Leia o
resumo deixado pela etapa anterior antes de alterar código.

Esta etapa cria o novo fluxo funcional. Não adiciona Motion e não faz o
acabamento visual final.

## Antes de trabalhar

1. Leia integralmente o `AGENTS.md`.
2. Confirme que entendeu cada ponto da anti-slop design law.
3. Inspecione o estado atual e preserve as mudanças do Handoff 1.
4. Use primeiro o codebase-memory MCP para localizar controllers e fluxos.
5. Não altere o algoritmo do baralho do Impostor.
6. Preserve as regras, a confirmação de resultado e a proteção de segredos do
   commit `4e374b2`.
7. Não faça testes automatizados de navegação.

## Objetivo

Criar uma experiência progressiva, com uma tarefa clara por tela:

```text
Escolher jogo
  -> montar o grupo, apenas se ainda não existir
  -> configurar o jogo
  -> distribuir papéis ou iniciar a atividade
  -> jogar
  -> ver o resultado
```

O onboarding não é uma sequência de slides. A pessoa já está montando o grupo
real da noite.

## Entrada no grupo

Na primeira tentativa de iniciar qualquer jogo, se ainda não existir grupo na
sessão, abrir a tela:

```text
Quem vai jogar?

Adicione as pessoas que estão nesta rodada.

Nome do jogador
[____________________] [Adicionar]

André                                  Remover
Matheus                                Remover
Júnior                                 Remover

[Continuar com 3 jogadores]

Usar apenas números
```

Comportamento:

- Enter adiciona o nome.
- O campo é limpo após adicionar.
- O foco retorna ao campo.
- Cada pessoa ocupa uma linha, não um chip.
- A remoção tem alvo de toque confortável.
- O nome acessível deve ser `Remover André`, não apenas `x`.
- O botão principal adapta quantidade e plural.
- A quantidade mínima respeita o jogo selecionado.
- A mensagem de erro explica quantas pessoas faltam.
- Depois de concluir o grupo, retomar automaticamente o jogo originalmente
  selecionado.

## Modo sem nomes

`Usar apenas números` é uma saída secundária.

Ao escolher essa opção:

1. Solicitar apenas a quantidade.
2. Gerar `Jogador 1`, `Jogador 2` etc.
3. Salvar o grupo com modo `numbered`.
4. Usar exatamente o mesmo fluxo dos grupos nomeados.

Não obrigue o usuário a decidir entre dois modos antes de entender a tela.

## Grupo existente

Se já existir grupo, não reabrir o onboarding.

Na configuração do jogo, mostrar apenas um resumo compacto:

```text
5 jogadores
André, Matheus, Júnior, Keyla e Bluk

Editar grupo
```

Editar fora de uma rodada é imediato.

Editar durante distribuição ou rodada ativa exige confirmação clara de que os
papéis atuais serão descartados. Confirmando, cancelar a rodada e voltar para a
configuração. Nunca adapte papéis já sorteados a uma lista diferente.

## Snapshot da rodada

Ao iniciar um jogo, capture a lista atual do grupo. A ordem dessa lista define a
ordem de passagem do aparelho.

Mudanças posteriores no grupo não podem alterar uma rodada já iniciada.

Não adicione drag and drop, ordenação ou sorteio de ordem nesta etapa.

## Integração com Impostor

No fluxo padrão, remover controles redundantes de quantidade e identificação por
nome. Esses valores vêm do grupo.

A configuração principal deve conter:

- resumo do grupo;
- tema;
- progresso do baralho;
- `Começar`.

Em opções avançadas, manter apenas o que realmente pertence ao Impostor:

- número de impostores;
- palavra personalizada;
- reiniciar histórico.

Distribuição nomeada:

```text
Passe o celular para Matheus

Só Matheus deve olhar a próxima tela.

[Ver meu papel]
```

Depois da revelação:

```text
Sua palavra é

TELECINESE

[Ocultar e passar para Júnior]
```

Último jogador:

```text
[Ocultar e começar]
```

No modo numerado, use os mesmos textos com `Jogador 1`, `Jogador 2` etc.

Preserve integralmente:

- bloqueio contra pular papel;
- palavra e papéis fora do DOM antes do momento permitido;
- tela `Valendo!`;
- confirmação antes do resultado;
- resultado objetivo;
- revanche;
- fila de palavras;
- palavra personalizada sem consumir o baralho.

`Jogar outra` reutiliza o mesmo snapshot, salvo se o grupo tiver sido editado.

## Integração com os demais jogos

Use a mesma fonte global de jogadores nos jogos que já dependem de quantidade,
papéis individuais ou turnos.

Integre funcionalmente, nesta ordem:

1. Polícia e Ladrão.
2. Cidade Dorme.
3. Quem Sou Eu, se o fluxo atual tiver um jogador da vez.
4. Mímica, se o fluxo atual tiver um participante da vez.

Não invente mecânicas para forçar nomes onde eles não agregam. Se um jogo ainda
não puder consumir o grupo sem mudar suas regras, mantenha-o funcional e registre
essa limitação no handoff.

O grupo global deve, no mínimo, substituir quantidades duplicadas onde isso for
seguro e fornecer nomes para toda distribuição compartilhada por
`src/role-flow.js`.

## Hierarquia e linguagem

Uma tela deve responder imediatamente:

- onde estou;
- o que está acontecendo;
- o que faço agora;
- o que acontece depois.

Use títulos contextuais:

- `Quem vai jogar?`
- `Prepare a rodada`
- `Passe para Matheus`
- `Matheus, veja seu papel`
- `Valendo!`
- `Resultado`

Durante distribuição, um progresso curto é suficiente:

```text
Matheus · 2 de 5
```

Não adicione um stepper visual pesado nesta etapa.

## Direção visual funcional

- Uma ação principal por tela.
- Texto curto.
- Mobile-first.
- Nomes em linhas, não pills.
- Sem novos cards para cada informação.
- Sem hero de marketing dentro do jogo.
- Sem glows ou gradientes azul-roxo.
- Sem hover lift.
- Sem conteúdo começando invisível.
- Sem texto ou controles cortados.
- Sem nova fonte.
- Preserve a identidade atual até o acabamento do Handoff 3.

## Acessibilidade

- Label real no campo de nome.
- Enter para adicionar.
- Foco previsível após adicionar e remover.
- Botões de remoção com nome acessível.
- Foco reposicionado ao trocar de tela.
- Diálogos com captura e retorno de foco.
- Alvos de toque confortáveis.
- Mensagens de validação associadas ao campo.
- Nenhum controle interativo dentro do label de outro controle.
- Nenhum segredo presente no DOM antes da revelação.

## Testes técnicos

Adicione ou atualize testes para:

- interceptar o primeiro jogo quando não há grupo;
- retomar o jogo escolhido após criar o grupo;
- não mostrar onboarding quando o grupo existe;
- modo nomeado e numerado;
- quantidade derivada;
- validação mínima por jogo;
- snapshot da rodada;
- edição do grupo invalidando rodada ativa;
- Impostor consumindo nomes e quantidade do grupo;
- revanche preservando snapshot;
- demais controllers integrados;
- baralho e proteções existentes sem regressão.

Execute somente:

```bash
npm test
npm run check
git diff --check
```

Não use browser automation, screenshots ou cliques automatizados. O usuário fará
o teste manual.

## Fora de escopo

- Motion.
- Refinamento visual amplo.
- Animações.
- Persistência em Supabase.
- Sincronização entre aparelhos.
- Votação ou placar no celular.
- Commit, push ou PR.

## Critérios de aceite

- A primeira entrada cria o grupo e retoma o jogo escolhido.
- A quantidade não é solicitada duas vezes.
- O grupo é reutilizado entre jogos.
- O nome correto aparece em cada passagem do celular.
- Editar o grupo não corrompe uma rodada ativa.
- O Impostor mantém todas as proteções e regras atuais.
- O modo numerado funciona sem nomes.
- O aplicativo continua utilizável sem animações.
- Todos os testes técnicos passam.

## Ponto de parada

Ao concluir, pare com o projeto executável, sem commit e sem push. Não avance para
Motion ou polimento subjetivo.

Entregue este resumo para o Handoff 3:

```text
HANDOFF 2 CONCLUÍDO

Base e Handoff 1 utilizados:
Arquivos alterados:
Fluxo de criação e edição do grupo:
Integração do Impostor:
Outros jogos integrados:
Jogos não integrados e motivo:
Testes executados e resultados:
Riscos ou pontos para teste manual:
Estado do git:
Como iniciar o projeto:
Endereço local esperado:
```

Antes de entregar, releia o `AGENTS.md`, revise todos os pontos aplicáveis e
corrija violações objetivas. Deixe decisões subjetivas para o teste do usuário.
