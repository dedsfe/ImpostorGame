const wordPools = {
  geral: {
    facil: ["bola", "casa", "pao", "sol", "carro", "flor", "mesa", "praia"],
    medio: [
      "astronauta",
      "abacaxi",
      "castelo",
      "violino",
      "pirata",
      "labirinto",
      "sorvete",
      "lanterna",
    ],
    dificil: [
      "constelacao",
      "metamorfose",
      "helicoptero",
      "criptografia",
      "ampulheta",
      "termodinamica",
      "paralelepipedo",
      "caleidoscopio",
    ],
  },
  animais: {
    facil: ["gato", "cachorro", "pato", "vaca", "leao", "urso", "coelho", "cobra"],
    medio: [
      "girafa",
      "tartaruga",
      "golfinho",
      "capivara",
      "pinguim",
      "leopardo",
      "jacare",
      "coruja",
    ],
    dificil: [
      "ornitorrinco",
      "suricata",
      "pangolim",
      "narval",
      "tamandua-bandeira",
      "axolote",
      "caracal",
      "alce",
    ],
  },
  comidas: {
    facil: ["pizza", "bolo", "arroz", "feijao", "pao", "queijo", "suco", "uva"],
    medio: [
      "lasanha",
      "brigadeiro",
      "hamburguer",
      "coxinha",
      "panqueca",
      "pipoca",
      "sushi",
      "taco",
    ],
    dificil: [
      "ratatouille",
      "croissant",
      "bruschetta",
      "ceviche",
      "yakisoba",
      "gnocchi",
      "bouillabaisse",
      "carbonara",
    ],
  },
  objetos: {
    facil: ["lapis", "copo", "chave", "cadeira", "livro", "bola", "prato", "toalha"],
    medio: [
      "mochila",
      "guarda-chuva",
      "controle",
      "tesoura",
      "espelho",
      "lanterna",
      "violao",
      "caderno",
    ],
    dificil: [
      "microscopio",
      "estetoscopio",
      "cronometro",
      "termostato",
      "binoculo",
      "bumerangue",
      "amplificador",
      "retroprojetor",
    ],
  },
  lugares: {
    facil: ["praia", "escola", "parque", "casa", "loja", "cinema", "igreja", "ponte"],
    medio: [
      "museu",
      "biblioteca",
      "aeroporto",
      "acampamento",
      "restaurante",
      "estadio",
      "aquario",
      "mercado",
    ],
    dificil: [
      "observatorio",
      "planetario",
      "anfiteatro",
      "mausoleu",
      "catedral",
      "embaixada",
      "laboratorio",
      "arquipelago",
    ],
  },
};

const mimicaPools = {
  geral: {
    facil: [
      "dormir",
      "chorar",
      "rir",
      "correr",
      "dançar",
      "nadar",
      "comer",
      "beber água",
      "escovar os dentes",
      "telefonar",
    ],
    medio: [
      "andar de bicicleta",
      "jogar futebol",
      "tocar violão",
      "lavar louça",
      "abrir guarda-chuva",
      "tirar selfie",
      "fazer yoga",
      "cozinhar macarrão",
      "andar de patins",
      "varrer a casa",
    ],
    dificil: [
      "trocar pneu",
      "montar barraca",
      "desviar de laser",
      "surfar em onda gigante",
      "aterrissar avião",
      "andar na corda bamba",
      "domar leão",
      "apagar incêndio",
      "mergulhar com cilindro",
      "fazer malabarismo",
    ],
  },
  animais: {
    facil: [
      "cachorro",
      "gato",
      "macaco",
      "pato",
      "cavalo",
      "coelho",
      "cobra",
      "peixe",
      "galinha",
      "porco",
    ],
    medio: [
      "girafa",
      "canguru",
      "jacaré",
      "golfinho",
      "pinguim",
      "capivara",
      "coruja",
      "polvo",
      "camaleão",
      "leopardo",
    ],
    dificil: [
      "ornitorrinco",
      "tamanduá-bandeira",
      "pangolim",
      "suricata",
      "narval",
      "axolote",
      "avestruz",
      "bicho-preguiça",
      "esquilo-voador",
      "caranguejo-aranha",
    ],
  },
  objetos: {
    facil: [
      "martelo",
      "escova",
      "tesoura",
      "chave",
      "copo",
      "livro",
      "telefone",
      "mochila",
      "bola",
      "guarda-chuva",
    ],
    medio: [
      "aspirador",
      "controle remoto",
      "microfone",
      "violão",
      "geladeira",
      "liquidificador",
      "skate",
      "lanterna",
      "binóculo",
      "máquina de lavar",
    ],
    dificil: [
      "microscópio",
      "estetoscópio",
      "retroprojetor",
      "parafusadeira",
      "extintor",
      "catraca",
      "saca-rolhas",
      "cronômetro",
      "impressora 3D",
      "termostato",
    ],
  },
  "filmes-series": {
    facil: [
      "Shrek",
      "Elsa",
      "Harry Potter",
      "Batman",
      "Homem-Aranha",
      "Barbie",
      "Woody",
      "Buzz Lightyear",
      "Darth Vader",
      "Jack Sparrow",
    ],
    medio: [
      "Eleven",
      "Jon Snow",
      "Hermione Granger",
      "Loki",
      "Yoda",
      "Wednesday Addams",
      "Indiana Jones",
      "Sherlock Holmes",
      "Tony Stark",
      "Marty McFly",
    ],
    dificil: [
      "Saul Goodman",
      "Davy Jones",
      "Raymond Reddington",
      "Gus Fring",
      "Cersei Lannister",
      "Peaky Blinders",
      "Daenerys Targaryen",
      "Jean-Luc Picard",
      "Beth Harmon",
      "Meredith Grey",
    ],
  },
  profissoes: {
    facil: [
      "médico",
      "professor",
      "cozinheiro",
      "motorista",
      "policial",
      "dentista",
      "cantor",
      "bombeiro",
      "pintor",
      "garçom",
    ],
    medio: [
      "piloto",
      "jornalista",
      "ator",
      "veterinário",
      "fotógrafo",
      "engenheiro",
      "cabeleireiro",
      "dançarino",
      "astronauta",
      "carteiro",
    ],
    dificil: [
      "neurologista",
      "mergulhador",
      "mímico",
      "maestro",
      "arqueólogo",
      "investigador",
      "tradutor",
      "paramédico",
      "fisioterapeuta",
      "equilibrista",
    ],
  },
  games: {
    facil: [
      "Mario",
      "Luigi",
      "Sonic",
      "Pikachu",
      "Pac-Man",
      "Donkey Kong",
      "Yoshi",
      "Link",
      "Peach",
      "Bowser",
    ],
    medio: [
      "Lara Croft",
      "Kratos",
      "Master Chief",
      "Sub-Zero",
      "Scorpion",
      "Chun-Li",
      "Ryu",
      "Crash Bandicoot",
      "Spyro",
      "Steve do Minecraft",
    ],
    dificil: [
      "Sephiroth",
      "Commander Shepard",
      "Vault Boy",
      "Handsome Jack",
      "GLaDOS",
      "Arthur Morgan",
      "Geralt de Rivia",
      "Solid Snake",
      "Agent 47",
      "Zagreus",
    ],
  },
};

