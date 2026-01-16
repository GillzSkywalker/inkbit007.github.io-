const express = require('express');
const router = express.Router();


//third party API for manga information
// Lightweight in-memory manga/comics catalog for Explore/demo use.
// This is intentionally simple; replace with a DB-backed model later if needed.
const MANGA = [
  {
    id: 'death-note',
    title: 'Death Note',
    author: 'Tsugumi Ohba',
    year: 2003,
    genre: 'Shounen / Supernatural / Comics',
    description: 'A high school student discovers a supernatural notebook that allows him to kill by writing names.',
    image: 'death note.jpg'
  },
  {
    id: 'monster',
    title: 'Monster',
    author: 'Naoki Urasawa',
    year: 1994,
    genre: 'Seinen / Psychological / Comics',
    description: 'A brilliant neurosurgeon becomes entangled chasing a former patient turned serial killer.',
    image: 'monster.jpg'
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    year: 1997,
    genre: 'Shounen / Adventure / Comics',
    description: 'Monkey D. Luffy sails with his crew in search of the legendary One Piece treasure.',
    image: 'one piece.jpeg'
  },
  {
    id: 'berserk',
    title: 'Berserk',
    author: 'Kentaro Miura',
    year: 1989,
    genre: 'Seinen / Dark Fantasy / Comics',
    description: 'A dark epic about a mercenary named Guts and his tragic struggle against fate and demons.',
    image: 'berserk.jpg'
  },
  {
    id: 'fullmetal-alchemist',
    title: 'Fullmetal Alchemist',
    author: 'Hiromu Arakawa',
    year: 2001,
    genre: 'Shounen / Fantasy / Comics',
    description: "Two brothers use alchemy to search for the Philosopher's Stone to restore what they lost.",
    image: 'fullmetal alchemist.jpg'
  },
  {
    id: 'naruto',
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    year: 1999,
    genre: 'Shounen / Adventure / Comics',
    description: 'A young ninja with dreams of becoming the village leader embarks on many adventures.',
    image: '3a8c63737ae2d94f9d4f09f477e3df34.jpg'
  },
  {
    id: 'akira',
    title: 'Akira',
    author: 'Katsuhiro Otomo',
    year: 1982,
    genre: 'Seinen / Sci-Fi / Comics',
    description: 'A landmark cyberpunk manga set in a post-apocalyptic Neo-Tokyo.',
    image: 'akira.jpg'
  },
  {
    id: 'pluto',
    title: 'Pluto',
    author: 'Naoki Urasawa',
    year: 2003,
    genre: 'Seinen / Mystery / Comics',
    description: 'A mature reimagining of an Astro Boy arc as a noir robot/political thriller.',
    image: 'pluto.jpg'
  },
  {
    id: 'tokyo-ghoul',
    title: 'Tokyo Ghoul',
    author: 'Sui Ishida',
    year: 2011,
    genre: 'Seinen / Supernatural / Comics',
    description: 'A college student becomes a half-ghoul and struggles with identity, survival, and morality.',
    image: 'tokyo ghoul.jpg'
  },
  {
    id: 'vinland-saga',
    title: 'Vinland Saga',
    author: 'Makoto Yukimura',
    year: 2005,
    genre: 'Seinen / Historical / Comics',
    description: 'A brutal historical tale of revenge, war, and the making of a warrior.',
    image: 'vinland saga.jpg'
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    year: 2018,
    genre: 'Shounen / Fantasy / Action / Comics',
    description: 'A young swordsman joins the Demon Slayer Corps to save his sister and avenge his family.',
    image: 'demon slayer.jpeg'
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    year: 2009,
    genre: 'Dark Fantasy / Action / Thriller / Comics',
    description: 'Humanity fights for survival against colossal Titans in a world behind giant walls.',
    image: 'SNK.webp'
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    author: 'Gege Akutami',
    year: 2018,
    genre: 'Shounen / Supernatural / Action / Comics',
    description: 'A student swallows a cursed object and joins a secret society of jujutsu sorcerers.',
    image: 'download.jpeg'
  },
  {
    id: 'bleach',
    title: 'Bleach',
    author: 'Tite Kubo',
    year: 2001,
    genre: 'Shounen / Supernatural / Adventure / Comics',
    description: 'A teenager gains Soul Reaper powers and protects the living from evil spirits.',
    image: 'bleach.jpg'
  },
  {
    id: 'your-lie-in-april',
    title: 'Your Lie in April',
    author: 'Naoshi Arakawa',
    year: 2011,
    genre: 'Shoujo / Romance / Music / Drama / Comics',
    description: 'A musical prodigy and a free-spirited violinist find healing through music and love.',
    image: 'Your_Lie_in_April_Manga_cover.png'
  },
  {
    id: 'noragami',
    title: 'Noragami',
    author: 'Adachitoka',
    year: 2010,
    genre: 'Shounen / Supernatural / Action / Comedy / Comics',
    description: 'A minor god helps humans solve supernatural problems with the aid of a spirit warrior.',
    image: 'noragami.jpg'
  },
  {
    id: 'psycho-pass',
    title: 'Psycho-Pass',
    author: 'Gen Urobuchi',
    year: 2012,
    genre: 'Seinen / Sci-Fi / Thriller / Psychological / Comics',
    description: 'In a dystopian future, a surveillance system predicts criminal potential before crimes occur.',
    image: 'psycho pass.jpg'
  },
  {
    id: 're-zero',
    title: 'Re:Zero − Starting Life in Another World',
    author: 'Tappei Nagatsuki',
    year: 2014,
    genre: 'Isekai / Fantasy / Drama / Comics',
    description: 'A teenager is transported to a fantasy world and discovers he can rewind time.',
    image: 're zero.jpg'
  },
  {
    id: 'code-geass',
    title: 'Code Geass',
    author: 'Ichirō Ōkouchi',
    year: 2006,
    genre: 'Mecha / Drama / Thriller / Strategic / Comics',
    description: 'A student gains a mind-control power and orchestrates a rebellion against an empire.',
    image: 'code geass.jpg'
  },
  {
    id: 'zankyou-no-terror',
    title: 'Zankyou no Terror',
    author: 'Shinichirō Watanabe',
    year: 2014,
    genre: 'Drama / Mystery / Thriller / Psychological / Comics',
    description: "Two brilliant teens stage cryptic attacks to expose society's hidden cruelties.",
    image: 'terror in resonance.jpg'
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    author: 'Kōhei Horikoshi',
    year: 2014,
    genre: 'Shounen / Superhero / School / Action / Comics',
    description: 'A quirkless teen enrolls in a hero academy to become the greatest hero despite his limitations.',
    image: 'my hero academia.jpg'
  },
  {
    id: 'cowboy-bebop',
    title: 'Cowboy Bebop',
    author: 'Hajime Yatate',
    year: 1996,
    genre: 'Seinen / Sci-Fi / Adventure / Jazz / Comics',
    description: 'Bounty hunters traverse the galaxy in a retro-futuristic setting with a jazzy soundtrack.',
    image: 'cowboy bebop.jpg'
  },
  {
    id: 'steins-gate',
    title: 'Steins;Gate',
    author: 'Tatsuya Matsuki',
    year: 2009,
    genre: 'Sci-Fi / Thriller / Time Travel / Mystery / Comics',
    description: 'A group of friends accidentally discovers time travel and must prevent a dystopian future.',
    image: 'steins gate.jpg'
  },
  {
    id: 'evangelion',
    title: 'Neon Genesis Evangelion',
    author: 'Hideaki Anno',
    year: 1995,
    genre: 'Mecha / Psychological / Drama / Existential / Comics',
    description: 'Teenage pilots defend Earth from mysterious entities in experimental mechanized suits.',
    image: 'evangelion.jpg'
  },
  {
    id: 'mob-psycho',
    title: 'Mob Psycho 100',
    author: 'ONE',
    year: 2012,
    genre: 'Shounen / Supernatural / Comedy / Action / Comics',
    description: 'A middle schooler with psychic powers seeks to live a normal life while dealing with spirits.',
    image: 'mob psycho.jpg'
  },
  {
    id: 'promised-neverland',
    title: 'The Promised Neverland',
    author: 'Kaiu Shirai',
    year: 2016,
    genre: 'Shounen / Mystery / Thriller / Strategic / Comics',
    description: 'Orphans discover their paradise is actually a breeding farm and plan a daring escape.',
    image: 'promised neverland.jpg'
  },
  {
    id: 'dr-stone',
    title: 'Dr. Stone',
    author: 'Riichiro Inagaki',
    year: 2017,
    genre: 'Shounen / Sci-Fi / Adventure / Comedy / Comics',
    description: 'A teen wakes up in a world turned to stone and must rebuild civilization through science.',
    image: 'dr stone.jpg'
  }
];

