/* ===================================
   INKBIT COLLECTION MANAGER
   JavaScript Application Logic
   =================================== */

/* ===================================
   DATA STORAGE
   =================================== */
let collection = [];

/* ===================================
   DOM ELEMENTS
   =================================== */
const elements = {
  // Form inputs
  titleInput: null,
  authorInput: null,
  ratingInput: null,
  volumesOwnedInput: null,
  totalVolumesInput: null,
  commentsInput: null,
  addButton: null,
  
  // Filters
  typeFilter: null,
  statusFilter: null,
  sortFilter: null,
  
  // Stats
  totalItemsStat: null,
  completedStat: null,
  readingStat: null,
  totalRatingsStat: null,
  
  // Container for collection items
  collectionContainer: null
};

/* ===================================
   INITIALIZATION
   =================================== */
function init() {
  cacheDOMElements();
  attachEventListeners();
  loadFromStorage();
  updateStats();
  renderCollection();
}

function cacheDOMElements() {
  // Form inputs
  const inputs = document.querySelectorAll('.form-container input');
  const textarea = document.querySelector('.form-container textarea');
  
  if (inputs.length >= 5) {
    elements.titleInput = inputs[0];
    elements.authorInput = inputs[1];
    elements.ratingInput = inputs[2];
    elements.volumesOwnedInput = inputs[3];
    elements.totalVolumesInput = inputs[4];
  }
  
  elements.commentsInput = textarea;
  elements.addButton = document.querySelector('.form-container button');
  
  // Filters
  const selects = document.querySelectorAll('.filters select');
  if (selects.length >= 3) {
    elements.typeFilter = selects[0];
    elements.statusFilter = selects[1];
    elements.sortFilter = selects[2];
  }
  
  // Stats
  const statBoxes = document.querySelectorAll('.stat-box h3');
  if (statBoxes.length >= 4) {
    elements.totalItemsStat = statBoxes[0];
    elements.completedStat = statBoxes[1];
    elements.readingStat = statBoxes[2];
    elements.totalRatingsStat = statBoxes[3];
  }
}

function attachEventListeners() {
  // Add button
  if (elements.addButton) {
    elements.addButton.addEventListener('click', handleAddItem);
  }
  
  // Enter key on form inputs
  const formInputs = [
    elements.titleInput,
    elements.authorInput,
    elements.ratingInput,
    elements.volumesOwnedInput,
    elements.totalVolumesInput
  ];
  
  formInputs.forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleAddItem();
        }
      });
    }
  });
  
  // Filters
  if (elements.typeFilter) {
    elements.typeFilter.addEventListener('change', handleFilterChange);
  }
  if (elements.statusFilter) {
    elements.statusFilter.addEventListener('change', handleFilterChange);
  }
  if (elements.sortFilter) {
    elements.sortFilter.addEventListener('change', handleSortChange);
  }
}

/* ===================================
   COLLECTION MANAGEMENT
   =================================== */
function handleAddItem() {
  // Validate title (required field)
  if (!elements.titleInput || !elements.titleInput.value.trim()) {
    showNotification('Please enter a title', 'error');
    return;
  }
  
  // Create new item
  const newItem = {
    id: Date.now(),
    title: elements.titleInput.value.trim(),
    author: elements.authorInput?.value.trim() || '',
    rating: parseInt(elements.ratingInput?.value) || 0,
    volumesOwned: parseInt(elements.volumesOwnedInput?.value) || 0,
    totalVolumes: parseInt(elements.totalVolumesInput?.value) || 0,
    comments: elements.commentsInput?.value.trim() || '',
    type: 'Manga', // Default type
    status: calculateStatus(
      parseInt(elements.volumesOwnedInput?.value) || 0,
      parseInt(elements.totalVolumesInput?.value) || 0
    ),
    dateAdded: new Date().toISOString()
  };
  
  // Add to collection
  collection.push(newItem);
  
  // Save and update UI
  saveToStorage();
  clearForm();
  updateStats();
  renderCollection();
  
  showNotification('Item added successfully!', 'success');
}

function calculateStatus(volumesOwned, totalVolumes) {
  if (totalVolumes === 0) return 'Reading';
  if (volumesOwned >= totalVolumes) return 'Completed';
  if (volumesOwned > 0) return 'Reading';
  return 'On-hold';
}

function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    collection = collection.filter(item => item.id !== id);
    saveToStorage();
    updateStats();
    renderCollection();
    showNotification('Item deleted', 'success');
  }
}