const whoAmIFilmesSeries = [
  "Harry Potter",
  "Hermione Granger",
  "Ron Weasley",
  "Dumbledore",
  "Snape",
  "Draco Malfoy",
  "Voldemort",
  "Hagrid",
  "Sirius Black",
  "Bellatrix Lestrange",
  "Darth Vader",
  "Luke Skywalker",
  "Leia Organa",
  "Han Solo",
  "Yoda",
  "Obi-Wan Kenobi",
  "Rey",
  "Kylo Ren",
  "Chewbacca",
  "Grogu",
  "Din Djarin",
  "Ahsoka Tano",
  "Jack Sparrow",
  "Will Turner",
  "Elizabeth Swann",
  "Barbossa",
  "Davy Jones",
  "Indiana Jones",
  "Marty McFly",
  "Doc Brown",
  "Rocky Balboa",
  "Rambo",
  "John McClane",
  "Ellen Ripley",
  "Sarah Connor",
  "Terminator",
  "Neo",
  "Morpheus",
  "Trinity",
  "Forrest Gump",
  "Jenny Curran",
  "Vito Corleone",
  "Michael Corleone",
  "Tony Montana",
  "Maximus",
  "Commodus",
  "Katniss Everdeen",
  "Peeta Mellark",
  "Haymitch Abernathy",
  "Eleven",
  "Mike Wheeler",
  "Dustin Henderson",
  "Jim Hopper",
  "Steve Harrington",
  "Vecna",
  "Walter White",
  "Jesse Pinkman",
  "Saul Goodman",
  "Gus Fring",
  "Jon Snow",
  "Daenerys Targaryen",
  "Tyrion Lannister",
  "Arya Stark",
  "Sansa Stark",
  "Cersei Lannister",
  "Jaime Lannister",
  "Sheldon Cooper",
  "Leonard Hofstadter",
  "Penny",
  "Amy Farrah Fowler",
  "Rachel Green",
  "Ross Geller",
  "Monica Geller",
  "Chandler Bing",
  "Joey Tribbiani",
  "Phoebe Buffay",
  "Michael Scott",
  "Dwight Schrute",
  "Jim Halpert",
  "Pam Beesly",
  "Thomas Shelby",
  "Arthur Shelby",
  "Sherlock Holmes",
  "John Watson",
  "Geralt de Rivia",
  "Yennefer",
  "Ciri",
  "House",
  "Meredith Grey",
  "Cristina Yang",
  "Beth Harmon",
  "Ted Lasso",
  "Barney Stinson",
  "Ted Mosby",
  "Robin Scherbatsky",
  "Lily Aldrin",
  "Marshall Eriksen",
  "Buffy Summers",
  "Spike",
  "Damon Salvatore",
  "Elena Gilbert",
  "Stefan Salvatore",
  "Spock",
  "James T Kirk",
  "Jean-Luc Picard",
  "Mr Bean",
  "Wednesday Addams",
  "Morticia Addams",
  "Gomez Addams",
  "Raymond Reddington",
];

const whoAmIDesenhosAnimes = [
  "Goku",
  "Vegeta",
  "Gohan",
  "Piccolo",
  "Frieza",
  "Cell",
  "Majin Boo",
  "Naruto Uzumaki",
  "Sasuke Uchiha",
  "Sakura Haruno",
  "Kakashi Hatake",
  "Itachi Uchiha",
  "Hinata Hyuga",
  "Gaara",
  "Luffy",
  "Zoro",
  "Nami",
  "Sanji",
  "Usopp",
  "Chopper",
  "Robin",
  "Brook",
  "Franky",
  "Ace",
  "Mickey Mouse",
  "Minnie Mouse",
  "Donald Duck",
  "Daisy Duck",
  "Pateta",
  "Pluto",
  "Tio Patinhas",
  "Scooby-Doo",
  "Shaggy",
  "Velma",
  "Fred Jones",
  "Daphne Blake",
  "Tom",
  "Jerry",
  "Bob Esponja",
  "Patrick Star",
  "Lula Molusco",
  "Sr Siriguejo",
  "Sandy Bochechas",
  "Gary",
  "Pernalonga",
  "Patolino",
  "Piu-Piu",
  "Frajola",
  "Papa-Leguas",
  "Coiote",
  "He-Man",
  "She-Ra",
  "Ben 10",
  "Gwen Tennyson",
  "Kevin Levin",
  "Max Tennyson",
  "Dexter",
  "Dee Dee",
  "Johnny Bravo",
  "Samurai Jack",
  "Coragem",
  "Muriel Bagge",
  "Eustace Bagge",
  "Ed",
  "Edd",
  "Eddy",
  "Finn",
  "Jake",
  "Marceline",
  "Princesa Jujuba",
  "Rei Gelado",
  "Gumball",
  "Darwin",
  "Anais",
  "Steven Universo",
  "Garnet",
  "Amethyst",
  "Pearl",
  "Connie Maheswaran",
  "Ash Ketchum",
  "Pikachu",
  "Misty",
  "Brock",
  "Jessie",
  "James",
  "Meowth",
  "Dora",
  "Boots",
  "Peppa Pig",
  "George Pig",
  "Masha",
  "Pocoyo",
  "Timmy Turner",
  "Cosmo",
  "Wanda",
  "Jimmy Neutron",
  "Danny Phantom",
  "Kim Possible",
  "Rufus",
  "Aang",
  "Katara",
  "Sokka",
  "Toph",
  "Zuko",
  "Korra",
  "Ladybug",
  "Cat Noir",
  "Marinette",
  "Adrien",
  "Sailor Moon",
];

const whoAmISuperHerois = [
  "Superman",
  "Batman",
  "Mulher-Maravilha",
  "Flash",
  "Aquaman",
  "Cyborg",
  "Lanterna Verde",
  "Shazam",
  "Supergirl",
  "Batgirl",
  "Robin",
  "Asa Noturna",
  "Arqueiro Verde",
  "Canario Negro",
  "Constantine",
  "Zatanna",
  "Ravena",
  "Estelar",
  "Mutano",
  "Besouro Azul",
  "Gaviao Negro",
  "Doutor Fate",
  "Cacador de Marte",
  "Coringa",
  "Lex Luthor",
  "Arlequina",
  "Pinguim",
  "Charada",
  "Mulher-Gato",
  "Duas-Caras",
  "Bane",
  "Exterminador",
  "Homem-Aranha",
  "Homem de Ferro",
  "Capitao America",
  "Thor",
  "Hulk",
  "Viuva Negra",
  "Gaviao Arqueiro",
  "Pantera Negra",
  "Doutor Estranho",
  "Homem-Formiga",
  "Vespa",
  "Feiticeira Escarlate",
  "Visao",
  "Falcao",
  "Soldado Invernal",
  "Captain Marvel",
  "Wolverine",
  "Tempestade",
  "Ciclope",
  "Jean Grey",
  "Professor Xavier",
  "Magneto",
  "Deadpool",
  "Cable",
  "Noturno",
  "Vampira",
  "Gambit",
  "Demolidor",
  "Justiceiro",
  "Luke Cage",
  "Jessica Jones",
  "Punho de Ferro",
  "Cavaleiro da Lua",
  "Motoqueiro Fantasma",
  "Senhor Fantastico",
  "Mulher Invisivel",
  "Tocha Humana",
  "Coisa",
  "Surfista Prateado",
  "Namor",
  "Loki",
  "Thanos",
  "Ultron",
  "Venom",
  "Carnificina",
  "Duende Verde",
  "Doutor Octopus",
  "Mystique",
  "Doutor Destino",
  "Galactus",
  "Shang-Chi",
  "Ms Marvel",
  "Nova",
  "Adam Warlock",
  "She-Hulk",
  "X-23",
  "Elektra",
  "Blade",
  "Morbius",
  "Super Choque",
  "Spawn",
  "Hellboy",
  "Invencivel",
  "Omni-Man",
  "Atom Eve",
  "Homelander",
  "Billy Butcher",
  "Starlight",
  "Maeve",
  "A-Train",
  "The Deep",
  "Peacemaker",
  "Rorschach",
  "Nite Owl",
  "Silk Spectre",
  "Doutor Manhattan",
  "Rocket Raccoon",
];

