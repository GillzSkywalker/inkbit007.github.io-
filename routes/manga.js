const express = require('express');
const router = express.Router();

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
  }
];

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
