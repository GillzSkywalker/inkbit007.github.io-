// ===== SELECT BUTTONS =====
const addButtons = document.querySelectorAll('.add-btn');
const viewButtons = document.querySelectorAll('.view-btn');

// ===== ADD TO COLLECTION FUNCTION =====
addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const bookCard = button.closest('.book-card');
        const title = bookCard.querySelector('h3').textContent;
        const author = bookCard.querySelector('p').textContent;
        const imgSrc = bookCard.querySelector('img').src;

        let collection = JSON.parse(localStorage.getItem('myCollection')) || [];

        // Check if the book is already in the collection
        const alreadyAdded = collection.some(book => book.title === title);
        if (alreadyAdded) {
            alert(`"${title}" is already in your collection!`);
            return;
        }

        // Add new book to collection
        collection.push({ title, author, imgSrc });
        localStorage.setItem('myCollection', JSON.stringify(collection));

        alert(`"${title}" has been added to your collection!`);
    });
});

// ===== VIEW MORE FUNCTION =====
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const bookCard = button.closest('.book-card');
        const title = bookCard.querySelector('h3').textContent;
        const author = bookCard.querySelector('p').textContent;
        const imgSrc = bookCard.querySelector('img').src;

        // Simple popup for now — can be replaced with modal later
        alert(`📖 ${title}\n${author}\n\n(Feature coming soon!)`);
    });
});