const whoAmIFamosos = [
  "Neymar",
  "Messi",
  "Cristiano Ronaldo",
  "Pele",
  "Ronaldinho Gaucho",
  "Marta",
  "Serena Williams",
  "LeBron James",
  "Michael Jordan",
  "Ayrton Senna",
  "Lewis Hamilton",
  "Usain Bolt",
  "Michael Phelps",
  "Roger Federer",
  "Rafael Nadal",
  "Novak Djokovic",
  "Anitta",
  "Taylor Swift",
  "Beyonce",
  "Rihanna",
  "Lady Gaga",
  "Adele",
  "Shakira",
  "Dua Lipa",
  "Bruno Mars",
  "The Weeknd",
  "Billie Eilish",
  "Justin Bieber",
  "Selena Gomez",
  "Ariana Grande",
  "Ed Sheeran",
  "Elton John",
  "Madonna",
  "Michael Jackson",
  "Elvis Presley",
  "Freddie Mercury",
  "Paul McCartney",
  "John Lennon",
  "Mick Jagger",
  "David Bowie",
  "Marilia Mendonca",
  "Ivete Sangalo",
  "Gusttavo Lima",
  "Caetano Veloso",
  "Gilberto Gil",
  "Roberto Carlos",
  "Xuxa",
  "Silvio Santos",
  "Fausto Silva",
  "Ana Maria Braga",
  "Luciano Huck",
  "Fernanda Montenegro",
  "Wagner Moura",
  "Selton Mello",
  "Rodrigo Santoro",
  "Bruna Marquezine",
  "Tata Werneck",
  "Juliette",
  "Virginia Fonseca",
  "Felipe Neto",
  "Whindersson Nunes",
  "Oprah Winfrey",
  "Ellen DeGeneres",
  "Kim Kardashian",
  "Kylie Jenner",
  "Kendall Jenner",
  "Gisele Bundchen",
  "Naomi Campbell",
  "Angelina Jolie",
  "Brad Pitt",
  "Leonardo DiCaprio",
  "Tom Cruise",
  "Tom Hanks",
  "Morgan Freeman",
  "Will Smith",
  "Denzel Washington",
  "Keanu Reeves",
  "Scarlett Johansson",
  "Jennifer Lawrence",
  "Emma Stone",
  "Margot Robbie",
  "Meryl Streep",
  "Sandra Bullock",
  "Julia Roberts",
  "Johnny Depp",
  "Robert Downey Jr",
  "Chris Hemsworth",
  "Chris Evans",
  "Zendaya",
  "Timothee Chalamet",
  "Pedro Pascal",
  "Jenna Ortega",
  "Elon Musk",
  "Bill Gates",
  "Mark Zuckerberg",
  "Steve Jobs",
  "Barack Obama",
  "Donald Trump",
  "Lula",
  "Michelle Obama",
  "Papa Francisco",
  "Greta Thunberg",
  "Malala Yousafzai",
  "Albert Einstein",
  "Frida Kahlo",
  "Pablo Picasso",
  "Marilyn Monroe",
  "Audrey Hepburn",
  "Charlie Chaplin",
];

const whoAmIGames = [
  "Mario",
  "Luigi",
  "Princesa Peach",
  "Bowser",
  "Yoshi",
  "Donkey Kong",
  "Diddy Kong",
  "Link",
  "Zelda",
  "Ganondorf",
  "Samus Aran",
  "Kirby",
  "Fox McCloud",
  "Pikachu",
  "Jigglypuff",
  "Mewtwo",
  "Sonic",
  "Tails",
  "Knuckles",
  "Shadow",
  "Dr Eggman",
  "Crash Bandicoot",
  "Coco Bandicoot",
  "Aku Aku",
  "Spyro",
  "Lara Croft",
  "Nathan Drake",
  "Kratos",
  "Atreus",
  "Aloy",
  "Joel",
  "Ellie",
  "Solid Snake",
  "Raiden",
  "Big Boss",
  "Master Chief",
  "Cortana",
  "Marcus Fenix",
  "Commander Shepard",
  "Garrus Vakarian",
  "Tali",
  "Geralt of Rivia",
  "Ciri",
  "Yennefer",
  "Triss Merigold",
  "Arthur Morgan",
  "John Marston",
  "Trevor Philips",
  "Franklin Clinton",
  "Michael De Santa",
  "CJ",
  "Sub-Zero",
  "Scorpion",
  "Liu Kang",
  "Kitana",
  "Chun-Li",
  "Ryu",
  "Ken Masters",
  "Cammy",
  "Guile",
  "Blanka",
  "Dhalsim",
  "Pac-Man",
  "Mega Man",
  "Zero",
  "Dante",
  "Vergil",
  "Leon Kennedy",
  "Jill Valentine",
  "Chris Redfield",
  "Ada Wong",
  "Albert Wesker",
  "Ezio Auditore",
  "Altair",
  "Connor Kenway",
  "Kassandra",
  "Bayek",
  "Sora",
  "Riku",
  "Kairi",
  "Cloud Strife",
  "Sephiroth",
  "Tifa Lockhart",
  "Aerith",
  "Barret Wallace",
  "Noctis",
  "Tidus",
  "Yuna",
  "Claptrap",
  "Handsome Jack",
  "Vault Boy",
  "Steve",
  "Alex",
  "Creeper",
  "Agent 47",
  "Gordon Freeman",
  "Chell",
  "GLaDOS",
  "Zagreus",
  "Cuphead",
  "Sans",
  "Frisk",
  "Princesa Daisy",
  "Wario",
  "Waluigi",
  "Isabelle",
  "Tom Nook",
  "Villager",
];

const whoAmIGeral = [
  ...whoAmIFilmesSeries.slice(0, 22),
  ...whoAmIDesenhosAnimes.slice(0, 22),
  ...whoAmISuperHerois.slice(0, 22),
  ...whoAmIFamosos.slice(0, 22),
  ...whoAmIGames.slice(0, 22),
];

