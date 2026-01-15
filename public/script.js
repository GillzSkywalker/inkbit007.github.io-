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

/*INITIALIZE ON PAGE LOAD*/
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}



function saveReadingList(list) {
  localStorage.setItem('readingList', JSON.stringify(list));

}

function getReadingList() {
  const list = localStorage.getItem('readingList');
  return list ? JSON.parse(list) : [];
}

// Save reading list in local storage 
function saveReadingList(list) {
  localStorage.setItem('readingList', JSON.stringify(list));
}

function createReadingCard(item, index) {
  const card = document.createElement('div');
  card.className = 'reading-card'; 
  card.dataset.index = index; 

  const statusClass = item.status.toLowerCase().replace('-', '');
  card.innerHTML = `
    <h3>${escapeHTML(item.title)}</h3>
    <p><strong>Author:</strong> ${escapeHTML(item.author)}</p>
    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${escapeHTML(item.status)}</span></p>
    <p><strong>Progress:</strong> ${item.volumesOwned} / ${item.totalVolumes} volumes</p>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  return card;
  
}

card.innerHTML = `
$   <h3>${escapeHTML(item.title)}</h3>
    <p><strong>Author:</strong> ${escapeHTML(item.author)}</p>
    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${escapeHTML(item.status)}</span></p>
    <p><strong>Progress:</strong> ${item.volumesOwned} / ${item.totalVolumes} volumes</p>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  return card;

  // Create reading item card 
  function createReadingCard(item, index) {
    const card = document.createElement('div');
    card.className = 'reading-card';
    card.dataset.index = index;
    
  const statusClass = item.status === 'completed' ? 'completed' : 
                      item.status === 'reading' ? 'reading' : 'not-started';
  
  const statusEmoji = item.status === 'completed' ? '✅' : 
                      item.status === 'reading' ? '📖' : '📚'; 
  card.innerHTML = `
    ${item.coverImage ? `<img src="${item.coverImage}" alt="${escapeHTML(item.title)} Cover" class="cover-image">` : ''}
    <div class="card-content">
    <h4>${item.title}</h4>
    <p class="author">By ${item.author || 'Unknown Author'}</p>
      ${item.genre ? `<p class="genre">Genre: ${item.genre}</p>` : ''}
      ${item.notes ? `<p class="notes">${item.notes.substring(0, 100)}${item.notes.length > 100 ? '...' : ''}</p>` : ''}
      
      <div class="card-meta">
        <span class="status-badge ${statusClass}">${statusEmoji} ${item.status.replace('-', ' ')}</span>
        ${item.rating ? `<span class="rating">⭐ ${item.rating}/5</span>` : ''}
      </div>
      
      <div class="card-actions">
        <button class="btn-edit" onclick="editItem(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
      </div>
    </div>
  `;

  return card;
  } 
  
  // Display the reading list 
  function displayFullReadingList() {
    const container = document.getElementById('reading-list-container');
    if (!container) return;
    container.innerHTML = '';
    
  if (readingList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>📚 Your reading list is empty. Start adding books!</p>
      </div>
    `;
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Show all items
  readingList.forEach((item, index) => {
    const card = createReadingCard(item, index);
    container.appendChild(card);
  });
}

// Add new item to reading list
function addReadingItem(itemData) {
  const readingList = getReadingList();
  readingList.push({
    ...itemData,
    dateAdded: new Date().toISOString()
  });
  saveReadingList(readingList);
  displayReadingList();
}

// Edit existing item
function editItem(index) {
  const readingList = getReadingList();
  const item = readingList[index];
  
  // Open modal with existing data
  openModal();
  
  // Populate form fields
  document.getElementById('book-title').value = item.title || '';
  document.getElementById('book-author').value = item.author || '';
  document.getElementById('book-genre').value = item.genre || '';
  document.getElementById('book-status').value = item.status || 'not-started';
  document.getElementById('book-rating').value = item.rating || '';
  document.getElementById('book-notes').value = item.notes || '';
  document.getElementById('book-cover').value = item.coverImage || '';
  
  // Store index for updating
  document.getElementById('book-form').dataset.editIndex = index;
}

// Delete item
function deleteItem(index) {
  if (confirm('Are you sure you want to delete this item?')) {
    const readingList = getReadingList();
    readingList.splice(index, 1);
    saveReadingList(readingList);
    
    // Refresh display based on which page we're on
    if (document.getElementById('reading-list-container').classList.contains('reading-grid')) {
      displayReadingList();
    } else {
      displayFullReadingList();
    }
  }
}

// Modal functionality
function openModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('book-form');
    if (form) {
      form.reset();
      delete form.dataset.editIndex;
    }
  }
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const editIndex = form.dataset.editIndex;
  
  const itemData = {
    title: document.getElementById('book-title').value,
    author: document.getElementById('book-author').value,
    genre: document.getElementById('book-genre').value,
    status: document.getElementById('book-status').value,
    rating: document.getElementById('book-rating').value,
    notes: document.getElementById('book-notes').value,
    coverImage: document.getElementById('book-cover').value
  };
  
  const readingList = getReadingList();
  
  if (editIndex !== undefined) {
    // Update existing item
    readingList[editIndex] = {
      ...readingList[editIndex],
      ...itemData,
      dateModified: new Date().toISOString()
    };
  } else {
    // Add new item
    readingList.push({
      ...itemData,
      dateAdded: new Date().toISOString()
    });
  }
  
  saveReadingList(readingList);
  closeModal();
  
  // Refresh display
  if (window.location.pathname.includes('myreadinglist')) {
    displayFullReadingList();
  } else {
    displayReadingList();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on and display accordingly
  if (document.getElementById('reading-list-container')) {
    if (window.location.pathname.includes('myreadinglist')) {
      displayFullReadingList();
    } else {
      displayReadingList();
    }
  }
  
  // Set up form submission
  const form = document.getElementById('book-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Set up modal close button
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close modal on overlay click
  const modalOverlay = document.getElementById('modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Set up "Add Book" button
  const addBookBtn = document.getElementById('add-book-btn');
  if (addBookBtn) {
    addBookBtn.addEventListener('click', openModal);
  }
});

// Filter functionality (if needed)
function filterReadingList(status) {
  const readingList = getReadingList();
  const filtered = status === 'all' 
    ? readingList 
    : readingList.filter(item => item.status === status);
  
  const container = document.getElementById('reading-list-container');
  container.innerHTML = '';
  
  filtered.forEach((item, index) => {
    const card = createReadingCard(item, readingList.indexOf(item));
    container.appendChild(card);
  });
}

// Search functionality
function searchReadingList(query) {
  const readingList = getReadingList();
  const filtered = readingList.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    (item.author && item.author.toLowerCase().includes(query.toLowerCase())) ||
    (item.genre && item.genre.toLowerCase().includes(query.toLowerCase()))
  );
  
  const container = document.getElementById('reading-list-container');
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No books found matching your search.</p></div>';
    return;
  }
  
  filtered.forEach((item) => {
    const card = createReadingCard(item, readingList.indexOf(item));
    container.appendChild(card);
  });
}