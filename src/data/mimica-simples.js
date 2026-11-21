// Palavras da Mímica, escritas à mão (20/11). Regra: tudo tem que ser óbvio de imitar sem falar.
// Antes, o nível difícil era gerado misturando palavras ("trocar pneu na biblioteca", "ornitorrinco no gelo")
// e saía muita coisa absurda. Agora:
//   fácil  = um gesto que todo mundo reconhece na hora
//   médio  = uma ação com objeto ou com 2 passos
//   difícil = uma cena curta, mais trabalhosa, mas ainda possível de adivinhar

export const mimicaSimples = {
  geral: {
    facil: [
      "dormir", "chorar", "rir", "correr", "dançar", "nadar", "comer", "beber água",
      "escovar os dentes", "falar no telefone", "tomar banho", "bocejar", "espirrar", "pular",
      "bater palmas", "acenar tchau", "ler um livro", "escrever", "cantar", "assobiar",
      "pentear o cabelo", "lavar as mãos", "abraçar", "mandar beijo", "dirigir", "chutar uma bola",
      "tirar foto", "sentir frio", "sentir calor", "estar com sono",
    ],
    medio: [
      "andar de bicicleta", "jogar futebol", "tocar violão", "lavar louça", "abrir guarda-chuva",
      "tirar selfie", "fazer yoga", "cozinhar", "andar de skate", "varrer a casa", "passar roupa",
      "pescar", "jogar videogame", "pintar uma parede", "regar as plantas", "fazer a barba",
      "passar maquiagem", "amarrar o tênis", "fazer flexão", "pular corda", "jogar boliche",
      "andar de cavalo", "remar um barco", "soltar pipa", "fazer pipoca", "comer espaguete",
      "estourar um balão", "tocar bateria", "subir uma escada", "dar banho no cachorro",
    ],
    dificil: [
      "trocar pneu", "montar uma barraca", "andar na corda bamba", "apagar um incêndio",
      "fazer malabarismo", "pilotar um avião", "surfar", "escalar uma montanha", "esquiar",
      "trocar fralda de bebê", "carregar uma mala pesada", "pisar num chiclete",
      "levar um choque", "abrir um pote que não abre", "procurar a chave perdida",
      "perder o ônibus", "tomar uma injeção", "comer pimenta muito ardida", "se esconder de alguém",
      "andar no escuro", "acordar atrasado", "montar um móvel", "assistir filme de terror",
      "cair no sono na aula", "ser picado por um mosquito", "dançar na chuva",
      "tentar pegar uma mosca", "encher a piscina de boia", "atravessar a rua correndo",
      "fazer um bolo",
    ],
  },
  animais: {
    facil: [
      "cachorro", "gato", "macaco", "pato", "cavalo", "coelho", "cobra", "peixe", "galinha",
      "porco", "vaca", "leão", "elefante", "passarinho", "sapo", "urso", "rato", "borboleta",
      "tubarão", "abelha",
    ],
    medio: [
      "girafa", "canguru", "jacaré", "golfinho", "pinguim", "coruja", "polvo", "tartaruga",
      "caranguejo", "gorila", "lagarta", "minhoca", "morcego", "galo", "ovelha", "camelo",
      "aranha", "foca", "pavão", "papagaio",
    ],
    dificil: [
      "bicho-preguiça", "camaleão", "avestruz", "esquilo", "flamingo", "zebra", "rinoceronte",
      "hipopótamo", "tamanduá", "pica-pau", "água-viva", "lula", "baleia", "lobo uivando",
      "gato se espreguiçando", "cachorro correndo atrás do rabo", "macaco descascando banana",
      "pinguim escorregando no gelo", "galinha botando ovo", "peixe fora d'água",
    ],
  },
  objetos: {
    facil: [
      "martelo", "escova de dentes", "tesoura", "chave", "copo", "livro", "celular", "mochila",
      "bola", "guarda-chuva", "óculos", "relógio", "garfo", "cadeira", "porta", "vela",
      "lápis", "chapéu", "travesseiro", "pente",
    ],
    medio: [
      "aspirador de pó", "controle remoto", "microfone", "violão", "geladeira", "liquidificador",
      "skate", "lanterna", "binóculo", "máquina de lavar", "secador de cabelo", "ferro de passar",
      "câmera fotográfica", "computador", "patinete", "bicicleta", "panela", "espelho",
      "ventilador", "torneira",
    ],
    dificil: [
      "extintor de incêndio", "saca-rolhas", "cronômetro", "furadeira", "estetoscópio",
      "microscópio", "elevador", "escada rolante", "roda-gigante", "montanha-russa",
      "máquina de costura", "guindaste", "catapulta", "piano", "trampolim", "rede de dormir",
      "carrinho de supermercado", "caixa eletrônico", "semáforo", "paraquedas",
    ],
  },
  esportes: {
    facil: [
      "futebol", "basquete", "vôlei", "natação", "corrida", "tênis", "boxe", "ciclismo",
      "pingue-pongue", "skate",
    ],
    medio: [
      "golfe", "beisebol", "surfe", "judô", "karatê", "levantamento de peso", "arco e flecha",
      "boliche", "patinação", "ginástica",
    ],
    dificil: [
      "esgrima", "salto com vara", "hipismo", "polo aquático", "esqui", "escalada",
      "canoagem", "balé", "nado sincronizado", "salto ornamental",
    ],
  },
  profissoes: {
    facil: [
      "médico", "professor", "cozinheiro", "motorista", "policial", "dentista", "cantor",
      "bombeiro", "pintor", "garçom", "jogador de futebol", "padeiro", "cabeleireiro", "palhaço",
      "carteiro",
    ],
    medio: [
      "piloto de avião", "jornalista", "ator", "veterinário", "fotógrafo", "dançarino",
      "astronauta", "mágico", "goleiro", "maquiador", "pedreiro", "jardineiro", "salva-vidas",
      "DJ", "costureira",
    ],
    dificil: [
      "maestro", "mímico", "equilibrista", "mergulhador", "domador de circo", "árbitro de futebol",
      "cirurgião", "arqueólogo", "detetive", "pirata", "cowboy", "ninja", "escultor",
      "apresentador de TV", "guarda de trânsito",
    ],
  },
  "filmes-series": {
    facil: [
      "Homem-Aranha", "Batman", "Superman", "Hulk", "Harry Potter", "Shrek", "Elsa (Frozen)",
      "Rei Leão", "Titanic", "Tubarão", "Star Wars", "Piratas do Caribe", "Toy Story",
      "Procurando Nemo", "Chaves",
    ],
    medio: [
      "Thor", "Capitão América", "Homem de Ferro", "Mulher-Maravilha", "Darth Vader",
      "Jack Sparrow", "Minions", "Bob Esponja", "Pinóquio", "Peter Pan", "Aladdin",
      "Jurassic Park", "Karatê Kid", "Rocky", "Matrix",
    ],
    dificil: [
      "Indiana Jones", "E.T.", "Forrest Gump", "Edward Mãos de Tesoura", "O Mágico de Oz",
      "Os Caça-Fantasmas", "De Volta para o Futuro", "Round 6", "Stranger Things",
      "Wandinha (dancinha)", "La Casa de Papel", "Missão Impossível", "Top Gun", "Avatar",
      "Esqueceram de Mim",
    ],
  },
  games: {
    facil: [
      "Mario", "Sonic", "Pac-Man", "Minecraft", "Pokémon", "Tetris", "Fortnite", "Angry Birds",
      "Just Dance", "FIFA",
    ],
    medio: [
      "Mortal Kombat", "Street Fighter", "Free Fire", "Among Us", "Flappy Bird",
      "Subway Surfers", "Guitar Hero", "Donkey Kong", "Crash Bandicoot", "GTA",
    ],
    dificil: [
      "Fruit Ninja", "Roblox", "Candy Crush", "Zelda", "Plants vs. Zombies", "Need for Speed",
      "Resident Evil", "Dance Dance Revolution", "Space Invaders", "Pokémon GO",
    ],
  },
};