const whoAmIPools = {
  geral: whoAmIGeral,
  "filmes-series": whoAmIFilmesSeries,
  "desenhos-animes": whoAmIDesenhosAnimes,
  "super-herois": whoAmISuperHerois,
  famosos: whoAmIFamosos,
  games: whoAmIGames,
};

const heroContent = {
  hub: {
    eyebrow: "Jogos locais",
    title: "Hub de Jogos",
    copy:
      "Escolha um jogo, monte a rodada e distribua os papéis passando o celular de jogador para jogador.",
  },
  impostorSetup: {
    eyebrow: "Impostor",
    title: "Monte a rodada",
    copy:
      "Escolha categoria, dificuldade e distribua uma palavra secreta enquanto um jogador vira o impostor.",
  },
  policeSetup: {
    eyebrow: "Polícia e Ladrão",
    title: "Distribua os papéis",
    copy:
      "Escolha quantos serão policiais, ladrões e vítimas e deixe o app embaralhar os papéis.",
  },
  mimicaSetup: {
    eyebrow: "Mímica Rápida",
    title: "Monte a rodada",
    copy:
      "Escolha categoria, dificuldade e tempo. Depois revele uma palavra em tela branca para a mímica.",
  },
  whoamiSetup: {
    eyebrow: "Quem sou eu?",
    title: "Escolha a categoria",
    copy:
      "Selecione a categoria antes e depois revele um personagem em tela branca para jogar com o celular na testa.",
  },
};

const state = {
  currentScreen: "hub",
  currentPlayer: 0,
  currentGame: null,
  whoami: {
    category: "geral",
    currentCharacter: "",
    usedCharacters: [],
  },
  mimica: {
    category: "geral",
    difficulty: "medio",
    timePerRound: 45,
    currentWord: "",
    recentWords: [],
    timerId: null,
    timeRemaining: 45,
    currentDuration: 45,
    timedOut: false,
    solved: false,
    prepMode: "start",
  },
};

const elements = {
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroCopy: document.getElementById("hero-copy"),
  screens: {
    hub: document.getElementById("hub-screen"),
    impostorSetup: document.getElementById("impostor-setup-screen"),
    policeSetup: document.getElementById("police-setup-screen"),
    mimicaSetup: document.getElementById("mimica-setup-screen"),
    mimicaPrep: document.getElementById("mimica-prep-screen"),
    mimicaPlay: document.getElementById("mimica-play-screen"),
    whoamiSetup: document.getElementById("whoami-setup-screen"),
    whoamiReveal: document.getElementById("whoami-reveal-screen"),
    turn: document.getElementById("turn-screen"),
    end: document.getElementById("end-screen"),
  },
  openImpostorGame: document.getElementById("open-impostor-game"),
  openPoliceGame: document.getElementById("open-police-game"),
  openMimicaGame: document.getElementById("open-mimica-game"),
  openWhoAmIGame: document.getElementById("open-whoami-game"),
  impostor: {
    form: document.getElementById("impostor-setup-form"),
    playerCount: document.getElementById("impostor-player-count"),
    decreasePlayers: document.getElementById("impostor-decrease-players"),
    increasePlayers: document.getElementById("impostor-increase-players"),
    wordCategory: document.getElementById("impostor-word-category"),
    wordDifficulty: document.getElementById("impostor-word-difficulty"),
    secretWord: document.getElementById("impostor-secret-word"),
    toggleVisibility: document.getElementById("impostor-toggle-word-visibility"),
    toggleLabel: document.getElementById("impostor-toggle-word-label"),
    randomWord: document.getElementById("impostor-random-word"),
    feedback: document.getElementById("impostor-setup-feedback"),
    goHub: document.getElementById("go-hub-from-impostor"),
  },
  police: {
    form: document.getElementById("police-setup-form"),
    policeCount: document.getElementById("police-count"),
    decreaseCount: document.getElementById("police-decrease-count"),
    increaseCount: document.getElementById("police-increase-count"),
    thiefCount: document.getElementById("thief-count"),
    decreaseThieves: document.getElementById("thief-decrease-count"),
    increaseThieves: document.getElementById("thief-increase-count"),
    victimCount: document.getElementById("victim-count"),
    decreaseVictims: document.getElementById("victim-decrease-count"),
    increaseVictims: document.getElementById("victim-increase-count"),
    roleSummary: document.getElementById("police-role-summary"),
    feedback: document.getElementById("police-setup-feedback"),
    goHub: document.getElementById("go-hub-from-police"),
  },
  mimica: {
    form: document.getElementById("mimica-setup-form"),
    category: document.getElementById("mimica-category"),
    difficulty: document.getElementById("mimica-difficulty"),
    time: document.getElementById("mimica-time"),
    feedback: document.getElementById("mimica-setup-feedback"),
    goHub: document.getElementById("go-hub-from-mimica"),
    prepTitle: document.getElementById("mimica-prep-title"),
    prepDescription: document.getElementById("mimica-prep-description"),
    showWord: document.getElementById("show-mimica-word"),
    goHubPrep: document.getElementById("go-hub-from-mimica-prep"),
    goSetupPrep: document.getElementById("go-setup-from-mimica-prep"),
    play: document.getElementById("mimica-play"),
    word: document.getElementById("mimica-word"),
    status: document.getElementById("mimica-status"),
    timerWrap: document.getElementById("mimica-timer-wrap"),
    timer: document.getElementById("mimica-timer"),
    progressFill: document.getElementById("mimica-progress-fill"),
    success: document.getElementById("mimica-success"),
    nextWord: document.getElementById("mimica-next-word"),
    nextPlayer: document.getElementById("mimica-next-player"),
    close: document.getElementById("close-mimica-play"),
  },
  whoami: {
    form: document.getElementById("whoami-setup-form"),
    category: document.getElementById("whoami-category"),
    feedback: document.getElementById("whoami-setup-feedback"),
    goHub: document.getElementById("go-hub-from-whoami"),
    characterName: document.getElementById("whoami-character-name"),
    reroll: document.getElementById("whoami-reroll"),
    close: document.getElementById("whoami-close"),
  },
  turn: {
    panel: document.getElementById("turn-panel"),
    gameLabel: document.getElementById("turn-game-label"),
    progress: document.getElementById("turn-progress"),
    prepView: document.getElementById("prep-view"),
    revealView: document.getElementById("reveal-view"),
    prepTitle: document.getElementById("prep-title"),
    prepDescription: document.getElementById("prep-description"),
    revealRole: document.getElementById("reveal-role"),
    roleBadge: document.getElementById("role-badge"),
    roleTitle: document.getElementById("role-title"),
    roleDescription: document.getElementById("role-description"),
    wordCard: document.getElementById("word-card"),
    nextPlayer: document.getElementById("next-player"),
    restart: document.getElementById("restart-turn"),
    goHub: document.getElementById("go-hub-turn"),
  },
  end: {
    label: document.getElementById("end-label"),
    title: document.getElementById("end-title"),
    description: document.getElementById("end-description"),
    summaryGrid: document.getElementById("end-summary-grid"),
    playAgain: document.getElementById("play-again"),
    goHub: document.getElementById("go-hub-end"),
  },
};

