export const rulesContent = {
  impostor: {
    title: "Como jogar Impostor",
    copy:
      "Jogadores comuns conhecem a palavra secreta. Impostores conhecem apenas o tema. Ninguém pode falar diretamente a palavra secreta.",
    steps: [
      {
        title: "Configure a rodada",
        copy: "Configure jogadores e tema.",
      },
      {
        title: "Distribua os papéis",
        copy: "Passe o celular para cada pessoa ver somente o próprio papel.",
      },
      {
        title: "Dê uma pista",
        copy: "Cada jogador dá uma pista curta sem falar diretamente a palavra secreta.",
      },
      {
        title: "Conversem",
        copy: "O grupo conversa sobre as pistas e observa quem parece suspeito.",
      },
      {
        title: "Escolham os suspeitos",
        copy:
          "O grupo deve escolher a mesma quantidade de suspeitos que o número de impostores.",
      },
      {
        title: "Revelem o resultado",
        copy:
          "Se o grupo encontrar todos os impostores, eles recebem uma tentativa conjunta de adivinhar a palavra. Se acertarem, os impostores roubam a vitória. Se algum impostor passar despercebido, os impostores vencem.",
      },
    ],
  },
  police: {
    title: "Polícia e Ladrão em 3 passos",
    copy:
      "Você define os papéis da rodada e o app faz a distribuição segura antes do grupo começar a investigar.",
    steps: [
      {
        title: "Monte a composição",
        copy: "Escolha quantos serão policiais, ladrões e vítimas.",
      },
      {
        title: "Revelem em privacidade",
        copy: "Cada jogador vê só o próprio papel antes de passar o celular.",
      },
      {
        title: "Comecem a rodada",
        copy: "Depois da distribuição, o grupo conduz a dinâmica fora do app.",
      },
    ],
  },
  city: {
    title: "Cidade Dorme em 3 passos",
    copy:
      "O app só prepara a rodada. Depois disso, o narrador assume e a conversa do grupo conduz o jogo.",
    steps: [
      {
        title: "Defina os papéis",
        copy: "Escolha jogadores, assassinos e detetives. O restante vira cidadão.",
      },
      {
        title: "Distribua com segurança",
        copy: "Cada participante vê só o próprio papel antes de passar o celular.",
      },
      {
        title: "Narrador conduz",
        copy: "Quando a distribuição termina, o grupo segue a noite e a votação fora da tela.",
      },
    ],
  },
  whoami: {
    title: "Quem sou eu? em 3 passos",
    copy:
      "Escolha o universo dos personagens e revele o nome em tela branca, pronto para jogar com o celular na testa.",
    steps: [
      {
        title: "Escolha a categoria",
        copy: "Selecione o tema antes da revelação.",
      },
      {
        title: "Passe o celular",
        copy: "Quem vai jogar coloca o celular na testa antes do clique.",
      },
      {
        title: "Revele e troque se precisar",
        copy:
          "A tela final destaca o personagem e, quando fizer sentido, mostra a obra em texto pequeno.",
      },
    ],
  },
  mimica: {
    title: "Mímica Rápida em 3 passos",
    copy:
      "Ajuste a rodada e só revele a palavra quando o mímico estiver pronto para começar.",
    steps: [
      {
        title: "Defina categoria e tempo",
        copy: "Escolha tema, dificuldade e duração da rodada.",
      },
      {
        title: "Prepare o mímico",
        copy: "Outra pessoa toca em mostrar palavra só na hora certa.",
      },
      {
        title: "Joguem em sequência",
        copy: "Ao fim, avance para a próxima palavra ou troque de mímico.",
      },
    ],
  },
};

export function applyRemoteRulesContent(nextRulesContent) {
  if (
    !nextRulesContent ||
    typeof nextRulesContent !== "object" ||
    Array.isArray(nextRulesContent)
  ) {
    throw new Error("Remote catalog has an invalid tutorial structure");
  }

  Object.keys(rulesContent).forEach((gameId) => {
    delete rulesContent[gameId];
  });
  Object.assign(rulesContent, nextRulesContent);
}
