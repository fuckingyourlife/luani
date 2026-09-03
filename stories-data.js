// ================================================================
// STORIES DATA
// URLs diretas verificadas via Special:FilePath do Wikimedia
// Todas domínio público — Arthur Rackham, Edmund Dulac, Van Gogh,
// Franz Jüttner, Walter Crane, Gustave Doré
// ================================================================

// URLs base verificadas e funcionais:
const IMG = {
  // ---- Bela Adormecida ----
  rheam:       "https://upload.wikimedia.org/wikipedia/commons/c/ce/Henry_Meynell_Rheam_-_Sleeping_Beauty.jpg",
  craneBA:     "https://upload.wikimedia.org/wikipedia/commons/7/78/Sleeping_beauty_crane.jpg",
  dore:        "https://upload.wikimedia.org/wikipedia/commons/b/b7/Gustave_Dore_Sleeping_Beauty.jpg",
  rackhamBA:   "https://upload.wikimedia.org/wikipedia/commons/2/2a/Rackham_Sleeping_Beauty.jpg",
  fairyBA:     "https://upload.wikimedia.org/wikipedia/commons/f/f4/Sleeping_Beauty_good_fairy.jpg",

  // ---- Cinderela ----
  dulacCind:   "https://upload.wikimedia.org/wikipedia/commons/1/19/Cinderella_1910.jpeg",
  rackhamCind: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Cinderella_-_Project_Gutenberg_etext_19993.jpg",
  cindBall:    "https://upload.wikimedia.org/wikipedia/commons/8/8a/Cinderella_%281%29.jpg",
  cindSlipper: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cinderella_slipper.jpg",

  // ---- Sereia ----
  dulacMerm:   "https://upload.wikimedia.org/wikipedia/commons/4/46/Edmund_Dulac_-_The_Mermaid_-_The_Prince.jpg",
  pedersenM:   "https://upload.wikimedia.org/wikipedia/commons/d/d7/Andersen_Mermaid_Vilhelm_Pedersen.jpg",
  sirene:      "https://upload.wikimedia.org/wikipedia/commons/4/4e/La_petite_sir%C3%A8ne_-_illustration.jpg",

  // ---- Bela e a Fera ----
  craneBeauty: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Walter_Crane%2C_illustration_from_Beauty_and_the_Beast%2C_1875.jpg",
  belleIllu:   "https://upload.wikimedia.org/wikipedia/commons/5/57/BelleandBeast-Illustration.jpg",
  beautyPG:    "https://upload.wikimedia.org/wikipedia/commons/9/91/The_Beauty_and_the_Beast_-_Project_Gutenberg_etext_17396.jpg",

  // ---- Branca de Neve ----
  juttner1:    "https://upload.wikimedia.org/wikipedia/commons/9/98/Franz_J%C3%BCttner_Schneewittchen_1.jpg",
  juttner5:    "https://upload.wikimedia.org/wikipedia/commons/b/b7/Franz_J%C3%BCttner_Schneewittchen_5.jpg",
  snow7dwarfs: "https://upload.wikimedia.org/wikipedia/commons/4/47/Snow_White_and_the_Seven_Dwarfs_artbook_27.jpg",

  // ---- Chapeuzinho ----
  rackhamRRH:  "https://upload.wikimedia.org/wikipedia/commons/7/71/Little_Red_Riding_Hood_Rackham.jpg",
  pgRRH:       "https://upload.wikimedia.org/wikipedia/commons/9/9d/Little_Red_Riding_Hood_-_Project_Gutenberg_etext_19993.jpg",

  // ---- Rapunzel ----
  rackhamRap:  "https://upload.wikimedia.org/wikipedia/commons/9/98/Arthur_Rackham_Rapunzel.jpg",

  // ---- Van Gogh ----
  starryNight: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  rhone:       "https://upload.wikimedia.org/wikipedia/commons/9/94/Starry_Night_Over_the_Rhone.jpg",
};