function clampInteger(value, min, max, fallback = min) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function clampPlayers(value) {
  return clampInteger(value, 3, 20, 3);
}

function clampRoleCount(value) {
  return clampInteger(value, 1, 20, 1);
}

function normalizeWord(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getDifficultyLabel(difficulty) {
  if (difficulty === "facil") {
    return "Fácil";
  }

  if (difficulty === "dificil") {
    return "Difícil";
  }

  return "Média";
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function setHero(content) {
  elements.heroEyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.title;
  elements.heroCopy.textContent = content.copy;
}

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

async function enterFullscreenFor(target) {

  if (getFullscreenElement() === target || getFullscreenElement()) {
    return;
  }

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
      return;
    }

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch {}
}

async function enterWhoAmIFullscreen() {
  await enterFullscreenFor(elements.screens.whoamiReveal);
}

async function enterMimicaFullscreen() {
  await enterFullscreenFor(elements.screens.mimicaPlay);
}

async function exitFullscreenIfNeeded() {
  try {
    if (document.exitFullscreen && document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    }
  } catch {}
}

function getCryptoRandomUint32() {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0];
  }

  return Math.floor(Math.random() * 4294967296);
}

function randomIndex(max) {
  if (max <= 1) {
    return 0;
  }

  const maxUint32 = 4294967296;
  const safeLimit = maxUint32 - (maxUint32 % max);
  let randomValue = getCryptoRandomUint32();

  while (randomValue >= safeLimit) {
    randomValue = getCryptoRandomUint32();
  }

  return randomValue % max;
}

function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function setActiveScreen(screen) {
  state.currentScreen = screen;
  document.body.classList.toggle("is-whoami-reveal", screen === "whoamiReveal");
  document.body.classList.toggle("is-mimica-play", screen === "mimicaPlay");
  Object.entries(elements.screens).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === screen);
  });

  if (screen !== "whoamiReveal" && screen !== "mimicaPlay") {
    exitFullscreenIfNeeded();
  }

  if (screen === "hub") {
    setHero(heroContent.hub);
    return;
  }

  if (screen === "impostorSetup") {
    setHero(heroContent.impostorSetup);
    return;
  }

  if (screen === "policeSetup") {
    setHero(heroContent.policeSetup);
    return;
  }

  if (screen === "mimicaSetup" || screen === "mimicaPrep") {
    setHero(heroContent.mimicaSetup);
    return;
  }

  if (screen === "whoamiSetup") {
    setHero(heroContent.whoamiSetup);
  }
}

function clearRoleTone() {
  const toneClasses = ["is-impostor", "is-police", "is-thief", "is-victim"];
  toneClasses.forEach((className) => {
    elements.turn.panel.classList.remove(className);
    elements.turn.wordCard.classList.remove(className);
  });
}

function setTurnPhase(phase) {
  const isPrep = phase === "prep";
  elements.turn.prepView.classList.toggle("is-active", isPrep);
  elements.turn.revealView.classList.toggle("is-active", !isPrep);
  elements.turn.panel.classList.toggle("is-prep", isPrep);
  elements.turn.panel.classList.toggle("is-reveal", !isPrep);
}

function setImpostorWordVisibility(isVisible) {
  elements.impostor.secretWord.type = isVisible ? "text" : "password";
  elements.impostor.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
  elements.impostor.toggleVisibility.setAttribute(
    "aria-label",
    isVisible ? "Esconder palavra secreta" : "Mostrar palavra secreta",
  );
  elements.impostor.toggleVisibility.classList.toggle("is-visible", isVisible);
  elements.impostor.toggleLabel.textContent = isVisible ? "Ocultar" : "Mostrar";
}

function updateImpostorFeedback(message = "") {
  elements.impostor.feedback.textContent = message;
}

function updatePoliceFeedback(message = "") {
  elements.police.feedback.textContent = message;
}

function updateWhoAmIFeedback(message = "") {
  elements.whoami.feedback.textContent = message;
}

function updateMimicaFeedback(message = "") {
  elements.mimica.feedback.textContent = message;
}

function syncImpostorPlayerInput(nextValue) {
  const safeValue = clampPlayers(nextValue);
  elements.impostor.playerCount.value = safeValue;
  return safeValue;
}

function syncImpostorCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(wordPools, nextValue)
    ? nextValue
    : "geral";
  elements.impostor.wordCategory.value = safeCategory;
  return safeCategory;
}

function syncImpostorDifficultyInput(nextValue) {
  const safeDifficulty =
    nextValue === "facil" || nextValue === "medio" || nextValue === "dificil"
      ? nextValue
      : "medio";
  elements.impostor.wordDifficulty.value = safeDifficulty;
  return safeDifficulty;
}

function getWordFromCategory(category, difficulty) {
  const categoryPool = wordPools[category] ?? wordPools.geral;
  const words = categoryPool[difficulty] ?? wordPools.geral.medio;
  return words[randomIndex(words.length)];
}

function getMimicaWord(category, difficulty) {
  const categoryPool = mimicaPools[category] ?? mimicaPools.geral;
  const words = categoryPool[difficulty] ?? mimicaPools.geral.medio;
  let candidates = words.filter(
    (word) =>
      !state.mimica.recentWords.includes(word) && word !== state.mimica.currentWord,
  );

  if (candidates.length === 0) {
    state.mimica.recentWords = state.mimica.currentWord ? [state.mimica.currentWord] : [];
    candidates = words.filter((word) => word !== state.mimica.currentWord);
  }

  if (candidates.length === 0) {
    candidates = [...words];
  }

  const nextWord = candidates[randomIndex(candidates.length)];

  state.mimica.currentWord = nextWord;
  state.mimica.recentWords = [...state.mimica.recentWords, nextWord].slice(-8);
  return nextWord;
}

function syncMimicaCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(mimicaPools, nextValue)
    ? nextValue
    : "geral";

  if (state.mimica.category !== safeCategory) {
    state.mimica.recentWords = [];
    state.mimica.currentWord = "";
  }

  state.mimica.category = safeCategory;
  elements.mimica.category.value = safeCategory;
  return safeCategory;
}

function syncMimicaDifficultyInput(nextValue) {
  const safeDifficulty =
    nextValue === "facil" || nextValue === "medio" || nextValue === "dificil"
      ? nextValue
      : "medio";

  if (state.mimica.difficulty !== safeDifficulty) {
    state.mimica.recentWords = [];
    state.mimica.currentWord = "";
  }

  state.mimica.difficulty = safeDifficulty;
  elements.mimica.difficulty.value = safeDifficulty;
  return safeDifficulty;
}

function syncMimicaTimeInput(nextValue) {
  const safeTime =
    nextValue === "30" || nextValue === "45" || nextValue === "60"
      ? Number(nextValue)
      : null;

  state.mimica.timePerRound = safeTime;
  elements.mimica.time.value = safeTime === null ? "none" : String(safeTime);
  return safeTime;
}

