// ===== GLOBAL STATE =====
let allManga = [];
let currentCategory = 'all';
const collectionsContainer = document.querySelector('.collections');
let isAuthenticated = false;
let userCollections = [];

// ===== MODAL ELEMENTS =====
const modal = document.getElementById('book-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalDesc = document.getElementById('modal-desc');
const modalGenre = document.getElementById('modal-genre');
const modalYear = document.getElementById('modal-year');
const modalAdd = document.getElementById('modal-add');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCloseX = document.querySelector('.modal-close');

// ===== CATEGORY BUTTONS =====
const categoryButtons = document.querySelectorAll('.category-btn');
const genreDescEl = document.getElementById('genre-desc');
let genreMap = {};

// ===== AUTHENTICATION CHECK =====
async function checkAuth() {
    try {
        const res = await fetch('/api/collections/my-collections');
        if (res.ok) {
            isAuthenticated = true;
            const data = await res.json();
            userCollections = data;
        } else {
            isAuthenticated = false;
        }
    } catch (err) {
        isAuthenticated = false;
    }
}

// ===== FETCH AND RENDER BOOKS FROM API =====
async function loadManga() {
    try {
        const response = await fetch('/api/manga?limit=100');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        allManga = data.items || [];
        renderBooks();
    } catch (err) {
        console.error('Failed to load manga:', err);
        showToast('Failed to load manga list', 'error');
    }
}

// Load human-friendly genre descriptions from the API
async function loadGenres() {
    try {
        const res = await fetch('/api/manga/genres');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        genreMap = data.genres || {};
    } catch (err) {
        console.warn('Failed to load genres:', err);
    }
}

function renderBooks() {
    collectionsContainer.innerHTML = '';
    allManga.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.description = book.description || '';
        card.dataset.genre = book.genre || '';
        card.dataset.year = book.year || '';
        card.style.setProperty('--delay', `${i * 80}ms`);
        
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author || 'Unknown Author'}</p>
            <button class="view-btn">View More</button>
            <button class="add-btn">Add to Collection</button>
        `;
        collectionsContainer.appendChild(card);
    });
    attachCardEventListeners();
    filterAndRenderBooks();
}

function attachCardEventListeners() {
    const addButtons = document.querySelectorAll('.add-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    addButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const bookCard = button.closest('.book-card');
            const title = bookCard.querySelector('h3').textContent;
            const author = bookCard.querySelector('p').textContent;
            const imgSrc = bookCard.querySelector('img').src;
            const added = await addToCollection({ title, author, imgSrc });
            if (added) {
                button.classList.add('btn-pop');
                setTimeout(() => button.classList.remove('btn-pop'), 220);
                showToast(`"${title}" added to your collection.`, 'success');
            }
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookCard = button.closest('.book-card');
            const title = bookCard.querySelector('h3').textContent;
            const author = bookCard.querySelector('p').textContent;
            const imgSrc = bookCard.querySelector('img').src;
            const description = bookCard.dataset.description || '';
            const genre = bookCard.dataset.genre || '';
            const year = bookCard.dataset.year || '';
            openModal({ title, author, imgSrc, description, genre, year });
        });
    });
}


// ===== MODAL FUNCTIONS =====
function openModal(data) {
    modalImg.src = data.imgSrc;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalAuthor.textContent = data.author;
    modalGenre.textContent = data.genre || '';
    modalYear.textContent = data.year || '';
    modalDesc.textContent = data.description || 'No description available.';
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.current = JSON.stringify(data);
}

function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.current;
}

// ===== CATEGORY FILTER =====
categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        filterAndRenderBooks();
        showGenreDescription(currentCategory);
    });
});

function showGenreDescription(category) {
    if (!genreDescEl) return;
    if (!category || category === 'all') {
        genreDescEl.textContent = 'Showing all categories. Use the filter to narrow by genre.';
        return;
    }
    const desc = genreMap[category] || '';
    genreDescEl.textContent = desc || 'No description available for this category.';
}

function filterAndRenderBooks() {
    const allCards = document.querySelectorAll('.book-card');
    allCards.forEach(card => {
        const genre = card.dataset.genre || '';
        if (currentCategory === 'all' || genre.includes(currentCategory)) {
            card.style.display = 'block';
            card.classList.add('revealed');
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== ADD TO COLLECTION =====
async function addToCollection(data) {
    if (isAuthenticated) {
        // Use API to save to server
        try {
            // Assume user has a default collection, or create one
            let collectionId = userCollections.length > 0 ? userCollections[0]._id : null;
            if (!collectionId) {
                // Create a new collection
                const createRes = await fetch('/api/collections', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'My Collection', description: 'Default collection' })
                });
                if (!createRes.ok) throw new Error('Failed to create collection');
                const newColl = await createRes.json();
                collectionId = newColl._id;
                userCollections.push(newColl);
            }
            // Add item to collection
            const addRes = await fetch(`/api/collections/${collectionId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: data.title, author: data.author, image: data.imgSrc })
            });
            if (!addRes.ok) throw new Error('Failed to add item');
            return true;
        } catch (err) {
            console.error('Failed to save to server:', err);
            showToast('Failed to save to server, using local storage', 'warn');
            // Fallback to localStorage
            return addToLocalStorage(data);
        }
    } else {
        // Use localStorage
        return addToLocalStorage(data);
    }
}

function addToLocalStorage(data) {
    let collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const alreadyAdded = collection.some(book => book.title === data.title);
    if (alreadyAdded) {
        showToast(`"${data.title}" is already in your collection!`, 'warn');
        return false;
    }
    collection.push({ title: data.title, author: data.author, imgSrc: data.imgSrc });
    localStorage.setItem('myCollection', JSON.stringify(collection));
    return true;
}


// ===== MODAL EVENT LISTENERS =====
modalAdd.addEventListener('click', async () => {
    const data = JSON.parse(modal.dataset.current || '{}');
    if (!data.title) return;
    const added = await addToCollection(data);
    if (added) {
        showToast(`"${data.title}" added to your collection.`, 'success');
        closeModal();
    }
});

modalCloseBtn.addEventListener('click', closeModal);
modalCloseX.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

/* ===== UI HELPERS ===== */

function ensureToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'info', ttl = 3000) {
    const container = ensureToastContainer();
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.style.opacity = '1', 50);
    setTimeout(() => {
        el.style.transition = 'opacity 240ms ease, transform 240ms ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px) scale(.98)';
    }, ttl);
    setTimeout(() => el.remove(), ttl + 300);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([loadManga(), loadGenres(), checkAuth()]).then(() => {
        showGenreDescription('all');
    });
});

