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

// Verify modal elements exist
if (!modal || !modalImg || !modalTitle || !modalAuthor || !modalDesc) {
    console.error('Modal elements not found');
}

// ===== CATEGORY BUTTONS =====
const categoryButtons = document.querySelectorAll('.category-btn');
const genreDescEl = document.getElementById('genre-desc');
let genreMap = {};

// ===== SEARCH ELEMENTS =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
let searchQuery = '';

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

// FETCH AND RENDER BOOKS FROM API
async function loadManga() {
    try {
        const response = await fetch('/api/manga?limit=100');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        allManga = data.items || [];
        console.log('Loaded manga data:', allManga);
        
        if (allManga.length === 0) {
            console.warn('No manga data returned from API');
        } else {
            console.log('First manga item:', allManga[0]);
        }
        
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
    console.log('renderBooks called with', allManga.length, 'books');
    console.log('First book full data:', allManga[0]);

    if (allManga.length > 0) {
        collectionsContainer.innerHTML = '';
        allManga.forEach((book, i) => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.dataset.description = book.description || 'No description';
            card.dataset.genre = book.genre || 'No genre';
            card.dataset.year = book.year || 'No year';
            card.style.setProperty('--delay', `${i * 80}ms`);

            // Verify the data is actually set
            console.log(`Card ${i} (${book.title}):`, {
                description: card.dataset.description,
                genre: card.dataset.genre,
                year: card.dataset.year
            });

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
    } else {
        // If no manga from API, keep static cards and attach listeners
        attachCardEventListeners();
        filterAndRenderBooks();
    }
}

function attachCardEventListeners() {
    const addButtons = document.querySelectorAll('.add-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    console.log(`Attaching event listeners to ${addButtons.length} add buttons and ${viewButtons.length} view buttons`);

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
            e.preventDefault();
            e.stopPropagation();
            
            const bookCard = button.closest('.book-card');
            if (!bookCard) {
                console.error('Book card not found');
                return;
            }
            
            const title = bookCard.querySelector('h3').textContent;
            const author = bookCard.querySelector('p').textContent;
            const imgSrc = bookCard.querySelector('img').src;
            const description = bookCard.dataset.description || 'No description';
            const genre = bookCard.dataset.genre || 'No genre';
            const year = bookCard.dataset.year || 'No year';
            
            console.log('Opening modal with data:', { title, author, description, genre, year });
            openModal({ title, author, imgSrc, description, genre, year });
        });
    });
}


// ===== MODAL FUNCTIONS =====
function openModal(data) {
    console.log('openModal called with:', data);
    
    if (!modal) {
        console.error('Modal element not found in DOM');
        return;
    }

    console.log('Modal element found, setting properties...');

    // Set image with fallback
    modalImg.src = data.imgSrc || '';
    modalImg.alt = data.title || 'Book image';

    // Set title
    modalTitle.textContent = data.title || 'Unknown Title';

    // Set author
    const authorText = data.author || 'Unknown Author';
    modalAuthor.textContent = `by ${authorText}`;

    // Set genre
    if (modalGenre) {
        modalGenre.textContent = data.genre ? `Genre: ${data.genre}` : '';
        modalGenre.style.display = data.genre ? 'block' : 'none';
    }

    // Set year
    if (modalYear) {
        modalYear.textContent = data.year ? `Year: ${data.year}` : '';
        modalYear.style.display = data.year ? 'block' : 'none';
    }

    // Set description - this is the key part
    if (modalDesc) {
        modalDesc.textContent = data.description || 'No description available.';
        modalDesc.style.display = 'block';
        modalDesc.style.whiteSpace = 'pre-wrap';
        modalDesc.style.wordWrap = 'break-word';
    }

    // Show modal
    console.log('Setting aria-hidden to false...');
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.current = JSON.stringify(data);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    console.log('Modal should now be visible');
}

function closeModal() {
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        delete modal.dataset.current;
    }
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
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

// ===== SEARCH FUNCTIONALITY =====
function performSearch() {
    searchQuery = searchInput.value.toLowerCase().trim();
    filterAndRenderBooks();
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
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
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        
        const categoryMatch = currentCategory === 'all' || genre.includes(currentCategory);
        const searchMatch = !searchQuery || title.includes(searchQuery) || author.includes(searchQuery);
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            card.classList.add('revealed');
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== ADD TO COLLECTION =====
async function addToCollection(data) {
    if (!isAuthenticated) {
        showToast('Please sign in to collect items.', 'info');
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return false;
    }
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
        showToast('Failed to save to collection. Please try again.', 'error');
        return false;
    }
}


// ===== MODAL EVENT LISTENERS =====
if (modalAdd) {
    modalAdd.addEventListener('click', async () => {
        const data = JSON.parse(modal.dataset.current || '{}');
        if (!data.title) return;
        const added = await addToCollection(data);
        if (added) {
            showToast(`"${data.title}" added to your collection.`, 'success');
            closeModal();
        }
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}

if (modalCloseX) {
    modalCloseX.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
    }
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
    console.log('DOMContentLoaded fired');
    // Attach listeners to static HTML cards first
    attachCardEventListeners();
    Promise.all([loadManga(), loadGenres(), checkAuth()]).then(() => {
        console.log('All promises resolved, showing genre description');
        showGenreDescription('all');
    }).catch(err => {
        console.error('Error during initialization:', err);
    });
});