function clearMimicaTimer() {
  if (state.mimica.timerId !== null) {
    clearInterval(state.mimica.timerId);
    state.mimica.timerId = null;
  }
}

function resetMimicaRoundState() {
  clearMimicaTimer();
  state.mimica.timeRemaining = state.mimica.timePerRound ?? 0;
  state.mimica.currentDuration = state.mimica.timePerRound ?? 0;
  state.mimica.timedOut = false;
  state.mimica.solved = false;
}

function renderMimicaTimer() {
  const hasTimer = state.mimica.timePerRound !== null;
  const duration = state.mimica.currentDuration || 1;
  const ratio = hasTimer ? Math.max(0, state.mimica.timeRemaining / duration) : 1;

  elements.mimica.timerWrap.hidden = !hasTimer;
  if (hasTimer) {
    elements.mimica.timer.textContent = `${state.mimica.timeRemaining}s`;
    elements.mimica.progressFill.style.width = `${Math.max(0, ratio * 100)}%`;
  } else {
    elements.mimica.progressFill.style.width = "100%";
  }
}

function updateMimicaVisualState() {
  elements.mimica.play.classList.remove("is-timed-out", "is-success");

  if (state.mimica.solved) {
    elements.mimica.play.classList.add("is-success");
    elements.mimica.status.textContent = "Acertaram!";
    return;
  }

  if (state.mimica.timedOut) {
    elements.mimica.play.classList.add("is-timed-out");
    elements.mimica.status.textContent = "Tempo esgotado!";
    return;
  }

  elements.mimica.status.textContent =
    state.mimica.timePerRound === null ? "Valendo!" : "Tempo correndo";
}

function startMimicaTimer() {
  clearMimicaTimer();

  if (state.mimica.timePerRound === null) {
    renderMimicaTimer();
    updateMimicaVisualState();
    return;
  }

  state.mimica.timeRemaining = state.mimica.timePerRound;
  state.mimica.currentDuration = state.mimica.timePerRound;
  renderMimicaTimer();
  updateMimicaVisualState();

  state.mimica.timerId = setInterval(() => {
    if (state.mimica.timeRemaining <= 1) {
      state.mimica.timeRemaining = 0;
      clearMimicaTimer();
      state.mimica.timedOut = true;
      renderMimicaTimer();
      updateMimicaVisualState();
      return;
    }

    state.mimica.timeRemaining -= 1;
    renderMimicaTimer();
  }, 1000);
}

function syncWhoAmICategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(whoAmIPools, nextValue)
    ? nextValue
    : "geral";

  if (state.whoami.category !== safeCategory) {
    state.whoami.usedCharacters = [];
    state.whoami.currentCharacter = "";
  }

  state.whoami.category = safeCategory;
  elements.whoami.category.value = safeCategory;
  return safeCategory;
}

function getWhoAmICharacter(category) {
  const pool = whoAmIPools[category] ?? whoAmIPools.geral;
  let candidates = pool.filter(
    (character) =>
      !state.whoami.usedCharacters.includes(character) &&
      character !== state.whoami.currentCharacter,
  );

  if (candidates.length === 0) {
    state.whoami.usedCharacters = state.whoami.currentCharacter
      ? [state.whoami.currentCharacter]
      : [];
    candidates = pool.filter((character) => character !== state.whoami.currentCharacter);
  }

  if (candidates.length === 0) {
    candidates = [...pool];
  }

  const nextCharacter = candidates[randomIndex(candidates.length)];

  state.whoami.currentCharacter = nextCharacter;
  if (!state.whoami.usedCharacters.includes(nextCharacter)) {
    state.whoami.usedCharacters.push(nextCharacter);
  }

  return nextCharacter;
}

function syncPoliceRoleInputs(preferredRole = "victim", nextValue = null) {
  const counts = {
    police: clampRoleCount(elements.police.policeCount.value),
    thief: clampRoleCount(elements.police.thiefCount.value),
    victim: clampRoleCount(elements.police.victimCount.value),
  };

  if (preferredRole in counts && nextValue !== null) {
    counts[preferredRole] = clampRoleCount(nextValue);
  }

  const totalPlayers = counts.police + counts.thief + counts.victim;
  let overflow = totalPlayers - 20;
  const roleOrder = [
    preferredRole,
    ...["police", "thief", "victim"].filter((role) => role !== preferredRole),
  ];

  roleOrder.forEach((role) => {
    if (overflow <= 0) {
      return;
    }

    const reducible = counts[role] - 1;

    if (reducible <= 0) {
      return;
    }

    const reduction = Math.min(reducible, overflow);
    counts[role] -= reduction;
    overflow -= reduction;
  });

  const safeTotalPlayers = counts.police + counts.thief + counts.victim;

  elements.police.policeCount.value = counts.police;
  elements.police.thiefCount.value = counts.thief;
  elements.police.victimCount.value = counts.victim;
  elements.police.roleSummary.textContent = `Total: ${safeTotalPlayers} ${pluralize(
    safeTotalPlayers,
    "jogador",
    "jogadores",
  )}. Serão ${counts.police} ${pluralize(
    counts.police,
    "policial",
    "policiais",
  )}, ${counts.thief} ${pluralize(
    counts.thief,
    "ladrão",
    "ladrões",
  )} e ${counts.victim} ${pluralize(counts.victim, "vítima", "vítimas")}.`;

  return {
    ...counts,
    totalPlayers: safeTotalPlayers,
  };
}

function buildImpostorGame(totalPlayers, secretWord, category, difficulty) {
  const impostorIndex = randomIndex(totalPlayers);
  const roles = Array.from({ length: totalPlayers }, (_, playerIndex) => {
    if (playerIndex === impostorIndex) {
      return {
        badge: "Impostor",
        title: "Você é o impostor",
        description:
          "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
        value: "IMPOSTOR",
        tone: "impostor",
      };
    }

    return {
      badge: "Palavra secreta",
      title: "Você recebeu a palavra",
      description:
        "Guarde a palavra e use pistas discretas para identificar o impostor.",
      value: secretWord,
      tone: "word",
    };
  });

  return {
    type: "impostor",
    name: "Impostor",
    totalPlayers,
    roles,
    setupScreen: "impostorSetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      "Agora afastem o celular e comecem a conversa para descobrir quem é o impostor.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: "1" },
      { label: "Dificuldade", value: getDifficultyLabel(difficulty) },
    ],
    hero: {
      eyebrow: "Impostor",
      title: "Distribuição de papéis",
      copy: `Palavra definida em ${category} com dificuldade ${getDifficultyLabel(
        difficulty,
      ).toLowerCase()}.`,
    },
  };
}

