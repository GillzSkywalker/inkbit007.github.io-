/* ===== COLLECTIONS PAGE JAVASCRIPT ===== */

// ===== State Management =====
let collections = [];
const collectionState = {
  currentFilter: 'all',
  currentSort: 'recent',
  searchQuery: ''
};

// ===== DOM Elements =====
const collectionsGrid = document.getElementById('collections-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-collections');
const filterSelect = document.getElementById('filter-collections');
const sortSelect = document.getElementById('sort-collections');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadCollections();
  renderCollections();
});

// ===== Event Listeners =====
function initializeEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      collectionState.searchQuery = e.target.value.toLowerCase();
      renderCollections();
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      collectionState.currentFilter = e.target.value;
      renderCollections();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      collectionState.currentSort = e.target.value;
      renderCollections();
    });
  }
}

// ===== Load Collections from API =====
async function loadCollections() {
  try {
    const response = await fetch('/api/collections/my-collections', {
      credentials: 'include'
    });
    if (response.ok) {
      collections = await response.json();
      updateStats();
    } else {
      console.log('No collections found');
      collections = [];
    }
  } catch (error) {
    console.error('Error loading collections:', error);
    collections = [];
  }
}

// ===== Filter Collections =====
function filterCollections() {
  return collections.filter((collection) => {
    const matchesSearch = collection.title.toLowerCase().includes(collectionState.searchQuery) ||
                          collection.author.toLowerCase().includes(collectionState.searchQuery);
    const matchesFilter = collectionState.currentFilter === 'all' ||
                          collection.type === collectionState.currentFilter;
    return matchesSearch && matchesFilter;
  });
}

// ===== Sort Collections =====
function sortCollections(filtered) {
  const sorted = [...filtered];
  
  switch (collectionState.currentSort) {
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'rating':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'recent':
    default:
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  return sorted;
}

// ===== Render Collections =====
function renderCollections() {
  const filtered = filterCollections();
  const sorted = sortCollections(filtered);

  if (sorted.length === 0) {
    collectionsGrid.style.display = 'none';
    emptyState.classList.remove('hidden');
    return;
  }

  collectionsGrid.style.display = 'grid';
  emptyState.classList.add('hidden');
  collectionsGrid.innerHTML = '';

  sorted.forEach((collection) => {
    const card = createCollectionCard(collection);
    collectionsGrid.appendChild(card);
  });
}

// ===== Create Collection Card =====
function createCollectionCard(collection) {
  const card = document.createElement('div');
  card.className = 'collection-card';

  const imageUrl = collection.image || '/placeholder.jpg';
  const rating = collection.rating ? `⭐ ${collection.rating}/10` : 'Not rated';
  const status = collection.status || 'Not started';

  card.innerHTML = `
    <img src="${imageUrl}" alt="${collection.title}" class="collection-image">
    <div class="collection-content">
      <h3 class="collection-title">${collection.title}</h3>
      <p class="collection-author">${collection.author || 'Unknown Author'}</p>
      <div class="collection-meta">
        <span>${status}</span>
        <span class="collection-rating">${rating}</span>
      </div>
      <div class="collection-actions">
        <button class="btn-edit" onclick="editCollection('${collection._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteCollection('${collection._id}')">Delete</button>
      </div>
    </div>
  `;

  return card;
}

// ===== Edit Collection =====
function editCollection(id) {
  console.log('Editing collection:', id);
  // TODO: Implement edit functionality
  alert('Edit feature coming soon!');
}

// ===== Delete Collection =====
async function deleteCollection(id) {
  if (!confirm('Are you sure you want to delete this collection?')) {
    return;
  }

  try {
    const response = await fetch(`/api/collections/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      collections = collections.filter(c => c._id !== id);
      updateStats();
      renderCollections();
      alert('Collection deleted successfully');
    } else {
      alert('Failed to delete collection');
    }
  } catch (error) {
    console.error('Error deleting collection:', error);
    alert('Error deleting collection');
  }
}

// ===== Update Statistics =====
function updateStats() {
  const totalCount = document.getElementById('total-count');
  const completedCount = document.getElementById('completed-count');
  const readingCount = document.getElementById('reading-count');
  const avgRating = document.getElementById('avg-rating');

  if (totalCount) {
    totalCount.textContent = collections.reduce((sum, col) => sum + (col.itemCount || 0), 0);
  }

  if (completedCount) {
    completedCount.textContent = collections.filter(col => col.status === 'Completed').length;
  }

  if (readingCount) {
    readingCount.textContent = collections.filter(col => col.status === 'Reading').length;
  }

  if (avgRating) {
    const ratings = collections.filter(col => col.rating).map(col => col.rating);
    const average = ratings.length > 0 ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : '0';
    avgRating.textContent = average;
  }
}