const STORIES = [

  // ══════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "A Bela Adormecida",
    cover: IMG.rheam,
    coverBg: "#1a0030",
    tag: "Clássico",
    desc: "Uma princesa amaldiçoada, salva pelo beijo do amor verdadeiro.",
    time: "~12 min", mood: "Romântico",
    pages: [
      {
        title: "Era Uma Vez...",
        img: IMG.craneBA,
        imgCredit: "Walter Crane, 1876 — domínio público",
        text: "Era uma vez, num reino muito distante, onde as montanhas eram cobertas de névoa dourada e os rios cantavam melodias suaves, um rei e uma rainha que esperavam há anos pela chegada de um filho.\n\nQuando finalmente nasceu uma menina linda, com olhos claros como a aurora e cabelos da cor do trigo dourado, o reino inteiro festejou por sete dias. Fogueiras foram acesas nos montes, sinos tocaram nas torres e flores foram lançadas pelas janelas do castelo."
      },
      {
        title: "As Fadas Madrinhas",
        img: IMG.fairyBA,
        imgCredit: "Ilustração clássica — domínio público",
        text: "Para honrar a princesa Aurora, o rei e a rainha convidaram as sete fadas benfeitoras do reino. Uma a uma se aproximaram do berço dourado: a primeira deu a dádiva da beleza; a segunda, da graça; a terceira, da dança; a quarta, do canto; a quinta, da bondade; a sexta, da sabedoria.\n\nMas antes que a sétima pudesse falar, uma nuvem negra tomou o salão. O fogo das tochas se apagou. E um riso cortante ecoou pelas paredes de pedra."
      },
      {
        title: "A Maldição",
        img: IMG.dore,
        imgCredit: "Gustave Doré — domínio público",
        text: "A fada má, furiosa por não ter sido convidada, surgiu das sombras com um sorriso cruel.\n\n\"Quando completar dezasseis anos, ela picará o dedo num fuso de roca e cairá em sono eterno.\"\n\nA rainha soltou um grito. A sétima fada, porém, ainda não havia falado. Com voz suave: \"Não posso desfazer a maldição — mas posso transformá-la. Ela não morrerá. Dormirá até o beijo do verdadeiro amor a despertar.\""
      },
      {
        title: "O Sono Profundo",
        img: IMG.rheam,
        imgCredit: "Henry Meynell Rheam, 1899 — domínio público",
        text: "No dia de seu décimo sexto aniversário, Aurora encontrou uma torre esquecida. Lá, uma velha fiava — era a fada má disfarçada. Aurora tocou o fuso por curiosidade. A agulha picou seu dedo. E ela adormeceu.\n\nA sétima fada lançou um feitiço sobre o castelo inteiro. Guardas, cavalos, cozinheiros — todos dormiram. Uma floresta densa de espinhos cresceu ao redor, escondendo o castelo do mundo por cem anos."
      },
      {
        title: "O Príncipe Corajoso",
        img: IMG.rackhamBA,
        imgCredit: "Arthur Rackham, 1920 — domínio público",
        text: "Cem anos depois, um príncipe ouviu a lenda do castelo encantado. Cavaleiros experientes haviam tentado — e voltado com medos.\n\nMas o príncipe foi sozinho. E algo estranho aconteceu: os espinhos se afastaram ao seu toque, como se o reconhecessem. Como se o amor que ele ainda não sabia que sentia já abria caminho pra ele."
      },
      {
        title: "O Beijo que Desfez Tudo",
        img: IMG.craneBA,
        imgCredit: "Walter Crane, 1876 — domínio público",
        text: "O príncipe percorreu os corredores silenciosos e subiu à torre mais alta. Ali estava Aurora — serena, como se apenas sonhasse coisas bonitas.\n\nEle se ajoelhou ao lado dela, tomado por uma ternura que nunca havia sentido. E beijou suavemente sua testa.\n\nUm brilho dourado varreu o castelo. Os pássaros cantaram. O vento soprou. E Aurora abriu os olhos.\n\n\"Você demorou\", ela disse sorrindo.\n\nBoa noite, Luani. Dorme bem, minha princesa. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 2,
    title: "Cinderela",
    cover: IMG.dulacCind,
    coverBg: "#0e0830",
    tag: "Clássico",
    desc: "A moça de coração puro que encontrou seu lugar no mundo.",
    time: "~10 min", mood: "Mágico",
    pages: [
      {
        title: "A Casa Fria",
        img: IMG.rackhamCind,
        imgCredit: "Arthur Rackham — domínio público",
        text: "Havia uma moça chamada Cinderela que vivia numa casa grande e fria. Desde que o pai partira, a madrasta tomara conta de tudo. As meias-irmãs riam e pediam. E Cinderela limpava, cozinhava, costurava — sem reclamar, mas com o coração pesado.\n\nO que a mantinha era uma coisa pequena: ela ainda conseguia sorrir para os pássaros da janela."
      },
      {
        title: "A Fada Madrinha",
        img: IMG.dulacCind,
        imgCredit: "Edmund Dulac, 1910 — domínio público",
        text: "Cinderela foi chorar no jardim, sob o velho carvalho. \"Por que choras, meu bem?\" Uma senhora toda de luz sorria para ela. \"Sou sua fada madrinha. E esta noite, você vai ao baile.\"\n\nCom um toque de varinha: abóbora virou carruagem dourada, ratos viraram cavalos brancos. O velho avental virou um vestido de luz azul-prata. E nos pés: sapatinhos de cristal, delicados como bolhas de sabão."
      },
      {
        title: "O Baile",
        img: IMG.cindBall,
        imgCredit: "Ilustração clássica — domínio público",
        text: "No baile, todos os olhares se viraram para ela. O príncipe desceu as escadas e foi diretamente até Cinderela. Eles dançaram. Conversaram. O mundo ao redor desapareceu.\n\nEntão o relógio começou a bater. Bong. Bong. Bong. Meia-noite. Cinderela correu escada abaixo — e um sapatinho escapou do pé."
      },
      {
        title: "O Sapatinho de Cristal",
        img: IMG.cindSlipper,
        imgCredit: "Ilustração clássica — domínio público",
        text: "O príncipe percorreu o reino com o sapatinho. Todas tentaram — impossível. Quando Cinderela se aproximou humildemente, o sapatinho deslizou no pé dela perfeitamente.\n\nO príncipe olhou para seu rosto e a reconheceu. Não pela roupa. Pelo sorriso que havia guardado no coração desde o baile.\n\nCinderela foi para o castelo não porque foi salva — mas porque nunca deixou que o mundo apagasse a luz do seu coração.\n\nBoa noite, Luani. Que sua bondade sempre encontre seu lugar. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 3,
    title: "A Pequena Sereia",
    cover: IMG.dulacMerm,
    coverBg: "#001830",
    tag: "Clássico",
    desc: "A sereia que sonhava com o mundo dos humanos e encontrou o amor.",
    time: "~14 min", mood: "Sonhador",
    pages: [
      {
        title: "O Fundo do Mar",
        img: IMG.pedersenM,
        imgCredit: "Vilhelm Pedersen, 1850 — domínio público",
        text: "No fundo do oceano mais azul do mundo, onde a luz do sol chegava filtrada em raios dourados entre as algas, existia um palácio de pérola e coral.\n\nAli vivia Ariel, a mais jovem das sete filhas do Rei Tritão. Enquanto suas irmãs amavam o mar, ela passava as noites olhando para cima, para aquela luz distante que dançava na superfície. \"Lá em cima\", ela suspirava, \"deve ser tão diferente.\""
      },
      {
        title: "O Naufrágio",
        img: IMG.dulacMerm,
        imgCredit: "Edmund Dulac — domínio público",
        text: "Numa noite de tempestade, Ariel subiu até a superfície e viu um navio em chamas. Entre os marinheiros que saltavam ao mar havia um príncipe de olhos gentis, que afundava nas ondas.\n\nAriel mergulhou sem pensar. O puxou. Nadou com força até a praia. E o deixou na areia, onde o amanhecer rosado o encontrou. Ela ficou olhando para ele — e sentiu algo que nunca havia sentido antes."
      },
      {
        title: "O Negócio com Úrsula",
        img: IMG.sirene,
        imgCredit: "Ilustração clássica — domínio público",
        text: "Apaixonada, Ariel buscou a feiticeira do mar: Úrsula. \"Pernas em troca da sua voz. Três dias para conquistar um beijo de amor verdadeiro. Caso contrário...\"\n\nAriel hesitou apenas um segundo. Então assinou. Porque quem ama de verdade sempre acha que o preço vale a pena. E às vezes vale mesmo."
      },
      {
        title: "Dois Mundos, Um Amor",
        img: IMG.pedersenM,
        imgCredit: "Vilhelm Pedersen — domínio público",
        text: "O feitiço quebrou. O Rei Tritão, vendo o amor da filha, usou seu tridente para desfazê-lo — e transformou Ariel numa humana.\n\nAriel e o príncipe se casaram ao pôr do sol, num barco coberto de flores brancas, enquanto as sereias cantavam do mar.\n\nO amor não termina onde o mar encontra a terra. Ele começa exatamente ali.\n\nBoa noite, Luani. Que você sempre siga seus sonhos. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 4,
    title: "A Bela e a Fera",
    cover: IMG.craneBeauty,
    coverBg: "#100020",
    tag: "Clássico",
    desc: "Amor que vai além das aparências.",
    time: "~13 min", mood: "Romântico",
    pages: [
      {
        title: "A Jovem e os Livros",
        img: IMG.craneBeauty,
        imgCredit: "Walter Crane, 1875 — domínio público",
        text: "Numa pequena cidade vivia uma jovem chamada Bela, filha de um inventor sonhador. Enquanto todos falavam dos mesmos assuntos de sempre, ela devorava livros com olhos que brilhavam de mundos ainda não visitados.\n\n\"Ela é estranha\", diziam os vizinhos. E ela sorria — porque sabia que \"estranha\" é apenas o nome que as pessoas dão para quem pensa diferente."
      },
      {
        title: "O Castelo da Fera",
        img: IMG.beautyPG,
        imgCredit: "Project Gutenberg — domínio público",
        text: "O pai de Bela se perdeu e encontrou abrigo num castelo misterioso. Ao tentar partir, uma Fera enorme surgiu das sombras. \"Você colheu uma rosa do meu jardim. O preço é ficar aqui para sempre.\"\n\nBela foi voluntariamente. Chegou ao castelo com o coração firme — e foi recebida com uma grandiosidade que não esperava. E uma biblioteca maior do que qualquer coisa que já havia visto."
      },
      {
        title: "Os Jantares",
        img: IMG.belleIllu,
        imgCredit: "Ilustração clássica — domínio público",
        text: "Toda noite eles jantavam juntos. No começo em silêncio. Depois com pequenas perguntas. Depois com conversas que duravam até a madrugada.\n\nA Fera falava de livros, de estrelas, de coisas que nenhum humano ao redor de Bela havia mencionado. E ela percebeu: sob a brutalidade havia vergonha. Sob a vergonha, solidão."
      },
      {
        title: "Além das Aparências",
        img: IMG.craneBeauty,
        imgCredit: "Walter Crane, 1875 — domínio público",
        text: "Quando a Fera foi ferida salvando Bela, ela correu até ela. \"Não morre. Por favor.\" A última pétala caiu. Um brilho dourado envolveu tudo — e a Fera se transformou.\n\nNão num príncipe perfeito. Num ser humano com suas histórias, suas feridas, seus olhos gentis. Os mesmos olhos que Bela havia aprendido a amar.\n\nO amor verdadeiro não está em encontrar alguém perfeito — mas em encontrar alguém com quem você pode ser imperfeita.\n\nBoa noite, Luani. Que você seja sempre amada do jeito que é. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 5,
    title: "Branca de Neve",
    cover: IMG.juttner1,
    coverBg: "#001020",
    tag: "Clássico",
    desc: "A princesa e os sete anões que a protegeram da rainha má.",
    time: "~11 min", mood: "Encantador",
    pages: [
      {
        title: "O Espelho Mágico",
        img: IMG.juttner1,
        imgCredit: "Franz Jüttner — domínio público",
        text: "Era uma vez uma princesa de pele branca como neve, lábios vermelhos como rubis e cabelos negros como ébano. Seu nome era Branca de Neve.\n\nA madrasta possuía um espelho mágico. Toda manhã perguntava: \"Espelho, espelho meu, existe alguém mais bela do que eu?\" E o espelho respondia: \"Você, minha rainha.\" Até o dia em que respondeu: \"Branca de Neve é a mais bela do reino.\""
      },
      {
        title: "A Fuga para a Floresta",
        img: IMG.juttner5,
        imgCredit: "Franz Jüttner — domínio público",
        text: "A madrasta mandou um caçador levar Branca de Neve para a floresta. O caçador não conseguiu. Com lágrimas nos olhos, a libertou. \"Corre. E não volta.\"\n\nBranca de Neve correu até encontrar uma casinha minúscula e organizada, com sete cadinhas e sete caminhas. Exausta, adormeceu."
      },
      {
        title: "Os Sete Anões",
        img: IMG.snow7dwarfs,
        imgCredit: "Ilustração clássica — domínio público",
        text: "Os sete anões voltaram do trabalho e encontraram a bela estranha dormindo. Em vez de acordá-la, cobriram-na com um cobertor. Porque bondade reconhece bondade.\n\nBranca de Neve ficou com eles — mas a rainha, informada pelo espelho, foi até lá disfarçada de velha, com uma maçã vermelha e perfeita, envenenada."
      },
      {
        title: "O Despertar",
        img: IMG.juttner1,
        imgCredit: "Franz Jüttner — domínio público",
        text: "Os anões encontraram Branca de Neve caída. Com o coração partido, fizeram um caixão de cristal e ficaram ao lado dela dia e noite.\n\nUm príncipe que passava pela floresta pediu permissão para se despedir. Seu beijo desfez o encanto. Branca de Neve abriu os olhos para um mundo cheio de sol.\n\nA beleza que a rainha invejava não era do rosto. Era a luz que existia no coração de Branca de Neve.\n\nBoa noite, Luani. Que sua luz nunca se apague. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 6,
    title: "Chapeuzinho Vermelho",
    cover: IMG.rackhamRRH,
    coverBg: "#200000",
    tag: "Clássico",
    desc: "A menina do capuz vermelho e o lobo mau na floresta.",
    time: "~8 min", mood: "Aventura",
    pages: [
      {
        title: "A Menina do Capuz",
        img: IMG.pgRRH,
        imgCredit: "Project Gutenberg — domínio público",
        text: "Numa aldeia na beira da floresta vivia uma menina que todos chamavam de Chapeuzinho Vermelho, pelo lindo capuz bordado que sua vovó havia costurado com amor.\n\nEla era curiosa, corajosa e bondosa. Mas a bondade sem atenção pode nos colocar em apuros — e esta é exatamente a história que prova isso."
      },
      {
        title: "O Lobo na Floresta",
        img: IMG.rackhamRRH,
        imgCredit: "Arthur Rackham, 1909 — domínio público",
        text: "A mãe mandou Chapeuzinho levar uma cesta à vovó doente. \"Não saia do caminho.\"\n\nNa floresta, um lobo de olhos amarelos surgiu. \"Para onde vai?\" Chapeuzinho, sem desconfiar, explicou tudo. O lobo correu por um atalho enquanto ela parava para colher flores silvestres."
      },
      {
        title: "Na Casa da Vovó",
        img: IMG.pgRRH,
        imgCredit: "Project Gutenberg — domínio público",
        text: "Chapeuzinho bateu na porta. \"Entre\", disse uma voz estranha.\n\n\"Vovó, que olhos grandes você tem!\" — \"É para te ver melhor.\"\n\"Que orelhas grandes!\" — \"É para te ouvir melhor.\"\n\"Que dentes enormes!\" — \"É para te... COMER!\"\n\nO lobo saltou! Mas um caçador que passava arrombou a porta. O lobo fugiu. A vovó estava salva.\n\nChapeuzinho voltou para casa mais sábia: palavras doces podem vir de bocas perigosas.\n\nBoa noite, Luani. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 7,
    title: "Rapunzel",
    cover: IMG.rackhamRap,
    coverBg: "#0a1a00",
    tag: "Clássico",
    desc: "A jovem de cabelos dourados presa numa torre, esperando a liberdade.",
    time: "~10 min", mood: "Mágico",
    pages: [
      {
        title: "A Torre",
        img: IMG.rackhamRap,
        imgCredit: "Arthur Rackham — domínio público",
        text: "No alto de uma torre sem escadas, sem portas, com apenas uma única janela no alto, vivia uma jovem chamada Rapunzel.\n\nSeu cabelo dourado media mais de vinte metros. Ela passava os dias cantando para os pássaros que pousavam no peitoril e pintando as paredes com cores que imaginava do mundo lá fora."
      },
      {
        title: "A Bruxa e o Segredo",
        img: IMG.rackhamRap,
        imgCredit: "Arthur Rackham — domínio público",
        text: "A bruxa Gothel havia a sequestrado quando bebê. Toda tarde subia pelos cabelos de Rapunzel e lhe contava que o mundo era perigoso e cruel.\n\n\"Você está segura aqui\", dizia a bruxa. \"O mundo lá fora vai te machucar.\"\n\nRapunzel acreditava. Porque era a única coisa que conhecia."
      },
      {
        title: "O Príncipe",
        img: IMG.rackhamRap,
        imgCredit: "Arthur Rackham — domínio público",
        text: "Um dia, um príncipe ouviu uma voz de tirar o fôlego vindo do alto de uma torre. Ele voltou no dia seguinte. E no outro. E finalmente chamou: \"Rapunzel, Rapunzel, jogue seus cabelos dourados!\"\n\nPela primeira vez na vida, ela não estava sozinha."
      },
      {
        title: "A Liberdade",
        img: IMG.rackhamRap,
        imgCredit: "Arthur Rackham — domínio público",
        text: "A bruxa descobriu. Em fúria, cortou os cabelos de Rapunzel. Mas o amor — o amor verdadeiro — não é apagado por nenhuma tesoura.\n\nOs dois se encontraram novamente. Ela curou os olhos dele com suas lágrimas. E juntos descobriram que a maior torre do mundo não é de pedra — é o medo de não ser amado.\n\nBoa noite, Luani. Que você nunca tenha medo de ser amada. 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 10,
    title: "A Princesa que Soube Perdoar",
    cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=90&fit=crop",
    coverBg: "#2a0020",
    tag: "Nossa História",
    desc: "A história real de Luani e Felipe — sobre amor, erro, perdão e recomeço.",
    time: "~8 min", mood: "Especial",
    pages: [
      {
        title: "A Princesa Luani",
        img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Era uma vez uma princesa chamada Luani, conhecida em todo o reino por sua bondade, seu sorriso encantador e, principalmente, pelo enorme coração que carregava.\n\nLuani amava um rapaz chamado Felipe. Para ela, ele era alguém especial, alguém por quem ela acreditava que valia a pena lutar. Eles viveram momentos felizes juntos, fizeram promessas e imaginaram um futuro lado a lado."
      },
      {
        title: "A Dor",
        img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Mas um dia, Felipe cometeu um erro que machucou profundamente Luani. Ele a traiu.\n\nQuando Luani descobriu, seu coração pareceu quebrar em mil pedaços. Ela chorou, ficou decepcionada e passou noites pensando em como alguém que ela amava tanto poderia ter feito aquilo."
      },
      {
        title: "O Arrependimento",
        img: "https://images.unsplash.com/photo-1455541504462-57ebb2a9cec1?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Felipe percebeu o tamanho de seu erro. Arrependido, pediu perdão e mostrou a Luani que realmente queria mudar. Ele sabia que apenas dizer \"desculpa\" não seria suficiente. Então, dia após dia, tentou reconquistar sua confiança.\n\nLuani sabia que perdoar não significava esquecer o que havia acontecido. Ainda existia uma ferida em seu coração, mas também existia um sentimento que nunca havia desaparecido: seu amor por Felipe."
      },
      {
        title: "A Escolha",
        img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Depois de muito pensar, Luani decidiu perdoá-lo.\n\n— Eu não posso apagar o que aconteceu — disse ela. — Mas posso escolher acreditar que você pode ser melhor daqui para frente.\n\nFelipe segurou sua mão e prometeu que jamais voltaria a fazê-la sentir aquela dor."
      },
      {
        title: "O Recomeço",
        img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "A partir daquele dia, os dois começaram novamente. Não como se nada tivesse acontecido, mas como duas pessoas que aprenderam que o amor também precisa de respeito, confiança e esforço.\n\nLuani continuou sendo a princesa do reino, mas descobriu que sua maior força não vinha de uma coroa. Vinha de seu coração.\n\nE, mesmo depois de tudo, quando Felipe olhava para ela, Luani ainda sorria.\n\nE assim, os dois seguiram juntos, tentando escrever um novo capítulo de sua história — dessa vez, com mais amor, sinceridade e cuidado um pelo outro. ❤️\n\nEu te amo, Lu. Para sempre."
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 11,
    title: "A Noite em que Ela Não Conseguia Dormir",
    cover: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=90&fit=crop",
    coverBg: "#050520",
    tag: "Nossa História",
    desc: "A noite em que Luani ficou acordada pensando em Felipe, e ele estava lá.",
    time: "~7 min", mood: "Especial",
    pages: [
      {
        title: "O Reino Dormia",
        img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Era uma vez uma princesa chamada Luani que ainda não conseguia dormir.\n\nA noite estava silenciosa, o reino inteiro parecia descansar, mas Luani continuava acordada, deitada em sua cama, olhando para o teto e pensando em uma única pessoa: Felipe.\n\nEla pegou o celular e ficou olhando para a conversa dos dois. Por mais que tentasse fechar os olhos, seus pensamentos sempre voltavam para ele."
      },
      {
        title: "Ele Percebeu",
        img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Então, Felipe percebeu que ela ainda estava acordada.\n\n— Você ainda não dormiu, princesa? — perguntou ele.\n\n— Não consigo... — respondeu Luani. — Estou pensando em você.\n\nFelipe sorriu e respondeu:\n\n— Então fica comigo mais um pouquinho. Não precisa dormir agora."
      },
      {
        title: "Conversando até Tarde",
        img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Eles começaram a conversar sobre tudo. Relembraram momentos engraçados, falaram sobre sonhos para o futuro e imaginaram como seria se os dois pudessem fugir para um castelo só deles, onde não existissem problemas.\n\nDepois de um tempo, Luani perguntou:\n\n— Felipe, você ainda me ama?\n\nEle respondeu sem hesitar:\n\n— Mais do que você imagina."
      },
      {
        title: "Mesmo Depois de Tudo",
        img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Luani ficou alguns segundos em silêncio.\n\n— Mesmo depois de tudo?\n\n— Principalmente depois de tudo. Eu sei que errei, mas não quero perder a pessoa que eu mais amo.\n\nA princesa sorriu, sentindo o coração aquecer.\n\n— Eu também te amo, Felipe.\n\nAquela noite, Luani finalmente percebeu que não precisava ter medo de ficar sozinha. Felipe estava ali, conversando com ela, fazendo-a sorrir e prometendo que tentaria ser alguém melhor para ela todos os dias."
      },
      {
        title: "Boa Noite, Princesa",
        img: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=90&fit=crop",
        imgCredit: "Nossa história",
        text: "Quando o relógio já estava muito tarde, Luani finalmente fechou os olhos.\n\n— Boa noite, meu Felipe.\n\n— Boa noite, minha princesa Luani. Eu te amo.\n\nE, pela primeira vez naquela noite, Luani conseguiu dormir sorrindo.\n\nPorque, mesmo depois de uma história cheia de erros, lágrimas e perdão, ela ainda acreditava que ela e Felipe poderiam escrever juntos um final feliz. ❤️\n\nDorme bem, Lu. Eu sempre vou estar aqui. — Felipe 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 8,
    title: "O Dragão Gentil",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90&fit=crop",
    coverBg: "#002010",
    tag: "Original Felipe",
    desc: "Uma história original do Felipe sobre coragem e amizade verdadeira.",
    time: "~9 min", mood: "Aventura",
    pages: [
      {
        title: "O Reino nas Nuvens",
        img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=90&fit=crop",
        imgCredit: "Fotografia — Unsplash",
        text: "Era uma vez um reino tão alto nas montanhas que as nuvens passavam por baixo das janelas do castelo. A princesa Luna era conhecida por uma coisa: ela não fugia de nada.\n\nQuando um dragão apareceu nas redondezas, ela foi a única que pediu para ir falar com ele. Sozinha. Com as mãos livres."
      },
      {
        title: "O Choro de Fogo",
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90&fit=crop",
        imgCredit: "Fotografia — Unsplash",
        text: "O dragão estava no alto da pedra mais larga da montanha. Enorme, com escamas de cobre queimado. E estava chorando — lágrimas de fogo escorriam pelo seu focinho.\n\nLuna caminhou até ele e sentou na pedra ao lado. \"Por que você chora?\"\n\n\"Porque todo mundo foge de mim. Nunca tive um amigo sequer.\"\n\n\"Então senta aqui do meu lado\", ela disse. \"Porque agora você tem um.\""
      },
      {
        title: "Ember",
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90&fit=crop",
        imgCredit: "Fotografia — Unsplash",
        text: "O dragão se chamava Ember. Ele vivia há séculos e havia visto coisas que nenhum livro registrara. Guerras terminarem com apertos de mão. Florestas nascerem em terra queimada.\n\n\"E você nunca teve ninguém pra contar isso?\", perguntou Luna.\n\n\"Você é a primeira que não correu.\"\n\nEsta história me faz pensar, Luani. Que o que parece assustador por fora é muitas vezes apenas alguém que nunca aprendeu como pedir colo. A coisa mais corajosa do mundo não é chegar com uma espada. É chegar com uma pergunta gentil.\n\nEu te amo muito. Dorme bem. — Felipe 🌙"
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 9,
    title: "A Menina e as Estrelas",
    cover: IMG.starryNight,
    coverBg: "#000820",
    tag: "Original Felipe",
    desc: "Uma história original sobre sonhos, paciência e a magia do céu noturno.",
    time: "~7 min", mood: "Poético",
    pages: [
      {
        title: "O Telhado e o Pote",
        img: IMG.rhone,
        imgCredit: "Van Gogh — Noite Estrelada sobre o Ródano, 1888 — domínio público",
        text: "Toda noite, depois que a mamãe apagava as luzes, uma menina chamada Clara subia ao telhado com um pote de vidro vazio.\n\nEla havia ouvido dizer que, às vezes, quando o céu está muito quieto, uma estrela cai. E ela queria pegar uma — não para guardar, mas só para ver de perto.\n\nNoite após noite, o pote voltava vazio. E ela voltava sorrindo do mesmo jeito."
      },
      {
        title: "A Espera",
        img: IMG.starryNight,
        imgCredit: "Van Gogh — A Noite Estrelada, 1889 — domínio público",
        text: "As pessoas da aldeia riam dela. \"Estrelas não caem perto de gente comum.\"\n\nMas Clara não desistia. Ela havia dado nomes para as constelações que ela mesma inventou: A Colher Quebrada, A Borboleta Preguiçosa, O Gato que Dorme Tarde.\n\nE conversava com elas como se fossem velhas amigas."
      },
      {
        title: "A Estrelinha",
        img: IMG.rhone,
        imgCredit: "Van Gogh, 1888 — domínio público",
        text: "Numa noite de inverno, o frio era tão forte que a respiração de Clara formava nuvens no ar. Ela já estava quase dormindo quando sentiu um calor na palma da mão.\n\nUma luz do tamanho de um vaga-lume estava ali. Dourada. Quentinha.\n\n\"Você esperou muito\", disse ela com voz fininha.\n\n\"Valeu cada noite\", Clara respondeu."
      },
      {
        title: "A Escolha",
        img: IMG.starryNight,
        imgCredit: "Van Gogh — domínio público",
        text: "Clara ficou muito tempo olhando para a estrelinha. Era linda. Quentinha. Então ela abriu as mãos e soprou.\n\nA estrelinha subiu devagar, traçando uma curva de luz no céu. A mãe, que havia visto tudo, foi ao telhado. \"Por que soltou?\"\n\n\"Porque algumas coisas são mais bonitas quando estão livres. E eu já vi de perto. Bastou.\"\n\nVocê é assim, Luani. Você brilha mesmo quando está longe. Boa noite.\n— Felipe 🌟"
      }
    ]
  }
];