// Human-friendly genre/category descriptions
const GENRES = {
  'Shounen': 'Aimed at young teen males (shounen): energetic, action-focused stories about growth and friendship.',
  'Seinen': 'Directed at adult men (seinen): often darker, more complex themes and moral ambiguity.',
  'Shoujo': 'Targeted at young teen females (shoujo): romance, relationships, and emotional drama.',
  'Action': 'Fast-paced sequences, combat, and physical conflict.',
  'Fantasy': 'Worlds with magic, supernatural creatures, and mythic elements.',
  'Supernatural': 'Ghosts, curses, otherworldly powers and mysteries beyond science.',
  'Adventure': 'Journey-driven plots with exploration, quests, and travel.',
  'Dark Fantasy': 'Fantasy blended with horror and grim, mature themes.',
  'Sci-Fi': 'Science fiction and futuristic concepts driven by technology.',
  'Psychological': 'Focuses on the mind, motives, and psychological tension between characters.',
  'Thriller': 'High-stakes suspense, tension, and plot twists.',
  'Mystery': 'Puzzle or investigation-focused stories centered around secrets or crimes.',
  'Isekai': 'Characters transported to or reborn in another world, often with RPG-like rules.',
  'Mecha': 'Stories revolving around giant robots and their pilots.',
  'Drama': 'Character-driven narratives that emphasize emotional stakes and growth.',
  'Romance': 'Stories centered on love, relationships, and emotional bonds.',
  'Superhero': 'Heroes with special powers facing villains and moral choices.',
  'Music': 'Plots driven by musical performance, growth, and artistic expression.',
  'Historical': 'Set in or inspired by historical periods with period-specific themes.',
  'Comedy': 'Light-hearted, humorous stories meant to amuse and entertain.'
};

// GET /api/manga/genres
// Returns the available genre descriptions for the frontend to display
router.get('/genres', (req, res) => {
  try {
    res.json({ genres: GENRES });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/manga
// Supports: ?search=term&genre=term&page=1&limit=20
router.get('/', (req, res) => {
  try {
    const { search, genre } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    let items = MANGA.slice();

    if (genre) {
      const g = genre.toString().toLowerCase();
      items = items.filter(i => i.genre && i.genre.toLowerCase().includes(g));
    }

    if (search) {
      const t = search.toString().trim().toLowerCase();
      items = items.filter(i => (
        i.title.toLowerCase().includes(t) ||
        (i.author && i.author.toLowerCase().includes(t)) ||
        (i.description && i.description.toLowerCase().includes(t))
      ));
    }

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    res.json({ page, limit, total, items: paged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