function buildPoliceGame(totalPlayers, policeCount, thiefCount, victimCount) {
  const roles = shuffleArray([
    ...Array.from({ length: policeCount }, () => ({
      badge: "Polícia",
      title: "Você é a polícia",
      description:
        "Observe a rodada com cuidado e tente identificar quem está agindo como ladrão.",
      value: "POLÍCIA",
      tone: "police",
    })),
    ...Array.from({ length: thiefCount }, () => ({
      badge: "Ladrão",
      title: "Você é o ladrão",
      description:
        "Tente disfarçar seu papel e escapar da atenção dos policiais durante a rodada.",
      value: "LADRÃO",
      tone: "thief",
    })),
    ...Array.from({ length: victimCount }, () => ({
      badge: "Vítima",
      title: "Você é a vítima",
      description:
        "Observe os outros jogadores e tente perceber quem pode estar do seu lado ou contra você.",
      value: "VÍTIMA",
      tone: "victim",
    })),
  ]);

  return {
    type: "police",
    name: "Polícia e Ladrão",
    totalPlayers,
    roles,
    setupScreen: "policeSetup",
    endLabel: "Papéis distribuídos",
    endTitle: "Todo mundo já sabe seu papel",
    endDescription:
      "Agora vocês podem começar a rodada sabendo quem é polícia, ladrão ou vítima.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Policiais", value: String(policeCount) },
      { label: "Ladrões", value: String(thiefCount) },
      { label: "Vítimas", value: String(victimCount) },
    ],
    hero: {
      eyebrow: "Polícia e Ladrão",
      title: "Distribuição de papéis",
      copy: `${policeCount} ${pluralize(
        policeCount,
        "policial",
        "policiais",
      )}, ${thiefCount} ${pluralize(
        thiefCount,
        "ladrão",
        "ladrões",
      )} e ${victimCount} ${pluralize(victimCount, "vítima", "vítimas")} na rodada.`,
    },
  };
}

function openHub() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  clearMimicaTimer();
  updateImpostorFeedback("");
  updatePoliceFeedback("");
  updateMimicaFeedback("");
  setActiveScreen("hub");
}

function openImpostorSetup() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  setImpostorWordVisibility(false);
  updateImpostorFeedback("");
  setActiveScreen("impostorSetup");
}

function openPoliceSetup() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  updatePoliceFeedback("");
  syncPoliceRoleInputs();
  setActiveScreen("policeSetup");
}

function openMimicaSetup() {
  state.currentGame = {
    type: "mimica",
    name: "Mímica Rápida",
  };
  state.currentPlayer = 0;
  clearMimicaTimer();
  syncMimicaCategoryInput(elements.mimica.category.value);
  syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  syncMimicaTimeInput(elements.mimica.time.value);
  state.mimica.prepMode = "start";
  state.mimica.solved = false;
  state.mimica.timedOut = false;
  updateMimicaFeedback("");
  setActiveScreen("mimicaSetup");
}

function renderMimicaPreparation() {
  const isNextPlayer = state.mimica.prepMode === "next-player";

  elements.mimica.prepTitle.textContent = isNextPlayer
    ? "Passe o celular para o próximo mímico"
    : "Passe o celular para quem vai fazer a mímica";
  elements.mimica.prepDescription.textContent = isNextPlayer
    ? "Toque em mostrar quando a próxima pessoa estiver pronta para ver a palavra."
    : "Toque em mostrar apenas quando a pessoa estiver pronta para ver a palavra.";

  clearMimicaTimer();
  setActiveScreen("mimicaPrep");
}

function renderMimicaWord() {
  const category = syncMimicaCategoryInput(elements.mimica.category.value);
  const difficulty = syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  const nextWord = getMimicaWord(category, difficulty);

  resetMimicaRoundState();
  elements.mimica.word.textContent = nextWord;
  renderMimicaTimer();
  updateMimicaVisualState();
  setActiveScreen("mimicaPlay");
  startMimicaTimer();
  enterMimicaFullscreen();
}

function markMimicaSuccess() {
  state.mimica.solved = true;
  state.mimica.timedOut = false;
  clearMimicaTimer();
  updateMimicaVisualState();
}

function openWhoAmISetup() {
  state.currentGame = {
    type: "whoami",
    name: "Quem sou eu?",
  };
  state.currentPlayer = 0;
  syncWhoAmICategoryInput(elements.whoami.category.value);
  updateWhoAmIFeedback("");
  setActiveScreen("whoamiSetup");
}

function renderWhoAmICharacter() {
  const category = syncWhoAmICategoryInput(elements.whoami.category.value);
  const character = getWhoAmICharacter(category);

  elements.whoami.characterName.textContent = character;
  updateWhoAmIFeedback("");
  setActiveScreen("whoamiReveal");
  enterWhoAmIFullscreen();
}

function renderPreparation() {
  const playerNumber = state.currentPlayer + 1;

  setHero({
    eyebrow: state.currentGame.name,
    title: "Passe para o próximo jogador",
    copy:
      "Mantenha a tela coberta e revele o papel somente quando a pessoa certa estiver pronta.",
  });
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
  elements.turn.prepTitle.textContent = `Prepare o Jogador ${playerNumber}`;
  elements.turn.prepDescription.textContent =
    "Passe o celular com a tela coberta e toque em mostrar apenas quando o jogador estiver pronto.";

  clearRoleTone();
  setTurnPhase("prep");
  setActiveScreen("turn");
}

function renderReveal() {
  const playerNumber = state.currentPlayer + 1;
  const isLastPlayer = state.currentPlayer === state.currentGame.totalPlayers - 1;
  const role = state.currentGame.roles[state.currentPlayer];

  setHero(state.currentGame.hero);
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
  elements.turn.roleBadge.textContent = role.badge;
  elements.turn.roleTitle.textContent = role.title;
  elements.turn.roleDescription.textContent = role.description;
  elements.turn.wordCard.textContent = role.value;
  elements.turn.nextPlayer.textContent = isLastPlayer
    ? "Finalizar distribuição"
    : "Próximo jogador";

  clearRoleTone();
  if (role.tone === "impostor") {
    elements.turn.panel.classList.add("is-impostor");
    elements.turn.wordCard.classList.add("is-impostor");
  }
  if (role.tone === "police") {
    elements.turn.panel.classList.add("is-police");
    elements.turn.wordCard.classList.add("is-police");
  }
  if (role.tone === "thief") {
    elements.turn.panel.classList.add("is-thief");
    elements.turn.wordCard.classList.add("is-thief");
  }
  if (role.tone === "victim") {
    elements.turn.panel.classList.add("is-victim");
    elements.turn.wordCard.classList.add("is-victim");
  }

  setTurnPhase("reveal");
  setActiveScreen("turn");
}

function renderEndScreen() {
  setHero({
    eyebrow: state.currentGame.name,
    title: "Rodada pronta",
    copy: "Todos os papéis foram entregues. Agora o jogo começa fora da tela.",
  });

  elements.end.label.textContent = state.currentGame.endLabel;
  elements.end.title.textContent = state.currentGame.endTitle;
  elements.end.description.textContent = state.currentGame.endDescription;
  elements.end.playAgain.textContent = `Nova partida de ${state.currentGame.name}`;
  elements.end.summaryGrid.replaceChildren(
    ...state.currentGame.summary.map((item) => {
      const card = document.createElement("article");
      const label = document.createElement("span");
      const value = document.createElement("strong");

      card.className = "summary-card";
      label.className = "summary-label";
      label.textContent = item.label;
      value.textContent = item.value;
      card.append(label, value);

      return card;
    }),
  );

  setActiveScreen("end");
}

