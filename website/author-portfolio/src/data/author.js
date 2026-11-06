// ALL site content lives here. Everything is fictional and original.
// Swap in a real author by editing this file and replacing the image URLs.

const u = (id, w = 1200, q = 75) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`;

// Every photo used on the site (verified HTTP 200 on 2026-10-30).
export const images = {
  portrait: u('1438761681033-6461ffad8d80', 900), // calm portrait, lake
  portraitAlt: u('1494790108377-be9c29b29330', 900),
  libraryNight: u('1481627834876-b7833e8f5570', 1600),
  libraryWarm: u('1507842217343-583bb7270b66', 1600),
  libraryCurve: u('1524995997946-a1c2e315a42f', 1600),
  fogCastle: u('1518709268805-4e9042af9f23', 1400),
  torch: u('1519074069444-1ba4fff66d16', 1400),
  pen: u('1455390582262-044cdead277a', 1400),
  pages: u('1457369804613-52c61a468e7d', 1400),
  openBook: u('1509021436665-8f07dbf5bf1d', 1400),
  highlands: u('1470071459604-3b5ec3a7fe05', 1600),
  forest: u('1448375240586-882707db888b', 1400),
  mountainsNight: u('1519681393784-d120267933ba', 1600),
  cloudSea: u('1506905925346-21bda4d32df4', 1600),
  hills: u('1501854140801-50d01698950b', 1400),
  fairyGlen: u('1472214103451-9374bd1c798e', 1400),
  road: u('1500530855697-b586d89ba3ee', 1400),
  notebook: u('1516414447565-b14be0adf13e', 1400),
};

export const author = {
  name: 'Elara Voss',
  monogram: 'EV',
  tagline: 'Stories written in lantern light.',
  eyebrow: 'Author of The Lanternfall Trilogy',
  location: 'Edinburgh, Scotland',
  shortBio:
    'Elara Voss writes literary fantasy about lost things and the people who carry lanterns to find them. Her Lanternfall Trilogy, a drowned city, a lamp and the moths that guard its memories, has sold over four hundred thousand copies and been translated into twenty-three languages. She lives in Edinburgh with two cats, three typewriters, and an unreasonable number of candles.',
  longBio: [
    'Elara Voss grew up in a lighthouse keeper’s cottage on the east coast of Scotland, where the power failed so often that stories were the only reliable light. Her grandmother told them in the dark, and by the age of nine Elara was writing them down by torchlight under the blankets.',
    'She studied medieval literature in Edinburgh, then spent a decade working in a second-hand bookshop on Candlemaker Row, where she read, by her own estimate, four thousand first chapters and finished about one in ten. That education in what makes a reader stay shaped everything she wrote afterwards.',
    'Her debut, The Lantern Keeper, was turned down by eleven publishers before it found a home, and went on to become the first volume of the Lanternfall Trilogy: a quiet, strange, stubbornly hopeful epic about a drowned city, the moths that guard its memories, and the woman who tends the last lamp. The series has sold over four hundred thousand copies and is published in twenty-three languages.',
    'Between trilogy volumes she wrote Salt & Saint Elsewhere, a standalone about a fishing village that wakes one morning to find the sea has gone, and her forthcoming novel, The Cartographer’s Daughter, follows a mapmaker’s child who inherits a map of places that do not exist yet.',
    'Elara writes only after midnight, always longhand first, always with a candle on the desk. She is at work on her next book and, she says, is “mostly afraid of it, which is how I know it’s the right one.”',
  ],
  funFacts: [
    'Writes only after midnight',
    'Owns 3 typewriters',
    'Drafts every book longhand',
    'Has never finished a crossword',
    'Keeps a jar of moth wings (found, never caught)',
    'Walks Arthur’s Seat at dawn',
  ],
  signature: 'Elara Voss',
  socials: [
    { name: 'Instagram', handle: '@elara.voss.writes', url: '#' },
    { name: 'Bluesky', handle: '@elaravoss.example', url: '#' },
    { name: 'Threads', handle: '@elara.voss.writes', url: '#' },
    { name: 'Goodreads', handle: 'Elara Voss', url: '#' },
  ],
  contacts: {
    readers: { label: 'Readers', email: 'hello@example.com', note: 'Letters are read by Elara herself, usually within a month.' },
    press: { label: 'Publicist', name: 'Marguerite Oakhaven', org: 'Hartwell & Finch Publicity', email: 'press@example.com' },
    agent: { label: 'Literary agent', name: 'Tobias Reed', org: 'Reed & Lowe Literary Agency', email: 'rights@example.com' },
  },
  portrait: images.portrait,
  portraitAlt: 'Portrait of Elara Voss, a woman with short auburn hair beside a still lake.',
};

export const books = [
  {
    slug: 'the-lantern-keeper',
    title: 'The Lantern Keeper',
    series: 'Lanternfall Trilogy',
    number: 1,
    year: 2019,
    releaseDate: '2019-10-03',
    status: 'published',
    logline: 'When the last lamp of a drowned city flickers, one keeper must decide what the dark is owed.',
    blurb:
      'Every night for forty years, Ines Marrow has climbed the Salt Stair to light the last lantern of Lanternfall, a city that sank beneath its own tide before she was born. The lamp keeps the moths calm, and the moths keep the city’s memories from drifting away. But tonight the flame will not catch, and a stranger is waiting at the top of the stair with a map of streets that have not existed for centuries.\n\nTo relight the lamp, Ines must descend through the flooded districts, trade secrets with the moths, and learn why a city would choose to be forgotten. Part ghost story, part love letter to the people who tend small lights, The Lantern Keeper is a luminous debut about grief, duty, and the cost of remembering.',
    excerpt:
      'The lamp would not catch.\n\nInes struck the third match and watched it die in the draught that always came up the Salt Stair, the one her mother had called the city’s breath. Below her the water slapped at the old market steps. Above her there was only the long grey bruise of the evening and the lantern, cold, with its glass face turned to the sea like a patient animal.\n\n“Come on,” she said. She had said it to the lamp every night for forty years, and every night it had answered in light. “Come on, old thing.”\n\nThe fourth match she lit with her hands cupped like a prayer. For a moment the wick bloomed blue, and she let herself breathe. Then something small and soft brushed her wrist, and the flame bent toward it and went out.\n\nA moth sat on her knuckle. Not the grey kind that came in at the window in summer, but a pale, heavy thing the colour of old paper, with eyes like two drops of ink and wings marked in a faint, deliberate script. She had seen them only in the corners of the lamp-room, never close, never by choice.\n\n“You should not have come up,” said a voice behind her.\n\nInes did not turn at once. Forty years of the stair had taught her that the worst news arrives when you are looking the other way. When she did, a man stood in the doorway, soaked to the knees, holding a roll of vellum that smelled of the deep.\n\n“I am sorry,” he said, and he sounded as though he meant it. “But the city has been trying to tell you something, and tonight it has run out of patience.”\n\nBehind him, one by one, every window in the drowned district began to glow.',
    pages: 384,
    genres: ['Literary fantasy', 'Magical realism', 'Gothic'],
    cover: { palette: ['#1b2a41', '#324a5f', '#e8a84a'], motif: 'lantern', titleLayout: 'stacked' },
    reviews: [
      { quote: 'A debut that glows from the inside. I read the last fifty pages by candlelight, which felt only polite.', source: 'The Northern Review' },
      { quote: 'Quiet, strange, and quietly devastating. Voss writes grief the way tides write on sand.', source: 'Harbour & Quill' },
      { quote: 'The moths alone are worth the price of admission.', source: 'Meridian Magazine' },
    ],
    retailers: [
      { name: 'Bookshop', url: '#' },
      { name: 'Waterstones', url: '#' },
      { name: 'Amazon', url: '#' },
      { name: 'Audible', url: '#' },
    ],
    awards: ['Saltire First Book Prize, shortlist 2020', 'Lantern Prize for Debut Fiction, winner 2020'],
  },
  {
    slug: 'a-city-of-paper-moths',
    title: 'A City of Paper Moths',
    series: 'Lanternfall Trilogy',
    number: 2,
    year: 2021,
    releaseDate: '2021-09-16',
    status: 'published',
    logline: 'A city made of pages begins to burn, and the only witness is a girl who cannot read.',
    blurb:
      'Three winters after the lamp was relit, the surface town of Harrow Quay has begun to forget itself: street names slip, birthdays blur, and the baker cannot remember what bread is for. Wren Alder, a thirteen-year-old who has never learned to read, is the only one who notices that the forgetting has a shape, and that the shape is moving.\n\nHer search leads below the water to the Paper City, a metropolis folded from every unfinished letter ever written, populated by archivists, forgers, and moths with opinions. As fires creep through its margins, Wren must choose between saving the stories or saving the people in them. The second Lanternfall novel is darker, wilder, and more tender than the first, a book about the things we leave unsaid.',
    excerpt:
      'The first thing Wren learned about the Paper City was that it was louder than it looked.\n\nFrom the water-stairs it seemed a hush of white towers and leaning lanes, each one folded from sheets so thin the lantern-light came through them like dawn through an eyelid. But the moment her boots touched the first landing the whole place began to rustle, a million small sounds braided into one: pages turning, ink drying, the soft argument of paper against paper.\n\n“You are shouting,” said the archivist at her elbow.\n\n“I haven’t said anything.”\n\n“Your pockets are shouting.” She was a small woman wrapped in so many scarves she resembled a parcel, and she had a pencil behind each ear. “That is a great deal of unsent mail you are carrying, child.”\n\nWren put her hand over her coat. It was true that she had been collecting the letters, the ones the town had stopped delivering because no one could recall who they were for. She had meant to ask the moths what to do with them. She had not meant for the city to know.\n\n“I can’t read them,” she admitted, and it was the first time she had said that aloud to a stranger.\n\nThe archivist looked at her for a long moment. Then she smiled, and her whole parcel of scarves seemed to loosen. “My dear girl,” she said, “nobody here reads them. We listen.”\n\nAnd she held one of Wren’s letters up to her ear, and the paper began, very softly, to speak.',
    pages: 432,
    genres: ['Literary fantasy', 'Coming-of-age', 'Magical realism'],
    cover: { palette: ['#3d2b3d', '#8c5a6e', '#f2d9b8'], motif: 'moth', titleLayout: 'centered' },
    reviews: [
      { quote: 'A sequel that dares to be stranger than its predecessor, and succeeds on every page.', source: 'The Northern Review' },
      { quote: 'Wren is the most unforgettable young heroine in fantasy this decade.', source: 'The Wayfarer Post' },
      { quote: 'I have not cried at a book about paper before. I have now.', source: 'Bellwether Books Blog' },
    ],
    retailers: [
      { name: 'Bookshop', url: '#' },
      { name: 'Waterstones', url: '#' },
      { name: 'Amazon', url: '#' },
      { name: 'Audible', url: '#' },
    ],
    awards: ['Hawthorn Fantasy Award, winner 2022', 'Saltire Fiction Prize, longlist 2022'],
  },
  {
    slug: 'the-last-wick',
    title: 'The Last Wick',
    series: 'Lanternfall Trilogy',
    number: 3,
    year: 2023,
    releaseDate: '2023-10-12',
    status: 'published',
    logline: 'The final flame is nearly spent, and the whole drowned world must agree what light is worth.',
    blurb:
      'The lamps are going out across Lanternfall, one district at a time, and the moths have begun to leave. Ines Marrow is old now, and Wren Alder is no longer a child; together they hold the last wick of the original flame, a thread of fire older than the city, and a decision neither wants to make.\n\nTo carry it to the Ninth Tower, they must cross the Glass Marsh, bargain with the Salt Court, and face the first keeper, who has been waiting beneath the tide for a thousand years. The Last Wick brings the trilogy to a close with grace, grit, and a final image readers will carry for years: a story about letting go of what we love so that it can go on without us.',
    excerpt:
      'They carried the wick in a jar of river glass, and by the ninth night Wren had stopped pretending she wasn’t talking to it.\n\n“You’re quiet tonight,” she told the flame, which was a foolish thing to say to a flame. It leaned toward her anyway, the way a cat leans toward a hand it has decided to forgive.\n\nAcross the fire Ines slept with her back to a drowned oak and her coat pulled up to her ears. In sleep she looked less like the keeper of the last lantern and more like what she was: an old woman a long way from her kitchen. Wren drew the blanket higher over her shoulders and did not wake her.\n\nThe Glass Marsh stretched ahead in the dark, mile on mile of black water so still it held the stars like a second sky. Somewhere in the middle of it stood the Ninth Tower. Nobody alive had seen it. Nobody dead had agreed on what it was.\n\n“When we get there,” Wren whispered, “do you think it will hurt?”\n\nThe wick did not answer. But a single pale moth, the first they had seen in a week, drifted out of the reeds and settled on the rim of the jar, and together the three of them watched the marsh and waited for morning.\n\nIt came slowly, the way forgiveness comes. And with it, on the far edge of the water, the first light that was not theirs.',
    pages: 456,
    genres: ['Literary fantasy', 'Epic', 'Magical realism'],
    cover: { palette: ['#2a1d12', '#a8541f', '#ffd488'], motif: 'wick', titleLayout: 'stacked' },
    reviews: [
      { quote: 'A perfect ending: inevitable, surprising, and so tender it hurts.', source: 'The Northern Review' },
      { quote: 'Voss has built a world and then, bravely, let it go.', source: 'Meridian Magazine' },
      { quote: 'The best trilogy conclusion I have read in years. Bring tissues and a candle.', source: 'The Wayfarer Post' },
    ],
    retailers: [
      { name: 'Bookshop', url: '#' },
      { name: 'Waterstones', url: '#' },
      { name: 'Amazon', url: '#' },
      { name: 'Audible', url: '#' },
    ],
    awards: ['Lantern Prize for Fantasy, winner 2024', 'Goodreads Choice Award, finalist 2023'],
  },
  {
    slug: 'salt-and-saint-elsewhere',
    title: 'Salt & Saint Elsewhere',
    series: null,
    number: null,
    year: 2022,
    releaseDate: '2022-04-07',
    status: 'published',
    logline: 'One morning the sea simply leaves, and a village learns what it was really holding on to.',
    blurb:
      'In the fishing village of Saint Elsewhere, the sea has always been the loudest neighbour. Then one grey Tuesday the tide goes out and does not come back, leaving boats stranded on cracked mud and nets hanging over nothing at all.\n\nAs the villagers argue over whom to blame, a retired schoolteacher begins walking out across the empty seabed, following a line of old salt-white footprints no one else will admit to seeing. Funny, haunted, and fiercely compassionate, Salt & Saint Elsewhere is a standalone novel about community, faith, and the stories small places tell to stay afloat. It is Elara Voss at her most intimate: no moths, no drowned cities, just a village, a mystery, and the long walk toward the horizon.',
    excerpt:
      'On the morning the sea left, Agnes Pell was in the middle of scolding a seagull.\n\n“That is a perfectly good chip,” she told it, “and you have no right.” The gull, unmoved, took the chip and the dignity of the exchange and flapped off over the harbour wall. Agnes turned to find something to say about it to the harbour, and discovered that the harbour had gone.\n\nNot the wall, nor the quay, nor the thirty-one boats of Saint Elsewhere, which now sat tilted and astonished on a plain of grey-gold mud. Just the water. Where it had been there was an enormous quiet, and far out, very small, a line of pale shapes like a trail of stitches.\n\nBy nine o’clock the whole village stood along the wall in their slippers.\n\n“It’s the council,” said Mr Doyle. “They’ve been cutting the budget.”\n\n“It is the end of days,” said the vicar, with some relish.\n\n“It is low tide,” said the youngest Pell, who was eight and insufferable.\n\n“It has been low tide for two hours,” said Agnes, and then she hitched up her skirt, climbed down the barnacled ladder, and stepped onto the sea floor. The mud took her shoe. She let it.\n\nBehind her somebody gasped. Somebody else began, quite sensibly, to pray. And Agnes Pell, seventy-one years old and not at all afraid, set off toward the stitches, because in forty years of teaching she had learned that when something very large goes missing, the sensible thing is to go and ask it why.',
    pages: 312,
    genres: ['Literary fiction', 'Magical realism', 'Comic fantasy'],
    cover: { palette: ['#1f3b3a', '#5a8f8b', '#f4ecdd'], motif: 'wave', titleLayout: 'left' },
    reviews: [
      { quote: 'Funny, wise, and quietly enormous. A village novel with the tide pulled out from under it.', source: 'Harbour & Quill' },
      { quote: 'I laughed on page one and wept on page three hundred.', source: 'The Wayfarer Post' },
      { quote: 'Proof that Voss can do anything, including whimsy with a spine of steel.', source: 'The Northern Review' },
    ],
    retailers: [
      { name: 'Bookshop', url: '#' },
      { name: 'Waterstones', url: '#' },
      { name: 'Amazon', url: '#' },
      { name: 'Audible', url: '#' },
    ],
    awards: ['Costa-Dunmore Novel Award, shortlist 2022'],
  },
  {
    slug: 'the-cartographers-daughter',
    title: 'The Cartographer’s Daughter',
    series: null,
    number: null,
    year: 2027,
    releaseDate: '2027-03-14',
    status: 'upcoming',
    logline: 'A mapmaker’s child inherits a map of places that do not exist yet, and one of them is on fire.',
    blurb:
      'When Mirren Calder’s father dies, he leaves her a shop of brass compasses, a cat with a grudge, and a single unfinished map drawn in an ink that will not dry. It shows a coastline she has never seen, a river that bends where no river runs, and a harbour town marked, in her father’s unmistakable hand, with the word Soon.\n\nThen the town appears on the horizon, and the map begins to change as she walks toward it. Mirren must decide whether to follow the chart or redraw it, while a rival cartographer, a smuggler with a borrowed name, and the weight of every place her father never got to visit press in from all sides. A story about inheritance, ambition, and the courage to draw your own edges.',
    excerpt:
      'The map arrived with the rain, which was the first sign that it was not an ordinary map.\n\nMirren found it on her father’s drafting table the morning after the funeral, pinned flat with four brass weights, the ink still shining as though he had only stepped out for tea. She had known every chart in the shop since she could walk: the Hebridean tide-tables, the great river-atlas of the Spey, the star-maps that curled at the edges like sleeping leaves. She had never seen this coastline.\n\nShe touched the paper. The ink moved, ever so slightly, like the surface of a pond.\n\nAt the bottom, in the corner where a cartographer signs his work, her father had written a single word and underlined it twice. Not his name. Not a date. Just: Soon.\n\n“That’s not helpful,” Mirren told the empty shop. The cat, a one-eyed grey creature named Admiralty, regarded her from the windowsill with the weary contempt of someone who has seen this before.\n\nOutside, the rain thickened. Down at the harbour the foghorn sounded twice, a signal she had never once heard in all her nineteen years, and on the map, in the very place her finger rested, a tiny new lighthouse began, stroke by careful stroke, to draw itself.',
    pages: 408,
    genres: ['Literary fantasy', 'Adventure', 'Coming-of-age'],
    cover: { palette: ['#2f4a3e', '#b4472b', '#f4ecdd'], motif: 'compass', titleLayout: 'centered' },
    reviews: [
      { quote: 'Early readers are calling it her most beautiful book yet. I see no reason to argue.', source: 'The Northern Review (advance)' },
      { quote: 'A map to somewhere wonderful. Pre-order immediately.', source: 'Bellwether Books Blog (advance)' },
      { quote: 'Voss at the height of her powers, and in love with the edges of the world.', source: 'Meridian Magazine (advance)' },
    ],
    retailers: [
      { name: 'Bookshop', url: '#' },
      { name: 'Waterstones', url: '#' },
      { name: 'Amazon', url: '#' },
      { name: 'Audible', url: '#' },
    ],
    awards: [],
  },
];

export const series = {
  name: 'The Lanternfall Trilogy',
  description:
    'A drowned city, a lamp that keeps its memories, and the women who tend the light. Three novels of grief, wonder, and stubborn hope, each telling the same story from a different depth.',
  order: ['the-lantern-keeper', 'a-city-of-paper-moths', 'the-last-wick'],
  startHere:
    'New to Elara? Begin with The Lantern Keeper. If you would rather try something standalone first, Salt & Saint Elsewhere is a perfect, self-contained introduction to her voice.',
};

export const worldMap = {
  name: 'Lanternfall',
  locations: [
    { id: 'salt-stair', name: 'The Salt Stair', x: 22, y: 18, book: 'the-lantern-keeper', description: 'Nine hundred steps from harbour to lamp-room, worn smooth by forty years of one woman’s boots.', quote: '“The city breathes through this stair.”' },
    { id: 'drowned-market', name: 'The Drowned Market', x: 38, y: 40, book: 'the-lantern-keeper', description: 'Stalls still stand beneath the tide, lit from within by windows that glow at night.', quote: '“Every stall remembers its last customer.”' },
    { id: 'harrow-quay', name: 'Harrow Quay', x: 62, y: 24, book: 'a-city-of-paper-moths', description: 'A surface town slowly forgetting its own name, one street at a time.', quote: '“The baker could not remember what bread was for.”' },
    { id: 'paper-city', name: 'The Paper City', x: 56, y: 56, book: 'a-city-of-paper-moths', description: 'A metropolis folded from every unfinished letter ever written, loud with the rustle of unsent words.', quote: '“Nobody here reads them. We listen.”' },
    { id: 'glass-marsh', name: 'The Glass Marsh', x: 76, y: 66, book: 'the-last-wick', description: 'Black, still water that holds the stars like a second sky.', quote: '“Nobody dead had agreed on what it was.”' },
    { id: 'ninth-tower', name: 'The Ninth Tower', x: 84, y: 40, book: 'the-last-wick', description: 'Where the first flame was lit, and where the last must be laid down.', quote: '“The first light that was not theirs.”' },
    { id: 'saint-elsewhere', name: 'Saint Elsewhere', x: 14, y: 70, book: 'salt-and-saint-elsewhere', description: 'A fishing village on the far shore, famous for its chips, its gulls, and its missing sea.', quote: '“The sea has always been the loudest neighbour.”' },
    { id: 'soon', name: 'Soon', x: 40, y: 82, book: 'the-cartographers-daughter', description: 'A harbour town that appears on no chart yet, and on one map in a mapmaker’s hand.', quote: '“Just: Soon.”' },
  ],
};

export const quiz = {
  title: 'Which book should you read first?',
  questions: [
    {
      q: 'Pick an evening.',
      answers: [
        { text: 'Rain on the window, candle lit, a ghost story', weights: { 'the-lantern-keeper': 3, 'the-last-wick': 1 } },
        { text: 'A long walk to somewhere I’ve never been', weights: { 'salt-and-saint-elsewhere': 3, 'the-cartographers-daughter': 2 } },
        { text: 'Sorting through old letters and boxes', weights: { 'a-city-of-paper-moths': 3, 'the-lantern-keeper': 1 } },
        { text: 'Planning a trip I may never take', weights: { 'the-cartographers-daughter': 3, 'the-last-wick': 1 } },
      ],
    },
    {
      q: 'What do you want from a book right now?',
      answers: [
        { text: 'To feel something, preferably a lot', weights: { 'the-last-wick': 3, 'a-city-of-paper-moths': 2 } },
        { text: 'To laugh, and then be quietly wrecked', weights: { 'salt-and-saint-elsewhere': 3 } },
        { text: 'To be completely transported', weights: { 'the-lantern-keeper': 3, 'the-cartographers-daughter': 2 } },
        { text: 'To be surprised by a strange idea', weights: { 'a-city-of-paper-moths': 3, 'the-cartographers-daughter': 1 } },
      ],
    },
    {
      q: 'Your ideal protagonist is…',
      answers: [
        { text: 'An exhausted, stubborn older woman doing her duty', weights: { 'the-lantern-keeper': 3, 'salt-and-saint-elsewhere': 2 } },
        { text: 'A clever kid who sees what grown-ups miss', weights: { 'a-city-of-paper-moths': 3 } },
        { text: 'A young maker stepping out of a parent’s shadow', weights: { 'the-cartographers-daughter': 3 } },
        { text: 'A hero at the end of a very long road', weights: { 'the-last-wick': 3 } },
      ],
    },
    {
      q: 'Choose a setting.',
      answers: [
        { text: 'A drowned city under the tide', weights: { 'the-lantern-keeper': 3, 'the-last-wick': 1 } },
        { text: 'A city folded from paper', weights: { 'a-city-of-paper-moths': 3 } },
        { text: 'A small harbour village, oddly quiet', weights: { 'salt-and-saint-elsewhere': 3 } },
        { text: 'A coast that is not on any map', weights: { 'the-cartographers-daughter': 3 } },
      ],
    },
  ],
  results: {
    'the-lantern-keeper': 'You are a slow-burn reader who loves atmosphere, ghosts, and a good dark stair. Begin where the lamp goes out.',
    'a-city-of-paper-moths': 'You see the strange in the ordinary, and you listen to what others miss. Step into the Paper City.',
    'the-last-wick': 'You like big feelings and brave endings. (Do read the first two books first; you will not regret it.)',
    'salt-and-saint-elsewhere': 'You want warmth, wit, and a mystery with salt on it. Walk out onto the empty sea.',
    'the-cartographers-daughter': 'You are a wanderer at heart. Pre-order the map, and meet Mirren on the horizon.',
  },
};

export const timeline = [
  { year: 1989, title: 'A lighthouse cottage', text: 'Born on the east coast of Scotland, in a cottage where the power failed so often that stories became the household light.', image: images.highlands },
  { year: 1998, title: 'The first notebook', text: 'Writes her first story, three pages about a moth who wants to be a lamp, under the blankets by torchlight.', image: images.notebook },
  { year: 2008, title: 'Edinburgh', text: 'Moves to Edinburgh to study medieval literature and, in her own words, “get lost in a better class of library.”', image: images.libraryCurve },
  { year: 2011, title: 'Candlemaker Row', text: 'Takes a job in a second-hand bookshop. Reads four thousand first chapters over the next decade.', image: images.libraryWarm },
  { year: 2016, title: 'Eleven rejections', text: 'Finishes the first draft of The Lantern Keeper and collects eleven polite refusals, which she keeps in a biscuit tin.', image: images.pen },
  { year: 2019, title: 'The Lantern Keeper', text: 'The debut finally finds a publisher and a small, devoted audience that grows by word of mouth.', image: images.torch },
  { year: 2021, title: 'A City of Paper Moths', text: 'The second Lanternfall novel wins the Hawthorn Fantasy Award and crosses into translation.', image: images.pages },
  { year: 2022, title: 'Salt & Saint Elsewhere', text: 'A standalone detour into comedy and mystery, and an unexpected bestseller.', image: images.cloudSea },
  { year: 2023, title: 'The Last Wick', text: 'The trilogy closes. Readers send letters, candles, and one hand-knitted moth.', image: images.fogCastle },
  { year: 2027, title: 'The Cartographer’s Daughter', text: 'The newest novel, a map of places that do not exist yet, arrives on 14 March.', image: images.road },
];

export const praise = [
  { quote: 'A debut that glows from the inside.', source: 'The Northern Review' },
  { quote: 'Wren is the most unforgettable young heroine in fantasy this decade.', source: 'The Wayfarer Post' },
  { quote: 'Voss writes grief the way tides write on sand.', source: 'Harbour & Quill' },
  { quote: 'The moths alone are worth the price of admission.', source: 'Meridian Magazine' },
  { quote: 'A perfect ending: inevitable, surprising, and so tender it hurts.', source: 'The Northern Review' },
  { quote: 'Funny, wise, and quietly enormous.', source: 'Harbour & Quill' },
  { quote: 'I have not cried at a book about paper before. I have now.', source: 'Bellwether Books Blog' },
  { quote: 'Proof that Voss can do anything.', source: 'The Wayfarer Post' },
  { quote: 'Literary fantasy at its most luminous.', source: 'The Evening Lamplighter' },
  { quote: 'Bring tissues and a candle.', source: 'Meridian Magazine' },
];

export const awards = {
  items: [
    { name: 'Lantern Prize for Debut Fiction', year: 2020, book: 'The Lantern Keeper' },
    { name: 'Hawthorn Fantasy Award', year: 2022, book: 'A City of Paper Moths' },
    { name: 'Lantern Prize for Fantasy', year: 2024, book: 'The Last Wick' },
    { name: 'Saltire Fiction Prize, shortlist', year: 2022, book: 'A City of Paper Moths' },
  ],
  stats: [
    { value: 400, suffix: 'K+', label: 'copies sold' },
    { value: 23, suffix: '', label: 'languages' },
    { value: 5, suffix: '', label: 'novels' },
    { value: 4, suffix: '', label: 'awards' },
  ],
};

export const events = {
  upcoming: [
    { id: 'ev-1', date: '2026-11-19T19:00:00Z', city: 'Edinburgh', venue: 'The Writers’ Museum, Lawnmarket', type: 'talk', title: 'An Evening of Lantern Light', ticketUrl: '#', image: images.libraryCurve },
    { id: 'ev-2', date: '2026-12-06T18:30:00Z', city: 'London', venue: 'Foyles Charing Cross Road', type: 'signing', title: 'Trilogy Signing', ticketUrl: '#', image: images.libraryWarm },
    { id: 'ev-3', date: '2027-01-21T19:00:00Z', city: 'Online', venue: 'Live stream with Q&A', type: 'virtual', title: 'Writing After Midnight', ticketUrl: '#', image: images.notebook },
    { id: 'ev-4', date: '2027-03-14T12:00:00Z', city: 'Glasgow', venue: 'Mitchell Library', type: 'talk', title: 'The Cartographer’s Daughter Launch', ticketUrl: '#', image: images.libraryNight },
    { id: 'ev-5', date: '2027-04-23T10:00:00Z', city: 'Hay-on-Wye', venue: 'Hay Festival, Tent Two', type: 'festival', title: 'Maps of Places That Do Not Exist', ticketUrl: '#', image: images.hills },
    { id: 'ev-6', date: '2027-06-12T15:00:00Z', city: 'Edinburgh', venue: 'Edinburgh International Book Festival', type: 'festival', title: 'Moths, Maps and Memory', ticketUrl: '#', image: images.highlands },
  ],
  past: [
    { id: 'ev-p1', date: '2026-09-12T18:00:00Z', city: 'Manchester', venue: 'Waterstones Deansgate', type: 'signing', title: 'Summer Signing', ticketUrl: '#', image: images.libraryWarm },
    { id: 'ev-p2', date: '2026-08-15T14:00:00Z', city: 'Edinburgh', venue: 'Edinburgh International Book Festival', type: 'festival', title: 'Salt, Moths and Saints', ticketUrl: '#', image: images.highlands },
    { id: 'ev-p3', date: '2026-05-02T19:00:00Z', city: 'Online', venue: 'Live stream', type: 'virtual', title: 'Ask Elara Anything', ticketUrl: '#', image: images.notebook },
  ],
  types: ['signing', 'festival', 'talk', 'virtual'],
};

export const journal = [
  {
    slug: 'writing-after-midnight',
    title: 'Writing after midnight',
    date: '2026-10-08',
    tag: 'Process',
    readingTime: 4,
    excerpt: 'Why the best sentences arrive when the house is asleep, and what the candle is really for.',
    image: images.pen,
    body: [
      'I am often asked why I only write after midnight. The honest answer is that the day is loud and the night is not. By twelve, the kettle has gone cold, the street has stopped arguing with itself, and the only sound in the flat is the scratch of the pen.',
      'There is a particular quality of attention that arrives at that hour. It is not alertness exactly; it is closer to being very gently awake. Sentences that refuse to come at noon walk in without knocking.',
      'The candle is mostly superstition, I admit. But a flame is the only thing I know that makes a room feel like it is listening.',
    ],
  },
  {
    slug: 'the-biscuit-tin-of-rejections',
    title: 'The biscuit tin of rejections',
    date: '2026-09-02',
    tag: 'Writing life',
    readingTime: 3,
    excerpt: 'Eleven refusals, one tin, and why I still keep them on the shelf above my desk.',
    image: images.pages,
    body: [
      'Before The Lantern Keeper found a home, eleven publishers politely declined it. I kept every letter in a shortbread tin, which seemed the right place for something so bittersweet.',
      'I do not read them for comfort, exactly. I read them to remember that every book I admire was once somebody’s no.',
      'If you are in your own tin-filling season, keep going. The tin gets heavier, and so do you.',
    ],
  },
  {
    slug: 'on-moths',
    title: 'On moths',
    date: '2026-07-19',
    tag: 'World-building',
    readingTime: 5,
    excerpt: 'How a humble grey visitor to my childhood lamp became the quiet heart of Lanternfall.',
    image: images.torch,
    body: [
      'When I was small, the moths always came to the cottage lamp, soft and stupid and unfailingly brave. I decided very young that they were not drawn to the light out of foolishness, but out of faith.',
      'In Lanternfall they became the keepers of memory, which is really just another word for faith in small things.',
      'I still do not catch them. I wait until they are done and open the window.',
    ],
  },
  {
    slug: 'a-map-of-nowhere',
    title: 'A map of nowhere',
    date: '2026-06-05',
    tag: 'New book',
    readingTime: 6,
    excerpt: 'Where The Cartographer’s Daughter began: an old chart, a spilled ink bottle, and a word.',
    image: images.road,
    body: [
      'The Cartographer’s Daughter began with a word written in the corner of an old chart in a Leith antique shop: simply, Soon. I bought it for four pounds and never stopped thinking about it.',
      'What would it mean to draw a place before it existed? Who would be brave enough to live there? Mirren arrived a few weeks later, carrying a compass she did not know how to use.',
      'The book is nearly finished. I will tell you more in March.',
    ],
  },
  {
    slug: 'walking-arthurs-seat',
    title: 'Walking Arthur’s Seat at dawn',
    date: '2026-04-14',
    tag: 'Life',
    readingTime: 3,
    excerpt: 'A small ritual, a very large hill, and the best editing advice I have ever received from a sheep.',
    image: images.highlands,
    body: [
      'Most mornings I climb Arthur’s Seat before the city has properly woken. It takes forty minutes and teaches me everything I need to know about structure: steady ascent, a hard middle, a view that justifies it all.',
      'Last week a sheep looked me straight in the eye while I was muttering about chapter nine. It said nothing. It did not need to.',
      'Cut it, I thought. I did.',
    ],
  },
  {
    slug: 'what-readers-send-me',
    title: 'What readers send me',
    date: '2026-02-28',
    tag: 'Readers',
    readingTime: 4,
    excerpt: 'Candles, hand-knitted moths, and a letter I have read forty times.',
    image: images.libraryNight,
    body: [
      'Readers are astonishing. In the last year I have received eleven candles, three hand-knitted moths, a jar of sea glass, and a map of Lanternfall drawn on a tea towel.',
      'The letters are the real treasure. One, from a woman who read The Last Wick at her mother’s bedside, I have read forty times. I will not quote it. It is not mine.',
      'Thank you. All of you. Please keep writing.',
    ],
  },
];

export const newsletter = {
  eyebrow: 'The Lamplighter Letter',
  headline: 'Get a free short story',
  text: 'Join the letter for news, early excerpts and the occasional unreasonable amount of moth trivia. No spam, one email a month, unsubscribe any time.',
  leadMagnet: {
    title: 'The Moth Who Swallowed the Moon',
    description: 'A free standalone short story, set in Lanternfall, about a very small moth with a very large appetite.',
    cover: { palette: ['#14213d', '#5c6b8a', '#f4f1de'], motif: 'moth', titleLayout: 'centered' },
    author: 'Elara Voss',
  },
};

export const site = {
  title: 'Elara Voss — Stories written in lantern light',
  description: 'Elara Voss is a literary fantasy author, writer of the Lanternfall Trilogy. Explore the books, the world, and upcoming events.',
  signOff: 'Keep a light on.',
};

const data = { author, books, series, worldMap, quiz, timeline, praise, awards, events, journal, newsletter, images, site };
export default data;
