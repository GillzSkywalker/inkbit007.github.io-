// ===== SELECT BUTTONS =====
const addButtons = document.querySelectorAll('.add-btn');
const viewButtons = document.querySelectorAll('.view-btn');

// Modal elements
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

function openModal(data) {
    modalImg.src = data.imgSrc;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalAuthor.textContent = data.author;
    modalGenre.textContent = data.genre || '';
    modalYear.textContent = data.year || '';
    modalDesc.textContent = data.description || 'No description available.';
    modal.setAttribute('aria-hidden', 'false');
    // store current item on modal for add action
    modal.dataset.current = JSON.stringify(data);
}

function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.current;
}

// ===== ADD TO COLLECTION FUNCTION =====
function addToCollection(data) {
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

addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const bookCard = button.closest('.book-card');
        const title = bookCard.querySelector('h3').textContent;
        const author = bookCard.querySelector('p').textContent;
        const imgSrc = bookCard.querySelector('img').src;

        const added = addToCollection({ title, author, imgSrc });
        if (added) {
            // visual feedback on the button
            button.classList.add('btn-pop');
            setTimeout(() => button.classList.remove('btn-pop'), 220);
            showToast(`"${title}" added to your collection.`, 'success');
        }
    });
});

// ===== VIEW MORE -> open modal =====
viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const bookCard = button.closest('.book-card');
        const title = bookCard.querySelector('h3').textContent;
        const author = bookCard.querySelector('p').textContent;
        const imgSrc = bookCard.querySelector('img').src;
        // If you later have real descriptions from backend, set here
        const description = bookCard.dataset.description || '';
        const genre = bookCard.dataset.genre || '';
        const year = bookCard.dataset.year || '';

        openModal({ title, author, imgSrc, description, genre, year });
    });
});

// Modal add button
modalAdd.addEventListener('click', () => {
    const data = JSON.parse(modal.dataset.current || '{}');
    if (!data.title) return;
    const added = addToCollection(data);
    if (added) {
        showToast(`"${data.title}" added to your collection.`, 'success');
        closeModal();
    }
});

// Modal close handlers
modalCloseBtn.addEventListener('click', closeModal);
modalCloseX.addEventListener('click', closeModal);

// close when clicking outside content
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// allow Escape to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

/* ===== UI Helpers: toast + stagger reveal ===== */

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

// stagger reveal for book cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.collections .book-card');
    cards.forEach((card, i) => {
        card.style.setProperty('--delay', `${i * 80}ms`);
    });
    // small progressive reveal in case elements are inserted later
    requestAnimationFrame(() => {
        cards.forEach(c => c.classList.add('revealed'));
    });
});

