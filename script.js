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

const mimicaFilmesSeriesExtras = {
  facil: [
    "Superman",
    "Mulher-Maravilha",
    "Hulk",
    "Thor",
    "Capitão América",
    "Viúva Negra",
    "Flash",
    "Aquaman",
    "Coringa",
    "Arlequina",
    "Pantera Negra",
    "Dory",
    "Nemo",
    "Simba",
    "Nala",
    "Mufasa",
    "Pumba",
    "Timão",
    "Olaf",
    "Anna",
    "Moana",
    "Maui",
    "Ariel",
    "Bela",
    "Aladdin",
    "Jasmine",
    "Gênio",
    "Rapunzel",
    "Flynn Rider",
    "Cinderela",
    "Branca de Neve",
    "Pinóquio",
    "Peter Pan",
    "Sininho",
    "Malévola",
    "Cruella",
    "Dumbo",
    "Po",
    "Tigresa",
    "Burro",
    "Gato de Botas",
    "Fiona",
    "Soluço",
    "Banguela",
    "Mérida",
    "Wall-E",
    "EVE",
    "Relâmpago McQueen",
    "Mate",
    "Sully",
    "Mike Wazowski",
    "Boo",
    "Sr. Incrível",
    "Mulher-Elástica",
    "Violeta",
    "Flecha",
    "Edna Moda",
    "Gru",
    "Lucy Wilde",
    "Kevin Minion",
    "Stuart Minion",
    "Bob Esponja",
    "Patrick Estrela",
    "Lula Molusco",
    "Sandy Bochechas",
    "Scooby-Doo",
    "Salsicha",
    "Fred Flintstone",
    "Wilma Flintstone",
    "George Jetson",
    "Jane Jetson",
    "Tom",
    "Jerry",
    "Pernalonga",
    "Patolino",
    "Piu-Piu",
    "Frajola",
    "Mickey Mouse",
    "Minnie Mouse",
    "Pato Donald",
    "Margarida",
    "Pateta",
    "Pluto",
    "Stitch",
    "Lilo",
    "Baymax",
    "Detona Ralph",
    "Vanellope",
    "Mirabel",
    "Luisa Madrigal",
    "Isabela Madrigal",
    "Dolores Madrigal",
    "Bruno Madrigal",
    "Chaves",
    "Kiko",
    "Seu Madruga",
    "Dona Florinda",
    "Chapolin",
    "Robin",
    "Batgirl",
    "Supergirl",
    "Lois Lane",
    "Lex Luthor",
    "Venom",
    "Capitã Marvel",
    "Homem-Formiga",
    "Groot",
    "Rocket Raccoon",
    "Gamora",
    "Drax",
    "Star-Lord",
    "Mantis",
    "Chewbacca",
    "R2-D2",
    "C-3PO",
    "Leia",
    "Luke Skywalker",
    "Han Solo",
    "Darth Maul",
    "Kylo Ren",
    "Rey",
    "Finn",
    "Poe Dameron",
    "Grogu",
    "Mandaloriano",
    "ET",
    "Willy Wonka",
    "Matilda",
    "Mary Poppins",
    "Forrest Gump",
    "Rocky Balboa",
    "Rambo",
    "T-800",
    "Beetlejuice",
    "Gomez Addams",
    "Morticia Addams",
    "Asterix",
    "Obelix",
  ],
  medio: [
    "Walter White",
    "Jesse Pinkman",
    "Skyler White",
    "Hank Schrader",
    "Michael Scott",
    "Dwight Schrute",
    "Jim Halpert",
    "Pam Beesly",
    "Rachel Green",
    "Ross Geller",
    "Monica Geller",
    "Chandler Bing",
    "Phoebe Buffay",
    "Joey Tribbiani",
    "Ted Mosby",
    "Barney Stinson",
    "Robin Scherbatsky",
    "Lily Aldrin",
    "Marshall Eriksen",
    "Sheldon Cooper",
    "Leonard Hofstadter",
    "Penny",
    "Howard Wolowitz",
    "Raj Koothrappali",
    "Gregory House",
    "Cristina Yang",
    "Derek Shepherd",
    "Alex Karev",
    "Olivia Benson",
    "Elliot Stabler",
    "Jack Bauer",
    "Jack Shephard",
    "Sawyer",
    "Kate Austen",
    "Hurley",
    "Ben Linus",
    "Fox Mulder",
    "Dana Scully",
    "Buffy Summers",
    "Willow Rosenberg",
    "Xena",
    "Gabrielle",
    "Lorelai Gilmore",
    "Rory Gilmore",
    "Dean Winchester",
    "Sam Winchester",
    "Castiel",
    "Geralt de Rivia",
    "Yennefer",
    "Ciri",
    "Tommy Shelby",
    "Arthur Shelby",
    "Polly Gray",
    "John Shelby",
    "Harvey Specter",
    "Mike Ross",
    "Jessica Pearson",
    "Donna Paulsen",
    "Louis Litt",
    "Rachel Zane",
    "Professor",
    "Tóquio",
    "Berlim",
    "Rio",
    "Denver",
    "Nairobi",
    "Raquel Murillo",
    "Vecna",
    "Steve Harrington",
    "Dustin Henderson",
    "Robin Buckley",
    "Max Mayfield",
    "Jim Hopper",
    "Wanda Maximoff",
    "Vision",
    "Doutor Estranho",
    "Nick Fury",
    "Nebulosa",
    "Bucky Barnes",
    "Doutor Octopus",
    "Duende Verde",
    "Mística",
    "Magneto",
    "Professor Xavier",
    "Ciclope",
    "Wolverine",
    "Jean Grey",
    "Deadpool",
    "Cable",
    "Elektra",
    "Blade",
    "Neo",
    "Trinity",
    "Morpheus",
    "Agente Smith",
    "Sarah Connor",
    "John Connor",
    "Ripley",
    "Doc Brown",
    "Vito Corleone",
    "Michael Corleone",
    "Sonny Corleone",
    "Tom Hagen",
    "Clarice Starling",
    "Hannibal Lecter",
    "Dexter Morgan",
    "Debra Morgan",
    "Villanelle",
    "Eve Polastri",
    "Fleabag",
    "Nandor",
    "Laszlo",
    "Nadja",
    "Guillermo",
    "Enid Sinclair",
    "Aang",
    "Zuko",
    "Katara",
    "Sokka",
    "Toph",
    "Korra",
    "Asami",
    "Ted Lasso",
    "Rebecca Welton",
    "Keeley Jones",
    "Roy Kent",
    "Jamie Tartt",
    "Moira Rose",
    "Alexis Rose",
    "David Rose",
    "Johnny Rose",
  ],
  dificil: [
    "Kim Wexler",
    "Nacho Varga",
    "Lalo Salamanca",
    "Mike Ehrmantraut",
    "Don Draper",
    "Peggy Olson",
    "Joan Holloway",
    "Betty Draper",
    "Roger Sterling",
    "Rust Cohle",
    "Marty Hart",
    "Stringer Bell",
    "Omar Little",
    "Jimmy McNulty",
    "Bubbles",
    "Alicia Florrick",
    "Kalinda Sharma",
    "Eli Gold",
    "Olivia Pope",
    "Fitz Grant",
    "Annalise Keating",
    "Connor Walsh",
    "Michaela Pratt",
    "Frank Delfino",
    "Laurel Castillo",
    "BoJack Horseman",
    "Princess Carolyn",
    "Mr. Peanutbutter",
    "Diane Nguyen",
    "Todd Chavez",
    "Rhaenyra Targaryen",
    "Alicent Hightower",
    "Daemon Targaryen",
    "Viserys Targaryen",
    "Otto Hightower",
    "Aemond Targaryen",
    "Tyrion Lannister",
    "Arya Stark",
    "Sansa Stark",
    "Jaime Lannister",
    "Sandor Clegane",
    "Brienne de Tarth",
    "Oberyn Martell",
    "Theon Greyjoy",
    "Ygritte",
    "Margaery Tyrell",
    "Stannis Baratheon",
    "Ned Stark",
    "Joffrey Baratheon",
    "Bronn",
    "Paul Atreides",
    "Lady Jessica",
    "Chani",
    "Stilgar",
    "Duncan Idaho",
    "Gurney Halleck",
    "Feyd-Rautha",
    "Baron Harkonnen",
    "Princesa Irulan",
    "Obi-Wan Kenobi",
    "Qui-Gon Jinn",
    "Mace Windu",
    "Conde Dooku",
    "Boba Fett",
    "Jango Fett",
    "Ahsoka Tano",
    "Din Djarin",
    "Cassian Andor",
    "Jyn Erso",
    "Grand Moff Tarkin",
    "Director Krennic",
    "Padmé Amidala",
    "Mon Mothma",
    "Ezra Bridger",
    "Thrawn",
    "Bo-Katan",
    "Sabine Wren",
    "Maximus Decimus",
    "Commodus",
    "Amélie Poulain",
    "Atticus Finch",
    "Patrick Bateman",
    "Jordan Belfort",
    "Jules Winnfield",
    "Vincent Vega",
    "Mia Wallace",
    "Beatrix Kiddo",
    "Bill",
    "Django Freeman",
    "Dr. King Schultz",
    "Calvin Candie",
    "Anton Chigurh",
    "Llewelyn Moss",
    "Tyler Durden",
    "Marla Singer",
    "Lisbeth Salander",
    "Deckard",
    "Roy Batty",
    "Norman Bates",
    "Truman Burbank",
    "Andy Dufresne",
    "Red Redding",
    "John McClane",
    "Thelma Dickinson",
    "Louise Sawyer",
    "Tony Montana",
    "Tony Soprano",
    "Carmela Soprano",
    "Christopher Moltisanti",
    "Furio Giunta",
    "Carmy Berzatto",
    "Sydney Adamu",
    "Richie Jerimovich",
    "Shiv Roy",
    "Kendall Roy",
    "Roman Roy",
    "Logan Roy",
    "Tom Wambsgans",
    "Cousin Greg",
    "Joe Goldberg",
    "Love Quinn",
    "Aegon Targaryen",
    "Elliot Alderson",
    "Darlene Alderson",
    "Tyrell Wellick",
    "Mr. Robot",
    "Rue Bennett",
    "Jules Vaughn",
    "Fezco",
    "Cassie Howard",
    "Nate Jacobs",
    "Lexi Howard",
  ],
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
      ...mimicaFilmesSeriesExtras.facil,
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
      ...mimicaFilmesSeriesExtras.medio,
    ],
    dificil: [
      "Saul Goodman",
      "Davy Jones",
      "Raymond Reddington",
      "Gus Fring",
      "Cersei Lannister",
      "Thomas Shelby",
      "Daenerys Targaryen",
      "Jean-Luc Picard",
      "Beth Harmon",
      "Meredith Grey",
      ...mimicaFilmesSeriesExtras.dificil,
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

const whoAmIAnimationStudios = Array.from(
  new Set([
    "Snow White",
    "Evil Queen",
    "Prince Florian",
    "Doc",
    "Grumpy",
    "Happy",
    "Sleepy",
    "Bashful",
    "Sneezy",
    "Dopey",
    "Cinderella",
    "Prince Charming",
    "Fairy Godmother",
    "Lady Tremaine",
    "Drizella",
    "Anastasia Tremaine",
    "Jaq",
    "Gus Gus",
    "Lucifer",
    "Bruno",
    "Alice",
    "Mad Hatter",
    "White Rabbit",
    "Queen of Hearts",
    "Cheshire Cat",
    "March Hare",
    "Dormouse",
    "Caterpillar",
    "Tweedle Dee",
    "Tweedle Dum",
    "Peter Pan",
    "Wendy Darling",
    "John Darling",
    "Michael Darling",
    "Tinker Bell",
    "Captain Hook",
    "Mr Smee",
    "Tiger Lily",
    "Aurora",
    "Prince Phillip",
    "Maleficent",
    "Flora",
    "Fauna",
    "Merryweather",
    "Ariel",
    "Prince Eric",
    "Ursula",
    "Sebastian",
    "Flounder",
    "Scuttle",
    "King Triton",
    "Chef Louis",
    "Max (A Pequena Sereia)",
    "Belle",
    "Beast",
    "Gaston",
    "LeFou",
    "Lumiere",
    "Cogsworth",
    "Mrs Potts",
    "Chip Potts",
    "Maurice",
    "Babette",
    "Aladdin",
    "Jasmine",
    "Genie",
    "Jafar",
    "Abu",
    "Iago",
    "Magic Carpet",
    "Sultan",
    "Rajah",
    "Pocahontas",
    "John Smith",
    "Meeko",
    "Percy",
    "Grandmother Willow",
    "Governor Ratcliffe",
    "Hercules",
    "Megara",
    "Hades",
    "Phil",
    "Zeus",
    "Hera",
    "Pegasus",
    "Pain",
    "Panic",
    "Mulan",
    "Mushu",
    "Li Shang",
    "Shan Yu",
    "Cri-Kee",
    "Yao",
    "Ling",
    "Chien-Po",
    "Tarzan",
    "Jane Porter",
    "Terk",
    "Tantor",
    "Kala",
    "Kerchak",
    "Clayton",
    "Lilo",
    "Stitch",
    "Nani",
    "Jumba",
    "Pleakley",
    "Cobra Bubbles",
    "David Kawena",
    "Angel",
    "Tiana",
    "Prince Naveen",
    "Dr Facilier",
    "Charlotte La Bouff",
    "Ray",
    "Louis",
    "Mama Odie",
    "Rapunzel",
    "Flynn Rider",
    "Mother Gothel",
    "Maximus",
    "Pascal",
    "Vladimir",
    "Wreck-It Ralph",
    "Vanellope",
    "Fix-It Felix Jr",
    "Sergeant Calhoun",
    "King Candy",
    "Elsa",
    "Anna",
    "Kristoff",
    "Olaf",
    "Sven",
    "Hans",
    "Hiro Hamada",
    "Baymax",
    "Go Go Tomago",
    "Wasabi",
    "Honey Lemon",
    "Fred",
    "Tadashi Hamada",
    "Yokai",
    "Judy Hopps",
    "Nick Wilde",
    "Chief Bogo",
    "Flash",
    "Clawhauser",
    "Bellwether",
    "Mr Big",
    "Finnick",
    "Moana",
    "Maui",
    "Hei Hei",
    "Pua",
    "Tamatoa",
    "Gramma Tala",
    "Chief Tui",
    "Sina",
    "Raya",
    "Sisu",
    "Namaari",
    "Tuk Tuk",
    "Boun",
    "Tong",
    "Little Noi",
    "Mirabel Madrigal",
    "Luisa Madrigal",
    "Isabela Madrigal",
    "Bruno Madrigal",
    "Dolores Madrigal",
    "Camilo Madrigal",
    "Antonio Madrigal",
    "Julieta Madrigal",
    "Pepa Madrigal",
    "Agustin Madrigal",
    "Felix Madrigal",
    "Abuela Alma",
    "Asha",
    "Valentino",
    "King Magnifico",
    "Queen Amaya",
    "Star",
    "Simba",
    "Nala",
    "Mufasa",
    "Scar",
    "Timon",
    "Pumbaa",
    "Rafiki",
    "Zazu",
    "Sarabi",
    "Shenzi",
    "Banzai",
    "Ed",
    "Kiara",
    "Kovu",
    "Woody",
    "Buzz Lightyear",
    "Jessie",
    "Rex",
    "Hamm",
    "Slinky Dog",
    "Bo Peep",
    "Mr Potato Head",
    "Mrs Potato Head",
    "Bullseye",
    "Lotso",
    "Forky",
    "Gabby Gabby",
    "Duke Caboom",
    "Emperor Zurg",
    "James P Sullivan",
    "Mike Wazowski",
    "Boo",
    "Randall Boggs",
    "Roz",
    "Celia Mae",
    "Waternoose",
    "George Sanderson",
    "Dean Hardscrabble",
    "Nemo",
    "Dory",
    "Marlin",
    "Crush",
    "Squirt",
    "Bruce",
    "Nigel",
    "Gill",
    "Bloat",
    "Hank",
    "Destiny",
    "Bailey",
    "Mr Incredible",
    "Elastigirl",
    "Violet Parr",
    "Dash Parr",
    "Jack-Jack",
    "Frozone",
    "Edna Mode",
    "Syndrome",
    "Mirage",
    "Rick Dicker",
    "Lightning McQueen",
    "Mater",
    "Sally Carrera",
    "Doc Hudson",
    "Luigi",
    "Guido",
    "Chick Hicks",
    "Cruz Ramirez",
    "Jackson Storm",
    "Mack",
    "Remy",
    "Linguini",
    "Colette",
    "Anton Ego",
    "Skinner",
    "Emile",
    "Carl Fredricksen",
    "Russell",
    "Dug",
    "Kevin",
    "Charles Muntz",
    "WALL-E",
    "EVE",
    "AUTO",
    "MO",
    "Merida",
    "Queen Elinor",
    "King Fergus",
    "Harris",
    "Hubert",
    "Hamish",
    "Joy",
    "Sadness",
    "Anger",
    "Fear",
    "Disgust",
    "Riley Andersen",
    "Bing Bong",
    "Anxiety",
    "Ennui",
    "Embarrassment",
    "Envy",
    "Nostalgia",
    "Miguel Rivera",
    "Hector Rivera",
    "Ernesto de la Cruz",
    "Mama Imelda",
    "Mama Coco",
    "Dante",
    "Pepita",
    "Abuelita Elena",
    "Luca Paguro",
    "Alberto Scorfano",
    "Giulia Marcovaldo",
    "Ercole Visconti",
    "Massimo Marcovaldo",
    "Mei Lee",
    "Ming Lee",
    "Miriam Mendelsohn",
    "Priya Mangal",
    "Abby Park",
    "Tyler Nguyen-Baker",
    "Joe Gardner",
    "22",
    "Terry",
    "Moonwind",
    "Ian Lightfoot",
    "Barley Lightfoot",
    "Laurel Lightfoot",
    "Corey",
    "Ember Lumen",
    "Wade Ripple",
    "Bernie Lumen",
    "Clod",
    "Gale",
    "Flik",
    "Atta",
    "Dot",
    "Hopper",
    "Heimlich",
    "Francis",
    "Slim",
    "Rosie",
    "Arlo",
    "Spot",
    "Shrek",
    "Donkey",
    "Fiona",
    "Puss in Boots",
    "Lord Farquaad",
    "Dragon",
    "Gingy",
    "Pinocchio",
    "Big Bad Wolf",
    "Three Blind Mice",
    "Prince Charming",
    "Fairy Godmother",
    "Artie",
    "Merlin",
    "Rumpelstiltskin",
    "Alex",
    "Marty",
    "Gloria",
    "Melman",
    "King Julien",
    "Maurice",
    "Mort",
    "Skipper",
    "Kowalski",
    "Rico",
    "Private",
    "Po",
    "Tigress",
    "Monkey",
    "Viper",
    "Crane",
    "Mantis",
    "Master Shifu",
    "Tai Lung",
    "Oogway",
    "Lord Shen",
    "Kai",
    "Hiccup",
    "Astrid",
    "Toothless",
    "Stoick",
    "Valka",
    "Snotlout",
    "Fishlegs",
    "Ruffnut",
    "Tuffnut",
    "Gobber",
    "Drago Bludvist",
    "Eret",
    "Poppy",
    "Branch",
    "Guy Diamond",
    "Biggie",
    "Tiny Diamond",
    "Cooper",
    "Queen Barb",
    "King Trollex",
    "Satin",
    "Chenille",
    "Boss Baby",
    "Tim Templeton",
    "Ted Templeton",
    "Tina Templeton",
    "Carol Templeton",
    "Francis Francis",
    "Grug",
    "Eep",
    "Ugga",
    "Thunk",
    "Sandy",
    "Gran",
    "Guy",
    "Belt",
    "Megamind",
    "Roxanne Ritchi",
    "Metro Man",
    "Minion",
    "Tighten",
    "Barry B Benson",
    "Vanessa Bloome",
    "Adam Flayman",
    "Ken",
    "Jack Frost",
    "North",
    "Tooth Fairy",
    "Bunnymund",
    "Sandman",
    "Pitch Black",
    "Moses",
    "Ramses",
    "Tzipporah",
    "Miriam",
    "Aaron",
    "Spirit",
    "Rain",
    "Little Creek",
    "Chica Linda",
    "Sinbad",
    "Marina",
    "Eris",
    "Proteus",
    "Mr Peabody",
    "Sherman",
    "Penny Peterson",
    "Yi",
    "Everest",
    "Jin",
    "Peng",
    "Turbo",
    "Chet",
    "Tito",
    "Whiplash",
    "Guy Gagne",
    "Gru",
    "Lucy Wilde",
    "Margo",
    "Edith",
    "Agnes",
    "Dr Nefario",
    "Vector",
    "El Macho",
    "Dru",
    "Balthazar Bratt",
    "Silas Ramsbottom",
    "Kevin Minion",
    "Stuart Minion",
    "Bob Minion",
    "Otto",
    "Scarlet Overkill",
    "Herb Overkill",
    "Wild Knuckles",
    "Buster Moon",
    "Rosita",
    "Johnny",
    "Meena",
    "Ash",
    "Gunter",
    "Mike",
    "Clay Calloway",
    "Porsha Crystal",
    "Jimmy Crystal",
    "Max",
    "Duke",
    "Gidget",
    "Snowball",
    "Chloe",
    "Mel",
    "Buddy",
    "Pops",
    "Rooster",
    "Mario",
    "Princess Peach",
    "Bowser",
    "Toad",
    "Donkey Kong",
    "Cranky Kong",
    "Kamek",
    "Foreman Spike",
    "Lumalee",
    "Ted Wiggins",
    "The Lorax",
    "Audrey",
    "Once-ler",
    "O'Hare",
    "Grammy Norma",
    "E.B.",
    "Fred O'Hare",
    "Carlos the Chick",
    "Mack Mallard",
    "Pam Mallard",
    "Dax Mallard",
    "Gwen Mallard",
    "Uncle Dan",
    "Delroy",
    "Grinch",
    "Max (O Grinch)",
    "Cindy-Lou Who",
    "Manny",
    "Sid",
    "Diego",
    "Scrat",
    "Ellie",
    "Crash",
    "Eddie",
    "Buck",
    "Peaches",
    "Shira",
    "Granny",
    "Julian",
    "Blu",
    "Jewel",
    "Rafael",
    "Nico",
    "Pedro",
    "Luiz",
    "Linda",
    "Tulio",
    "Gabi",
    "Ferdinand",
    "Nina",
    "Lupe",
    "Valiente",
    "Bones",
    "Angus",
    "Horton",
    "Mayor Ned McDodd",
    "JoJo",
    "Sour Kangaroo",
    "Vlad Vladikoff",
    "Morton",
    "Rodney Copperbottom",
    "Fender",
    "Cappy",
    "Ratchet",
    "Bigweld",
    "Piper Pinwheeler",
    "Madame Gasket",
    "Aunt Fanny",
    "Mary Katherine",
    "Nod",
    "Ronin",
    "Mub",
    "Grub",
    "Queen Tara",
    "Mandrake",
    "Charlie Brown",
    "Snoopy",
    "Dracula",
    "Mavis",
    "Jonathan",
    "Dennis",
    "Wayne",
    "Wanda",
    "Frankenstein",
    "Eunice",
    "Murray",
    "Griffin",
    "Ericka",
    "Abraham Van Helsing",
    "Flint Lockwood",
    "Sam Sparks",
    "Brent McHale",
    "Steve the Monkey",
    "Tim Lockwood",
    "Earl Devereaux",
    "Manny o Camera",
    "Chester V",
    "Miles Morales",
    "Gwen Stacy",
    "Peter B Parker",
    "Spider-Man Noir",
    "Peni Parker",
    "Spider-Ham",
    "Kingpin",
    "The Spot",
    "Miguel O'Hara",
    "Jessica Drew",
    "Pavitr Prabhakar",
    "Hobie Brown",
    "Aaron Davis",
    "Olivia Octavius",
    "Rio Morales",
    "Jefferson Davis",
    "Boog",
    "Elliot",
    "Beth",
    "Shaw",
    "McSquizzy",
    "Ian",
    "Giselle",
    "Mr Weenie",
    "Katie Mitchell",
    "Rick Mitchell",
    "Linda Mitchell",
    "Aaron Mitchell",
    "Monchi",
    "PAL",
    "Eric",
    "Deborahbot 5000",
    "Din Song",
    "Long",
    "Li Na Wang",
    "Pockets",
    "Papa Smurf",
    "Smurfette",
    "Clumsy Smurf",
    "Brainy Smurf",
    "Gargamel",
    "Azrael",
    "Cody Maverick",
    "Lani Aliikai",
    "Big Z",
    "Chicken Joe",
    "Vivo",
    "Gabi",
    "Marta Sandoval",
    "Andres Hernandez",
  ]),
);

const animationStudioCharacterGroups = [
  {
    source: "Branca de Neve e os Sete Anões",
    characters: [
      "Branca de Neve",
      "Rainha Má",
      "Príncipe Florian",
      "Mestre",
      "Zangado",
      "Feliz",
      "Soneca",
      "Dengoso",
      "Atchim",
      "Dunga",
    ],
  },
  {
    source: "Cinderela",
    characters: [
      "Cinderela",
      "Príncipe Encantado",
      "Fada Madrinha",
      "Lady Tremaine",
      "Drizela",
      "Anastásia",
      "Jaq",
      "Gus Gus",
      "Lúcifer",
      "Bruno",
    ],
  },
  {
    source: "Alice no País das Maravilhas",
    characters: [
      "Alice",
      "Chapeleiro Maluco",
      "Coelho Branco",
      "Rainha de Copas",
      "Gato Risonho",
      "Lebre de Março",
      "Arganaz",
      "Lagarta",
      "Tweedle Dee",
      "Tweedle Dum",
    ],
  },
  {
    source: "Peter Pan",
    characters: [
      "Peter Pan",
      "Wendy",
      "João Darling",
      "Miguel Darling",
      "Sininho",
      "Capitão Gancho",
      "Sr. Smee",
      "Princesa Tigrinha",
    ],
  },
  {
    source: "A Bela Adormecida",
    characters: ["Aurora", "Príncipe Felipe", "Malévola", "Flora", "Fauna", "Primavera"],
  },
  {
    source: "A Pequena Sereia",
    characters: [
      "Ariel",
      "Príncipe Eric",
      "Ursula",
      "Sebastião",
      "Linguado",
      "Sabidão",
      "Rei Tritão",
      "Chef Louis",
      "Max",
    ],
  },
  {
    source: "A Bela e a Fera",
    characters: [
      "Bela",
      "Fera",
      "Gaston",
      "Lefou",
      "Lumière",
      "Horloge",
      "Senhora Potts",
      "Zip",
      "Maurice",
      "Babette",
    ],
  },
  {
    source: "Aladdin",
    characters: [
      "Aladdin",
      "Jasmine",
      "Gênio",
      "Jafar",
      "Abu",
      "Iago",
      "Tapete Mágico",
      "Sultão",
      "Rajah",
    ],
  },
  {
    source: "Pocahontas",
    characters: [
      "Pocahontas",
      "John Smith",
      "Meeko",
      "Percy",
      "Vovó Salgueiro",
      "Governador Ratcliffe",
    ],
  },
  {
    source: "Hércules",
    characters: [
      "Hércules",
      "Megara",
      "Hades",
      "Filoctetes",
      "Zeus",
      "Hera",
      "Pégaso",
      "Pânico",
      "Dor",
    ],
  },
  {
    source: "Mulan",
    characters: ["Mulan", "Mushu", "Li Shang", "Shan Yu", "Gri-Li", "Yao", "Ling", "Chien-Po"],
  },
  {
    source: "Tarzan",
    characters: ["Tarzan", "Jane", "Terk", "Tantor", "Kala", "Kerchak", "Clayton"],
  },
  {
    source: "Lilo & Stitch",
    characters: ["Lilo", "Stitch", "Nani", "Jumba", "Pleakley", "Cobra Bubbles", "David", "Angel"],
  },
  {
    source: "A Princesa e o Sapo",
    characters: ["Tiana", "Naveen", "Dr. Facilier", "Charlotte", "Ray", "Louis", "Mama Odie"],
  },
  {
    source: "Enrolados",
    characters: ["Rapunzel", "Flynn Rider", "Mamãe Gothel", "Maximus", "Pascal", "Vladimir"],
  },
  {
    source: "Detona Ralph",
    characters: ["Ralph", "Vanellope", "Felix", "Sargento Calhoun", "Rei Doce"],
  },
  {
    source: "Frozen",
    characters: ["Elsa", "Anna", "Kristoff", "Olaf", "Sven", "Hans"],
  },
  {
    source: "Operação Big Hero",
    characters: ["Hiro", "Baymax", "Go Go", "Wasabi", "Honey Lemon", "Fred", "Tadashi", "Yokai"],
  },
  {
    source: "Zootopia",
    characters: ["Judy Hopps", "Nick Wilde", "Chefe Bogo", "Flash", "Clawhauser", "Bellwether", "Sr. Big", "Finnick"],
  },
  {
    source: "Moana",
    characters: ["Moana", "Maui", "Hei Hei", "Pua", "Tamatoa", "Vovó Tala", "Chefe Tui", "Sina"],
  },
  {
    source: "Raya e o Último Dragão",
    characters: ["Raya", "Sisu", "Namaari", "Tuk Tuk", "Boun", "Tong", "Noi"],
  },
  {
    source: "Encanto",
    characters: [
      "Mirabel",
      "Luisa",
      "Isabela",
      "Bruno",
      "Dolores",
      "Camilo",
      "Antonio",
      "Julieta",
      "Pepa",
      "Agustín",
      "Félix",
      "Abuela Alma",
    ],
  },
  {
    source: "Wish: O Poder dos Desejos",
    characters: ["Asha", "Valentino", "Rei Magnífico", "Rainha Amaya", "Estrela"],
  },
  {
    source: "O Rei Leão",
    characters: [
      "Simba",
      "Nala",
      "Mufasa",
      "Scar",
      "Timão",
      "Pumba",
      "Rafiki",
      "Zazu",
      "Sarabi",
      "Shenzi",
      "Banzai",
      "Ed",
      "Kiara",
      "Kovu",
    ],
  },
  {
    source: "Toy Story",
    characters: [
      "Woody",
      "Buzz Lightyear",
      "Jessie",
      "Rex",
      "Bala no Alvo",
      "Hamm",
      "Betty",
      "Cabeça de Batata",
      "Senhora Cabeça de Batata",
      "Lotso",
      "Forky",
      "Gabby Gabby",
      "Duke Caboom",
      "Zurg",
    ],
  },
  {
    source: "Monstros S.A.",
    characters: ["Sulley", "Mike Wazowski", "Boo", "Randall", "Roz", "Celia", "Waternoose", "George Sanderson", "Hardscrabble"],
  },
  {
    source: "Procurando Nemo",
    characters: ["Nemo", "Dory", "Marlin", "Crush", "Esguicho", "Bruce", "Nigel", "Gill", "Bolha", "Hank", "Destiny", "Bailey"],
  },
  {
    source: "Os Incríveis",
    characters: ["Sr. Incrível", "Mulher-Elástica", "Violeta", "Flecha", "Zezé", "Gelado", "Edna Moda", "Síndrome", "Mirage", "Rick Dicker"],
  },
  {
    source: "Carros",
    characters: ["Relâmpago McQueen", "Mate", "Sally", "Doc Hudson", "Luigi", "Guido", "Chick Hicks", "Cruz Ramirez", "Jackson Storm", "Mack"],
  },
  {
    source: "Ratatouille",
    characters: ["Rémy", "Linguini", "Colette", "Anton Ego", "Skinner", "Emile"],
  },
  {
    source: "Up: Altas Aventuras",
    characters: ["Carl Fredricksen", "Russell", "Dug", "Kevin", "Charles Muntz"],
  },
  {
    source: "WALL-E",
    characters: ["WALL-E", "EVE", "AUTO", "M-O"],
  },
  {
    source: "Valente",
    characters: ["Mérida", "Rainha Elinor", "Rei Fergus", "Harris", "Hubert", "Hamish"],
  },
  {
    source: "Divertida Mente",
    characters: ["Alegria", "Tristeza", "Raiva", "Medo", "Nojinho", "Riley", "Bing Bong", "Ansiedade", "Tédio", "Vergonha", "Inveja", "Nostalgia"],
  },
  {
    source: "Coco",
    characters: ["Miguel", "Héctor", "Ernesto de la Cruz", "Mamá Imelda", "Mamá Coco", "Dante", "Pepita", "Vovó Elena"],
  },
  {
    source: "Luca",
    characters: ["Luca", "Alberto", "Giulia", "Ercole", "Massimo"],
  },
  {
    source: "Red: Crescer é uma Fera",
    characters: ["Mei", "Ming", "Miriam", "Priya", "Abby", "Tyler"],
  },
  {
    source: "Soul",
    characters: ["Joe Gardner", "22", "Terry", "Moonwind"],
  },
  {
    source: "Dois Irmãos",
    characters: ["Ian", "Barley", "Laurel", "Corey"],
  },
  {
    source: "Elementos",
    characters: ["Ember", "Wade", "Bernie", "Clod", "Gale"],
  },
  {
    source: "Vida de Inseto",
    characters: ["Flik", "Atta", "Dot", "Hopper", "Heimlich", "Francis", "Slim", "Rosie"],
  },
  {
    source: "O Bom Dinossauro",
    characters: ["Arlo", "Spot"],
  },
  {
    source: "Shrek",
    characters: [
      "Shrek",
      "Burro",
      "Fiona",
      "Gato de Botas",
      "Lord Farquaad",
      "Dragão",
      "Biscoito",
      "Pinóquio",
      "Lobo Mau",
      "Três Porquinhos",
      "Príncipe Encantado",
      "Fada Madrinha",
      "Artie",
      "Merlin",
      "Rumpelstiltskin",
    ],
  },
  {
    source: "Madagascar",
    characters: ["Alex", "Marty", "Gloria", "Melman", "Rei Julien", "Maurice", "Mort", "Skipper", "Kowalski", "Rico", "Recruta"],
  },
  {
    source: "Kung Fu Panda",
    characters: ["Po", "Tigresa", "Macaco", "Víbora", "Garça", "Louva-a-deus", "Mestre Shifu", "Tai Lung", "Oogway", "Lord Shen", "Kai"],
  },
  {
    source: "Como Treinar o Seu Dragão",
    characters: ["Soluço", "Astrid", "Banguela", "Stoico", "Valka", "Melequento", "Perna-de-Peixe", "Cabeça Dura", "Cabeçaquente", "Bocão", "Drago", "Eret"],
  },
  {
    source: "Trolls",
    characters: ["Poppy", "Tronco", "Diamante", "Biggie", "Tiny Diamond", "Cooper", "Rainha Barb", "Rei Trollex", "Cetim", "Chenille"],
  },
  {
    source: "O Poderoso Chefinho",
    characters: ["Poderoso Chefinho", "Tim", "Ted", "Tina", "Carol", "Francis"],
  },
  {
    source: "Os Croods",
    characters: ["Grug", "Eep", "Ugga", "Thunk", "Sandy", "Gran", "Guy", "Belt"],
  },
  {
    source: "Megamente",
    characters: ["Megamente", "Roxanne", "Metro Man", "Minion", "Tighten"],
  },
  {
    source: "Bee Movie",
    characters: ["Barry", "Vanessa", "Adam", "Ken"],
  },
  {
    source: "A Origem dos Guardiões",
    characters: ["Jack Frost", "Norte", "Fada do Dente", "Coelhão", "Sandman", "Breu"],
  },
  {
    source: "O Príncipe do Egito",
    characters: ["Moisés", "Ramsés", "Tzipora", "Miriam", "Arão"],
  },
  {
    source: "Spirit: O Corcel Indomável",
    characters: ["Spirit", "Chuva", "Pequeno Riacho", "Chica Linda"],
  },
  {
    source: "Simbad: A Lenda dos Sete Mares",
    characters: ["Simbad", "Marina", "Éris", "Proteu"],
  },
  {
    source: "As Aventuras de Peabody e Sherman",
    characters: ["Sr. Peabody", "Sherman", "Penny"],
  },
  {
    source: "Turbo",
    characters: ["Turbo", "Chet", "Tito", "Chicote", "Guy Gagné"],
  },
  {
    source: "Meu Malvado Favorito",
    characters: [
      "Gru",
      "Lucy Wilde",
      "Margo",
      "Edith",
      "Agnes",
      "Dr. Nefario",
      "Vector",
      "El Macho",
      "Dru",
      "Balthazar Bratt",
      "Silas",
      "Kevin",
      "Stuart",
      "Bob",
      "Otto",
      "Scarlet Overkill",
      "Herb",
      "Wild Knuckles",
    ],
  },
  {
    source: "Sing: Quem Canta Seus Males Espanta",
    characters: ["Buster Moon", "Rosita", "Johnny", "Meena", "Ash", "Gunter", "Mike", "Clay Calloway", "Porsha", "Jimmy Crystal"],
  },
  {
    source: "Pets: A Vida Secreta dos Bichos",
    characters: ["Max", "Duke", "Gidget", "Bola de Neve", "Chloe", "Mel", "Buddy", "Pops", "Rooster"],
  },
  {
    source: "Super Mario Bros. O Filme",
    characters: ["Mario", "Peach", "Bowser", "Toad", "Donkey Kong", "Cranky Kong", "Kamek", "Spike", "Lumalee"],
  },
  {
    source: "O Lorax: Em Busca da Trúfula Perdida",
    characters: ["Ted", "Lorax", "Audrey", "Once-ler", "O'Hare", "Vovó Norma"],
  },
  {
    source: "Patos!",
    characters: ["Mack Mallard", "Pam Mallard", "Dax Mallard", "Gwen Mallard", "Tio Dan", "Delroy"],
  },
  {
    source: "A Era do Gelo",
    characters: ["Manny", "Sid", "Diego", "Scrat", "Ellie", "Crash", "Eddie", "Buck", "Peaches", "Shira", "Vovó", "Julian"],
  },
  {
    source: "Rio",
    characters: ["Blu", "Jade", "Rafael", "Nico", "Pedro", "Luiz", "Linda", "Túlio", "Gabi"],
  },
  {
    source: "Ferdinando",
    characters: ["Ferdinando", "Nina", "Lupe", "Valiente", "Bones", "Angus"],
  },
  {
    source: "Horton e o Mundo dos Quem",
    characters: ["Horton", "Prefeito Ned McDodd", "JoJo", "Canguru", "Vlad", "Morton"],
  },
  {
    source: "Robôs",
    characters: ["Rodney", "Fender", "Cappy", "Ratchet", "Bigweld", "Piper", "Madame Gasket", "Tia Fanny"],
  },
  {
    source: "Tá Chovendo Hambúrguer",
    characters: ["Flint", "Sam Sparks", "Brent", "Steve", "Tim", "Earl", "Manny", "Chester V"],
  },
  {
    source: "Hotel Transilvânia",
    characters: ["Drácula", "Mavis", "Jonathan", "Dennis", "Wayne", "Wanda", "Frankenstein", "Eunice", "Murray", "Griffin", "Ericka", "Abraham Van Helsing"],
  },
  {
    source: "Homem-Aranha no Aranhaverso",
    characters: [
      "Miles Morales",
      "Gwen Stacy",
      "Peter B. Parker",
      "Homem-Aranha Noir",
      "Peni Parker",
      "Spider-Ham",
      "Rei do Crime",
      "Mancha",
      "Miguel O'Hara",
      "Jessica Drew",
      "Pavitr Prabhakar",
      "Hobie Brown",
      "Aaron Davis",
      "Olivia Octavius",
      "Rio Morales",
      "Jefferson Davis",
    ],
  },
  {
    source: "Bicho Vai Pegar",
    characters: ["Boog", "Elliot", "Beth", "Shaw", "McSquizzy", "Ian", "Giselle", "Sr. Weenie"],
  },
  {
    source: "A Família Mitchell e a Revolta das Máquinas",
    characters: ["Katie Mitchell", "Rick Mitchell", "Linda Mitchell", "Aaron Mitchell", "Monchi", "PAL", "Eric", "Deborahbot 5000", "Din Song"],
  },
  {
    source: "Os Smurfs",
    characters: ["Papai Smurf", "Smurfette", "Desastrado", "Gênio", "Gargamel", "Azrael"],
  },
  {
    source: "Tá Dando Onda",
    characters: ["Cody Maverick", "Lani", "Big Z", "Frango Joe"],
  },
  {
    source: "Vivo",
    characters: ["Vivo", "Gabi", "Marta", "Andrés"],
  },
];

const whoAmIAnimationStudiosPtBr = animationStudioCharacterGroups.flatMap(
  ({ source, characters }) => characters.map((name) => ({ name, source })),
);

const mimicaAnimationStudioEntries = [...whoAmIAnimationStudiosPtBr];

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
  "estudios-animacao": whoAmIAnimationStudiosPtBr,
  "super-herois": whoAmISuperHerois,
  famosos: whoAmIFamosos,
  games: whoAmIGames,
};

