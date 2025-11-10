// ===== SELECT BUTTONS =====
const addButtons = document.querySelectorAll('.add-btn');
const viewButtons = document.querySelectorAll('.view-btn');

// Modal elements
const modal = document.getElementById('book-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalDesc = document.getElementById('modal-desc');
const modalAdd = document.getElementById('modal-add');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCloseX = document.querySelector('.modal-close');

function openModal(data) {
    modalImg.src = data.imgSrc;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalAuthor.textContent = data.author;
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
        alert(`"${data.title}" is already in your collection!`);
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
        if (added) alert(`"${title}" has been added to your collection!`);
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

        openModal({ title, author, imgSrc, description });
    });
});

// Modal add button
modalAdd.addEventListener('click', () => {
    const data = JSON.parse(modal.dataset.current || '{}');
    if (!data.title) return;
    const added = addToCollection(data);
    if (added) {
        alert(`"${data.title}" has been added to your collection!`);
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
