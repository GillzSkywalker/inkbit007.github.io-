// ===== MY PROFILE PAGE LOGIC =====

// DOM Elements
const guestSection = document.getElementById('guest-section');
const profileSection = document.getElementById('profile-section');
const loadingSection = document.getElementById('loading-section');

const profileDisplay = document.getElementById('profile-display');
const profileForm = document.getElementById('profile-form');
const editProfileBtn = document.getElementById('edit-profile-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Check if user is authenticated and load profile
document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndLoadProfile();

    // Event listeners
    editProfileBtn?.addEventListener('click', toggleEditMode);
    cancelEditBtn?.addEventListener('click', toggleEditMode);
    profileForm?.addEventListener('submit', handleSaveProfile);

    // Logout handler
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const res = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (res.ok) {
                    window.location.href = '/landing/login.html';
                } else {
                    console.error('Logout failed');
                }
            } catch (err) {
                console.error('Logout error:', err);
            }
        });
    }
});

async function checkAuthAndLoadProfile() {
    try {
        showLoading(true);

        // Check auth by trying to fetch current user
        const authRes = await fetch('/api/users/me', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        if (!authRes.ok) {
            // Not authenticated
            showGuest();
            return;
        }

        const user = await authRes.json();
        displayProfile(user);
        showProfile();
    } catch (err) {
        console.error('Auth check failed:', err);
        showGuest();
    } finally {
        showLoading(false);
    }
}

function displayProfile(user) {
    // Populate profile fields
    document.getElementById('profile-name').textContent = user.name || 'Not set';
    document.getElementById('profile-email').textContent = user.email || 'Not set';
    document.getElementById('profile-username').textContent = user.username || (user.email?.split('@')[0] || 'N/A');
    document.getElementById('profile-bio').textContent = user.bio || 'No bio yet';
    const locDisplay = document.getElementById('profile-location');
    if (locDisplay) locDisplay.textContent = user.location || 'Not set';

    // Populate form fields
    document.getElementById('edit-name').value = user.name || '';
    document.getElementById('edit-bio').value = user.bio || '';
    const locInput = document.getElementById('edit-location');
    if (locInput) locInput.value = user.location || '';

    // Load stats (collections, achievements)
    loadStats();

    // Store current user for later use
    window.currentUser = user;
}

async function loadStats() {
    try {
        // Try to fetch collection count
        const collectionsRes = await fetch('/api/collections/my-collections', {
            credentials: 'include'
        });
        const collections = collectionsRes.ok ? await collectionsRes.json() : [];
        document.getElementById('collections-count').textContent = collections.length || 0;

        // Try to fetch achievements (if endpoint exists)
        // For now, use a placeholder or localStorage
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const unlockedCount = achievements.filter(a => a.unlocked).length;
        document.getElementById('achievements-count').textContent = unlockedCount || 0;
    } catch (err) {
        console.error('Error loading stats:', err);
    }
}

function toggleEditMode() {
    profileDisplay.classList.toggle('hidden');
    profileForm.classList.toggle('hidden');
}

async function handleSaveProfile(e) {
    e.preventDefault();

    const name = document.getElementById('edit-name').value.trim();
    const bio = document.getElementById('edit-bio').value.trim();
    const locInput = document.getElementById('edit-location');
    const location = locInput ? locInput.value.trim() : '';

    if (!name) {
        showToast('Name is required.', 'warn');
        return;
    }

    try {
        const res = await fetch('/api/users/me', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, bio, location })
        });

        if (!res.ok) {
            const err = await res.json();
            showToast(err.message || 'Failed to save profile.', 'warn');
            return;
        }

        const updatedUser = await res.json();
        displayProfile(updatedUser);
        toggleEditMode();
        showToast('Profile updated successfully!', 'success');
    } catch (err) {
        console.error('Error saving profile:', err);
        showToast('An error occurred. Please try again.', 'warn');
    }
}

function showGuest() {
    guestSection.classList.remove('hidden');
    profileSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
}

function showProfile() {
    guestSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
    loadingSection.classList.add('hidden');
}

function showLoading(show) {
    if (show) {
        guestSection.classList.add('hidden');
        profileSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
    } else {
        loadingSection.classList.add('hidden');
    }
}

function showToast(msg, type = 'info', ttl = 2800) {
    const containerId = 'profile-toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.right = '18px';
        container.style.bottom = '18px';
        container.style.zIndex = '2000';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    el.style.marginTop = '8px';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.color = '#071021';
    el.style.background = type === 'success' ? '#b6f7c7' : (type === 'warn' ? '#ffd6a6' : '#cde7ff');
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, ttl);
    setTimeout(() => el.remove(), ttl + 240);
}