mimicaPools["estudios-animacao"] = {
  facil: mimicaAnimationStudioEntries.slice(0, 160),
  medio: mimicaAnimationStudioEntries.slice(160, 320),
  dificil: mimicaAnimationStudioEntries.slice(320),
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
  citySetup: {
    eyebrow: "Cidade Dorme",
    title: "Configure a rodada",
    copy:
      "Defina quantos serão assassinos e detetives. O restante vira cidadão e o app faz a distribuição segura.",
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
    remainingCharacters: [],
  },
  mimica: {
    category: "geral",
    difficulty: "medio",
    timePerRound: 45,
    currentWord: "",
    deckKey: "geral:medio",
    remainingWords: [],
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
    citySetup: document.getElementById("city-setup-screen"),
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
  openCityGame: document.getElementById("open-city-game"),
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
  city: {
    form: document.getElementById("city-setup-form"),
    playerCount: document.getElementById("city-player-count"),
    decreasePlayers: document.getElementById("city-decrease-players"),
    increasePlayers: document.getElementById("city-increase-players"),
    assassinCount: document.getElementById("city-assassin-count"),
    decreaseAssassins: document.getElementById("city-decrease-assassins"),
    increaseAssassins: document.getElementById("city-increase-assassins"),
    detectiveCount: document.getElementById("city-detective-count"),
    decreaseDetectives: document.getElementById("city-decrease-detectives"),
    increaseDetectives: document.getElementById("city-increase-detectives"),
    roleSummary: document.getElementById("city-role-summary"),
    feedback: document.getElementById("city-setup-feedback"),
    goHub: document.getElementById("go-hub-from-city"),
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
    wordSource: document.getElementById("mimica-word-source"),
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
    characterSource: document.getElementById("whoami-character-source"),
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
    instructions: document.getElementById("end-instructions"),
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

function clampCityPlayers(value) {
  return clampInteger(value, 5, 20, 5);
}

function clampRoleCount(value) {
  return clampInteger(value, 1, 20, 1);
}

function clampOptionalRoleCount(value) {
  return clampInteger(value, 0, 20, 0);
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

function buildShuffledDeck(items, currentItem = "", getKey = (item) => item) {
  const currentKey = currentItem === "" || currentItem === null ? "" : getKey(currentItem);
  const nextItems = items.filter((item) => getKey(item) !== currentKey);
  return shuffleArray(nextItems.length > 0 ? nextItems : items);
}

function getWhoAmIEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

function normalizeWhoAmIEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
}

function getMimicaEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

function normalizeMimicaEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
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

  if (screen === "citySetup") {
    setHero(heroContent.citySetup);
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

function updateCityFeedback(message = "") {
  elements.city.feedback.textContent = message;
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
  const deckKey = `${category}:${difficulty}`;

  if (state.mimica.deckKey !== deckKey) {
    state.mimica.deckKey = deckKey;
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
  }

  if (state.mimica.remainingWords.length === 0) {
    state.mimica.remainingWords = buildShuffledDeck(
      words,
      state.mimica.currentWord,
      getMimicaEntryKey,
    );
  }

  const nextWord = state.mimica.remainingWords.pop() ?? words[randomIndex(words.length)];

  state.mimica.currentWord = nextWord;
  return nextWord;
}

function syncMimicaCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(mimicaPools, nextValue)
    ? nextValue
    : "geral";

  if (state.mimica.category !== safeCategory) {
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
    state.mimica.deckKey = `${safeCategory}:${state.mimica.difficulty}`;
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
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
    state.mimica.deckKey = `${state.mimica.category}:${safeDifficulty}`;
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
    state.whoami.remainingCharacters = [];
    state.whoami.currentCharacter = "";
  }

  state.whoami.category = safeCategory;
  elements.whoami.category.value = safeCategory;
  return safeCategory;
}

function getWhoAmICharacter(category) {
  const pool = whoAmIPools[category] ?? whoAmIPools.geral;

  if (state.whoami.remainingCharacters.length === 0) {
    state.whoami.remainingCharacters = buildShuffledDeck(
      pool,
      state.whoami.currentCharacter,
      getWhoAmIEntryKey,
    );
  }

  const nextCharacter =
    state.whoami.remainingCharacters.pop() ?? pool[randomIndex(pool.length)];

  state.whoami.currentCharacter = nextCharacter;
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

function syncCityRoleInputs(preferredField = "players", nextValue = null) {
  const counts = {
    players: clampCityPlayers(elements.city.playerCount.value),
    assassins: clampRoleCount(elements.city.assassinCount.value),
    detectives: clampOptionalRoleCount(elements.city.detectiveCount.value),
  };

  if (preferredField in counts && nextValue !== null) {
    if (preferredField === "players") {
      counts.players = clampCityPlayers(nextValue);
    }
    if (preferredField === "assassins") {
      counts.assassins = clampRoleCount(nextValue);
    }
    if (preferredField === "detectives") {
      counts.detectives = clampOptionalRoleCount(nextValue);
    }
  }

  counts.assassins = Math.min(counts.assassins, counts.players - 1);
  counts.detectives = Math.min(counts.detectives, counts.players - 1);

  let citizens = counts.players - counts.assassins - counts.detectives;

  if (citizens < 1) {
    let overflow = 1 - citizens;
    const roleOrder =
      preferredField === "detectives"
        ? ["assassins", "detectives"]
        : ["detectives", "assassins"];

    roleOrder.forEach((role) => {
      if (overflow <= 0) {
        return;
      }

      const minValue = role === "assassins" ? 1 : 0;
      const reducible = counts[role] - minValue;

      if (reducible <= 0) {
        return;
      }

      const reduction = Math.min(reducible, overflow);
      counts[role] -= reduction;
      overflow -= reduction;
    });
  }

  citizens = counts.players - counts.assassins - counts.detectives;

  elements.city.playerCount.value = counts.players;
  elements.city.assassinCount.value = counts.assassins;
  elements.city.detectiveCount.value = counts.detectives;
  elements.city.roleSummary.textContent = `Total: ${counts.players} ${pluralize(
    counts.players,
    "jogador",
    "jogadores",
  )}. Serão ${counts.assassins} ${pluralize(
    counts.assassins,
    "assassino",
    "assassinos",
  )}, ${counts.detectives} ${pluralize(
    counts.detectives,
    "detetive",
    "detetives",
  )} e ${citizens} ${pluralize(citizens, "cidadão", "cidadãos")}.`;

  return {
    ...counts,
    citizens,
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

function buildCityGame(totalPlayers, assassinCount, detectiveCount) {
  const citizenCount = totalPlayers - assassinCount - detectiveCount;
  const roles = shuffleArray([
    ...Array.from({ length: assassinCount }, () => ({
      badge: "Assassino",
      title: "Você é o assassino",
      description:
        "Durante a noite, escolha alguém para eliminar em silêncio e tente não levantar suspeitas durante o dia.",
      value: "ASSASSINO",
      tone: "thief",
    })),
    ...Array.from({ length: detectiveCount }, () => ({
      badge: "Detetive",
      title: "Você é o detetive",
      description:
        "Durante a noite, investigue alguém com a ajuda do narrador e tente revelar os assassinos.",
      value: "DETETIVE",
      tone: "police",
    })),
    ...Array.from({ length: citizenCount }, () => ({
      badge: "Cidadão",
      title: "Você é cidadão",
      description:
        "Discuta, observe e vote em quem você acha que está mentindo para proteger a cidade.",
      value: "CIDADÃO",
      tone: "victim",
    })),
  ]);

  return {
    type: "city",
    name: "Cidade Dorme",
    totalPlayers,
    roles,
    setupScreen: "citySetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      "Agora afastem o celular e deixem o narrador conduzir a rodada em voz alta.",
    instructions: [
      "Cidade dorme: todos fecham os olhos.",
      "Assassinos acordam, escolhem uma vítima e voltam a dormir.",
      "Detetive acorda e aponta alguém para investigar.",
      "Cidade acorda: anuncie quem foi eliminado.",
      "Todos discutem e votam em alguém para eliminar.",
    ],
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Assassinos", value: String(assassinCount) },
      { label: "Detetives", value: String(detectiveCount) },
      { label: "Cidadãos", value: String(citizenCount) },
    ],
    hero: {
      eyebrow: "Cidade Dorme",
      title: "Distribuição de papéis",
      copy: `${assassinCount} ${pluralize(
        assassinCount,
        "assassino",
        "assassinos",
      )}, ${detectiveCount} ${pluralize(
        detectiveCount,
        "detetive",
        "detetives",
      )} e ${citizenCount} ${pluralize(citizenCount, "cidadão", "cidadãos")} na rodada.`,
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
  updateCityFeedback("");
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

function openCitySetup() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  updateCityFeedback("");
  syncCityRoleInputs();
  setActiveScreen("citySetup");
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
  const wordData = normalizeMimicaEntry(nextWord);

  resetMimicaRoundState();
  elements.mimica.word.textContent = wordData.name;
  elements.mimica.wordSource.textContent = wordData.source;
  elements.mimica.wordSource.hidden = wordData.source === "";
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
  const characterData = normalizeWhoAmIEntry(character);

  elements.whoami.characterName.textContent = characterData.name;
  elements.whoami.characterSource.textContent = characterData.source;
  elements.whoami.characterSource.hidden = characterData.source === "";
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
  const instructions = state.currentGame.instructions ?? [];
  elements.end.instructions.hidden = instructions.length === 0;
  elements.end.instructions.replaceChildren(
    ...instructions.map((instruction) => {
      const item = document.createElement("li");
      item.textContent = instruction;
      return item;
    }),
  );
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

  if (state.currentGame.type === "city") {
    openCitySetup();
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

function startCityGame() {
  const counts = syncCityRoleInputs();

  if (counts.citizens < 1) {
    updateCityFeedback("A rodada precisa ter pelo menos 1 cidadão.");
    return;
  }

  updateCityFeedback("");
  state.currentGame = buildCityGame(
    counts.players,
    counts.assassins,
    counts.detectives,
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
elements.openCityGame.addEventListener("click", openCitySetup);
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

elements.city.decreasePlayers.addEventListener("click", () => {
  syncCityRoleInputs("players", Number(elements.city.playerCount.value) - 1);
});

elements.city.increasePlayers.addEventListener("click", () => {
  syncCityRoleInputs("players", Number(elements.city.playerCount.value) + 1);
});

elements.city.playerCount.addEventListener("change", (event) => {
  syncCityRoleInputs("players", event.target.value);
});

elements.city.decreaseAssassins.addEventListener("click", () => {
  syncCityRoleInputs("assassins", Number(elements.city.assassinCount.value) - 1);
});

elements.city.increaseAssassins.addEventListener("click", () => {
  syncCityRoleInputs("assassins", Number(elements.city.assassinCount.value) + 1);
});

elements.city.assassinCount.addEventListener("change", (event) => {
  syncCityRoleInputs("assassins", event.target.value);
});

elements.city.decreaseDetectives.addEventListener("click", () => {
  syncCityRoleInputs("detectives", Number(elements.city.detectiveCount.value) - 1);
});

elements.city.increaseDetectives.addEventListener("click", () => {
  syncCityRoleInputs("detectives", Number(elements.city.detectiveCount.value) + 1);
});

elements.city.detectiveCount.addEventListener("change", (event) => {
  syncCityRoleInputs("detectives", event.target.value);
});

elements.city.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startCityGame();
});

elements.city.goHub.addEventListener("click", openHub);

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
syncCityRoleInputs();
syncMimicaCategoryInput(elements.mimica.category.value);
syncMimicaDifficultyInput(elements.mimica.difficulty.value);
syncMimicaTimeInput(elements.mimica.time.value);
syncWhoAmICategoryInput(elements.whoami.category.value);
setActiveScreen("hub");
