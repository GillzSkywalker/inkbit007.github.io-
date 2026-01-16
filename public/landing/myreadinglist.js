// Reading list Management 

let readingListBooks = [
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
]

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('reading-list');
    readingListBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        bookDiv.innerHTML = `
            <img src="${book.image}" alt="${book.title} Cover" class="book-image">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author} (${book.year})</p>
            <p class="book-genre"><strong>Genre:</strong> ${book.genre}</p>
            <p class="book-description">${book.description}</p>
        `;
        listContainer.appendChild(bookDiv);
    });     

    function LoadReadingList() {
        const storedList = localStorage.getItem('readingList');
        if (storedList) {
            readingListBooks = JSON.parse(storedList);
            displayReadingList();
        }
    }   

    if (typeof(Storage) !== "undefined") {
        LoadReadingList();
    } else {
        console.error("Sorry, your browser does not support Web Storage...");
    }   
});

