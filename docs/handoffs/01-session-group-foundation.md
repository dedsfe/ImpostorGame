# Handoff 1 de 3: fundação do grupo da sessão

Use este arquivo inteiro como prompt de uma nova tarefa.

## Contexto

Continue a partir da branch `codex/supabase-foundation`. O checkpoint anterior é
o commit `4e374b2`, que concluiu a primeira revisão funcional do Impostor.

Esta etapa cria somente a fundação de dados do grupo compartilhado. Não cria o
novo onboarding, não redesenha telas e não adiciona animações.

## Antes de trabalhar

1. Leia integralmente o `AGENTS.md`.
2. Confirme que entendeu cada ponto da anti-slop design law.
3. Inspecione o estado atual e preserve mudanças existentes do usuário.
4. Use primeiro o codebase-memory MCP para descobrir e rastrear código.
5. Leia `docs/architecture.md` e preserve a arquitetura simples do projeto.
6. Não altere o algoritmo do baralho do Impostor.
7. Não faça testes automatizados de navegação.

## Objetivo

Criar uma fonte única e reutilizável para o grupo da sessão da Noite de Jogos.

Os nomes pertencem à sessão, não a um jogo específico. O mesmo grupo poderá ser
consumido pelo Impostor, Polícia e Ladrão, Cidade Dorme e outros jogos na etapa
seguinte.

## Decisão de persistência

O grupo deve ficar no `sessionStorage`.

Não criar tabelas de jogadores no Supabase. Não enviar nomes para APIs,
analytics ou catálogo remoto.

Devem permanecer somente em memória:

- papéis sorteados;
- palavra secreta;
- identidade dos impostores;
- estado da rodada ativa.

O Supabase continua responsável apenas por catálogo, palavras, temas, tutoriais
e regras remotas.

## Modelo mínimo

Use um schema versionado equivalente a:

```js
{
  version: 1,
  party: {
    mode: "named",
    players: [
      { id: "id-estavel", name: "André" }
    ]
  }
}
```

Modos aceitos:

- `named`: nomes informados pelas pessoas;
- `numbered`: nomes gerados, como `Jogador 1` e `Jogador 2`.

Cada jogador precisa de um ID estável. Não use o nome como identificador.
Permita nomes repetidos, pois duas pessoas podem ter o mesmo nome.

## Implementação

Crie o menor módulo compartilhado que resolva o problema. Prefira um arquivo
direto, como `src/party-session.js`, a uma árvore de services e repositories.

O módulo deve centralizar toda leitura e escrita do `sessionStorage` e expor uma
API pequena para:

- ler o grupo atual;
- salvar ou substituir o grupo;
- adicionar jogador;
- editar jogador;
- remover jogador;
- limpar o grupo;
- criar um grupo numerado;
- obter a quantidade derivada de jogadores;
- criar um snapshot imutável para uma rodada.

Não espalhe acesso direto ao storage pelos controllers.

## Normalização e segurança

- Remova espaços externos e normalize espaços repetidos.
- Rejeite nome vazio.
- Limite nomes a 30 caracteres.
- Respeite o limite máximo de jogadores já usado no aplicativo.
- Use `textContent` quando os nomes forem renderizados futuramente.
- Recupere-se de JSON inválido ou schema antigo sem quebrar o app.
- Use uma chave de storage versionada.
- Não persista nenhum segredo da rodada.
- Não adicione sincronização entre abas, contas ou dispositivos.

## Integração mínima

Conecte o grupo ao estado compartilhado apenas o suficiente para a próxima etapa
consumi-lo. Não altere ainda as telas ou os controllers de cada jogo.

Se o estado atual tiver nomes específicos do Impostor, não apague o comportamento
funcional antes de o novo onboarding existir. Evite deixar o aplicativo em um
estado intermediário quebrado.

## Testes obrigatórios

Adicione testes unitários para:

- criar e restaurar grupo com nomes;
- criar grupo numerado;
- persistir no `sessionStorage`;
- recuperar após nova instância do módulo;
- adicionar, editar e remover jogadores;
- manter IDs estáveis;
- aceitar nomes iguais com IDs diferentes;
- derivar a quantidade pela lista;
- recuperar-se de storage inválido;
- gerar snapshot sem compartilhar referências mutáveis;
- garantir que palavra, papel e impostor não sejam persistidos.

Execute somente verificações técnicas:

```bash
npm test
npm run check
git diff --check
```

Não use navegador, screenshots ou cliques automatizados.

## Fora de escopo

- Tela “Quem vai jogar?”.
- Alteração do hub.
- Integração visual com jogos.
- Remoção dos campos atuais de quantidade.
- Motion ou qualquer animação.
- Migration remota.
- Commit, push ou PR.

## Critérios de aceite

- Existe uma única fonte para o grupo da sessão.
- Recarregar a mesma aba preserva o grupo.
- Uma nova sessão começa sem grupo.
- A quantidade é derivada dos jogadores.
- Nomes repetidos não quebram identificação.
- Um snapshot de rodada não muda se o grupo for editado depois.
- Nenhum segredo é salvo no storage.
- O aplicativo continua executável.
- Todos os testes técnicos passam.

## Ponto de parada

Ao concluir, pare sem commit e sem push. Não avance para o onboarding.

Entregue exatamente este handoff para a etapa 2:

```text
HANDOFF 1 CONCLUÍDO

Base utilizada:
Arquivos alterados:
Chave e schema do sessionStorage:
API pública criada:
Integração mínima realizada:
Testes executados e resultados:
Decisões ou desvios da especificação:
Riscos conhecidos:
Estado do git:
Como iniciar o projeto:
```

Antes de entregar, releia o `AGENTS.md`, revise os pontos aplicáveis e corrija
qualquer violação objetiva.