function restartCurrentGame() {
  if (!state.currentGame) {
    openHub();
    return;
  }

  if (state.currentGame.type === "impostor") {
    openImpostorSetup();
    return;
  }

  if (state.currentGame.type === "mimica") {
    openMimicaSetup();
    return;
  }

  if (state.currentGame.type === "whoami") {
    openWhoAmISetup();
    return;
  }

  openPoliceSetup();
}

function startImpostorGame() {
  const totalPlayers = syncImpostorPlayerInput(elements.impostor.playerCount.value);
  const category = syncImpostorCategoryInput(elements.impostor.wordCategory.value);
  const difficulty = syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
  let secretWord = normalizeWord(elements.impostor.secretWord.value);

  if (!secretWord) {
    secretWord = getWordFromCategory(category, difficulty);
    elements.impostor.secretWord.value = secretWord;
    setImpostorWordVisibility(false);
  }

  updateImpostorFeedback("");
  state.currentGame = buildImpostorGame(totalPlayers, secretWord, category, difficulty);
  state.currentPlayer = 0;
  renderPreparation();
}

function startPoliceGame() {
  const counts = syncPoliceRoleInputs();

  updatePoliceFeedback("");
  state.currentGame = buildPoliceGame(
    counts.totalPlayers,
    counts.police,
    counts.thief,
    counts.victim,
  );
  state.currentPlayer = 0;
  renderPreparation();
}

function startMimicaGame() {
  syncMimicaCategoryInput(elements.mimica.category.value);
  syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  syncMimicaTimeInput(elements.mimica.time.value);
  state.mimica.prepMode = "start";
  updateMimicaFeedback("");
  renderMimicaPreparation();
}

function startWhoAmIGame() {
  syncWhoAmICategoryInput(elements.whoami.category.value);
  renderWhoAmICharacter();
}

elements.openImpostorGame.addEventListener("click", openImpostorSetup);
elements.openPoliceGame.addEventListener("click", openPoliceSetup);
elements.openMimicaGame.addEventListener("click", openMimicaSetup);
elements.openWhoAmIGame.addEventListener("click", openWhoAmISetup);

elements.impostor.decreasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) - 1);
});

elements.impostor.increasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) + 1);
});

elements.impostor.playerCount.addEventListener("change", (event) => {
  syncImpostorPlayerInput(event.target.value);
});

elements.impostor.wordCategory.addEventListener("change", (event) => {
  syncImpostorCategoryInput(event.target.value);
});

elements.impostor.wordDifficulty.addEventListener("change", (event) => {
  syncImpostorDifficultyInput(event.target.value);
});

elements.impostor.randomWord.addEventListener("click", () => {
  const category = syncImpostorCategoryInput(elements.impostor.wordCategory.value);
  const difficulty = syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
  elements.impostor.secretWord.value = getWordFromCategory(category, difficulty);
  setImpostorWordVisibility(false);
  updateImpostorFeedback("");
});

elements.impostor.toggleVisibility.addEventListener("click", () => {
  const isVisible =
    elements.impostor.toggleVisibility.getAttribute("aria-pressed") === "true";
  setImpostorWordVisibility(!isVisible);
});

elements.impostor.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startImpostorGame();
});

elements.impostor.goHub.addEventListener("click", openHub);

elements.police.decreaseCount.addEventListener("click", () => {
  syncPoliceRoleInputs("police", Number(elements.police.policeCount.value) - 1);
});

elements.police.increaseCount.addEventListener("click", () => {
  syncPoliceRoleInputs("police", Number(elements.police.policeCount.value) + 1);
});

elements.police.policeCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("police", event.target.value);
});

elements.police.decreaseThieves.addEventListener("click", () => {
  syncPoliceRoleInputs("thief", Number(elements.police.thiefCount.value) - 1);
});

elements.police.increaseThieves.addEventListener("click", () => {
  syncPoliceRoleInputs("thief", Number(elements.police.thiefCount.value) + 1);
});

elements.police.thiefCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("thief", event.target.value);
});

elements.police.decreaseVictims.addEventListener("click", () => {
  syncPoliceRoleInputs("victim", Number(elements.police.victimCount.value) - 1);
});

elements.police.increaseVictims.addEventListener("click", () => {
  syncPoliceRoleInputs("victim", Number(elements.police.victimCount.value) + 1);
});

elements.police.victimCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("victim", event.target.value);
});

elements.police.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startPoliceGame();
});

elements.police.goHub.addEventListener("click", openHub);

elements.mimica.category.addEventListener("change", (event) => {
  syncMimicaCategoryInput(event.target.value);
});

elements.mimica.difficulty.addEventListener("change", (event) => {
  syncMimicaDifficultyInput(event.target.value);
});

elements.mimica.time.addEventListener("change", (event) => {
  syncMimicaTimeInput(event.target.value);
});

elements.mimica.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startMimicaGame();
});

elements.mimica.showWord.addEventListener("click", renderMimicaWord);
elements.mimica.success.addEventListener("click", markMimicaSuccess);
elements.mimica.nextWord.addEventListener("click", renderMimicaWord);
elements.mimica.nextPlayer.addEventListener("click", () => {
  state.mimica.prepMode = "next-player";
  renderMimicaPreparation();
});
elements.mimica.close.addEventListener("click", openMimicaSetup);
elements.mimica.goHub.addEventListener("click", openHub);
elements.mimica.goHubPrep.addEventListener("click", openHub);
elements.mimica.goSetupPrep.addEventListener("click", openMimicaSetup);

elements.whoami.category.addEventListener("change", (event) => {
  syncWhoAmICategoryInput(event.target.value);
});

elements.whoami.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startWhoAmIGame();
});

elements.whoami.reroll.addEventListener("click", renderWhoAmICharacter);
elements.whoami.close.addEventListener("click", openWhoAmISetup);
elements.whoami.goHub.addEventListener("click", openHub);

elements.turn.revealRole.addEventListener("click", renderReveal);

elements.turn.nextPlayer.addEventListener("click", () => {
  const isLastPlayer = state.currentPlayer === state.currentGame.totalPlayers - 1;

  if (isLastPlayer) {
    renderEndScreen();
    return;
  }

  state.currentPlayer += 1;
  renderPreparation();
});

elements.turn.restart.addEventListener("click", restartCurrentGame);
elements.turn.goHub.addEventListener("click", openHub);
elements.end.playAgain.addEventListener("click", restartCurrentGame);
elements.end.goHub.addEventListener("click", openHub);

syncImpostorPlayerInput(elements.impostor.playerCount.value);
syncImpostorCategoryInput(elements.impostor.wordCategory.value);
syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
setImpostorWordVisibility(false);
syncPoliceRoleInputs();
syncMimicaCategoryInput(elements.mimica.category.value);
syncMimicaDifficultyInput(elements.mimica.difficulty.value);
syncMimicaTimeInput(elements.mimica.time.value);
syncWhoAmICategoryInput(elements.whoami.category.value);
setActiveScreen("hub");
