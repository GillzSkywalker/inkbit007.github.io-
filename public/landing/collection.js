// ===== COLLECTIONS.JS =====

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Sample array to store user collections (empty initially)
    let collections = [];

    // Select DOM elements
    const collectionsSection = document.querySelector(".my-collections");
    const noCollectionsMsg = document.createElement("h2");
    noCollectionsMsg.textContent = "No Collections yet.";

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons");

    const exploreBtn = document.createElement("button");
    exploreBtn.classList.add("btn", "explore-btn");
    exploreBtn.innerHTML = `<a href="explore.html">Explore More to Collect</a>`;

    const homeBtn = document.createElement("button");
    homeBtn.classList.add("btn", "home-btn");
    homeBtn.innerHTML = `<a href="index.html">Back to Homepage</a>`;

    buttonsContainer.appendChild(exploreBtn);
    buttonsContainer.appendChild(homeBtn);

    // Append message and buttons initially
    collectionsSection.appendChild(noCollectionsMsg);
    collectionsSection.appendChild(buttonsContainer);

    // ===== Function to render collections =====
    function renderCollections() {
        // Clear everything first
        collectionsSection.innerHTML = "";

        if (collections.length === 0) {
            noCollectionsMsg.textContent = "No Collections yet.";
            collectionsSection.appendChild(noCollectionsMsg);
        } else {
            noCollectionsMsg.textContent = "Your Collections:";
            collectionsSection.appendChild(noCollectionsMsg);

            // Create a grid container for cards
            const grid = document.createElement("div");
            grid.classList.add("collection-grid");

            collections.forEach(book => {
                const card = document.createElement("div");
                card.classList.add("collection-card");

                card.innerHTML = `
                    <img src="${book.image}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <button class="btn view-btn">View</button>
                `;

                grid.appendChild(card);
            });

            collectionsSection.appendChild(grid);
        }

        // Append buttons at the bottom
        collectionsSection.appendChild(buttonsContainer);
    }

    // ===== Function to add new collection item =====
    function addToCollection(book) {
        collections.push(book);
        renderCollections();
    }

    // ===== Example: Test book (can be added from Explore page) =====
    const exampleBook = {
        title: "One Piece",
        author: "Eiichiro Oda",
        image: "book3.jpg"
    };

    // Uncomment the line below to test:
    // addToCollection(exampleBook);

    // ===== Initialize Page =====
    renderCollections();
});