function editItem(id) {
  const item = collection.find(i => i.id === id);
  if (!item) return;
  
  // Fill form with item data
  if (elements.titleInput) elements.titleInput.value = item.title;
  if (elements.authorInput) elements.authorInput.value = item.author;
  if (elements.ratingInput) elements.ratingInput.value = item.rating;
  if (elements.volumesOwnedInput) elements.volumesOwnedInput.value = item.volumesOwned;
  if (elements.totalVolumesInput) elements.totalVolumesInput.value = item.totalVolumes;
  if (elements.commentsInput) elements.commentsInput.value = item.comments;
  
  // Delete the item (user will re-add it with updates)
  deleteItem(id);
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===================================
   FILTERING & SORTING
   =================================== */
function handleFilterChange() {
  renderCollection();
}

function handleSortChange() {
  renderCollection();
}

function getFilteredCollection() {
  let filtered = [...collection];
  
  // Filter by type
  const typeValue = elements.typeFilter?.value;
  if (typeValue && typeValue !== 'All types') {
    filtered = filtered.filter(item => item.type === typeValue);
  }
  
  // Filter by status
  const statusValue = elements.statusFilter?.value;
  if (statusValue && statusValue !== 'All status') {
    filtered = filtered.filter(item => item.status === statusValue);
  }
  
  return filtered;
}

function getSortedCollection(filtered) {
  const sortValue = elements.sortFilter?.value;
  
  return filtered.sort((a, b) => {
    switch (sortValue) {
      case 'Rating':
        return b.rating - a.rating;
      case 'Volumes Owned':
        return b.volumesOwned - a.volumesOwned;
      case 'Title':
      default:
        return a.title.localeCompare(b.title);
    }
  });
}

/* ===================================
   RENDERING
   =================================== */
function renderCollection() {
  // Get or create collection container
  let container = document.querySelector('.collection-items');
  
  if (!container) {
    container = document.createElement('div');
    container.className = 'collection-items';
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsSection.parentNode.insertBefore(container, statsSection.nextSibling);
    }
  }
  
  const filtered = getFilteredCollection();
  const sorted = getSortedCollection(filtered);
  
  if (sorted.length === 0) {
    container.innerHTML = '<p class="no-items">No items in your collection yet. Start by adding one above!</p>';
    return;
  }
  
  container.innerHTML = sorted.map(item => createItemHTML(item)).join('');
  
  // Attach event listeners to new buttons
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      deleteItem(id);
    });
  });
  
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      editItem(id);
    });
  });
}

function createItemHTML(item) {
  const progress = item.totalVolumes > 0 
    ? Math.round((item.volumesOwned / item.totalVolumes) * 100) 
    : 0;
  
  const statusClass = item.status.toLowerCase().replace('-', '');
  
  return `
    <div class="collection-item" data-id="${item.id}">
      <div class="item-header">
        <h3>${escapeHTML(item.title)}</h3>
        <div class="item-actions">
          <button class="edit-btn" data-id="${item.id}">Edit</button>
          <button class="delete-btn" data-id="${item.id}">Delete</button>
        </div>
      </div>
      
      <div class="item-info">
        ${item.author ? `<p><strong>Author:</strong> ${escapeHTML(item.author)}</p>` : ''}
        <p><strong>Type:</strong> ${escapeHTML(item.type)}</p>
        <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${escapeHTML(item.status)}</span></p>
        ${item.rating > 0 ? `<p><strong>Rating:</strong> ${'⭐'.repeat(Math.min(item.rating, 10))}</p>` : ''}
      </div>
      
      <div class="item-progress">
        <div class="progress-info">
          <span>Progress: ${item.volumesOwned} / ${item.totalVolumes} volumes</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
      
      ${item.comments ? `<p class="item-comments">${escapeHTML(item.comments)}</p>` : ''}
    </div>
  `;
}

/* ===================================
   STATISTICS
   =================================== */
function updateStats() {
  const total = collection.length;
  const completed = collection.filter(item => item.status === 'Completed').length;
  const reading = collection.filter(item => item.status === 'Reading').length;
  const totalRating = collection.reduce((sum, item) => sum + item.rating, 0);
  const avgRating = total > 0 ? (totalRating / total).toFixed(1) : 0;
  
  if (elements.totalItemsStat) elements.totalItemsStat.textContent = total;
  if (elements.completedStat) elements.completedStat.textContent = completed;
  if (elements.readingStat) elements.readingStat.textContent = reading;
  if (elements.totalRatingsStat) elements.totalRatingsStat.textContent = avgRating;
}

/* ===================================
   STORAGE (In-Memory)
   =================================== */
function saveToStorage() {
  // Store in memory only - no browser storage
  // Data persists during session only
}

function loadFromStorage() {
  // No data loaded from storage
  // Starting with empty collection
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */
function clearForm() {
  if (elements.titleInput) elements.titleInput.value = '';
  if (elements.authorInput) elements.authorInput.value = '';
  if (elements.ratingInput) elements.ratingInput.value = '';
  if (elements.volumesOwnedInput) elements.volumesOwnedInput.value = '';
  if (elements.totalVolumesInput) elements.totalVolumesInput.value = '';
  if (elements.commentsInput) elements.commentsInput.value = '';
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ===================================
   INITIALIZE ON PAGE LOAD
   =================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}