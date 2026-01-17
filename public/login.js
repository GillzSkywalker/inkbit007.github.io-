// ===== Toast Notification Helper =====
function showToast(message, type = 'info', ttl = 3000) {
    try {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.textContent = message;
        
        // Add color based on type
        if (type === 'success') el.style.backgroundColor = '#4caf50';
        else if (type === 'error') el.style.backgroundColor = '#f44336';
        else if (type === 'warn') el.style.backgroundColor = '#ff9800';
        else el.style.backgroundColor = '#2196f3';
        
        container.appendChild(el);
        
        // Show
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, 50);
        
        // Hide and remove
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px) scale(.95)';
        }, ttl);
        
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, ttl + 300);
    } catch (error) {
        console.error('Error showing toast:', error);
        alert(message);
    }
}

// ===== Sync Collections Helper =====
async function syncCollections() {
    try {
        const localCollections = JSON.parse(localStorage.getItem('myCollection') || '[]');
        if (localCollections.length > 0) {
            const response = await fetch('/api/collections/sync-collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for auth
                body: JSON.stringify({ name: 'My Collection', items: localCollections })
            });
            if (response.ok) {
                localStorage.removeItem('myCollection'); // Clear after sync
            } else {
                console.warn('Failed to sync collections:', response.status);
            }
        }
    } catch (err) {
        console.error('Error syncing collections:', err);
    }
}

// ===== Main Login Handler =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showToast('Please enter username and password.', 'error');
                return;
            }

            // Disable button
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                let data = {};
                try {
                    data = await response.json();
                } catch (e) {
                    console.warn('Response was not JSON', e);
                }

                if (response.ok) {
                    showToast('Login successful! Redirecting...', 'success');
                    await syncCollections();
                    setTimeout(() => {
                        window.location.href = '/landing/index.html';
                    }, 1000);
                } else {
                    showToast(data.error || 'Invalid credentials', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Network error. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

// ===== Google Sign-In Integration =====
function initializeGoogleSignIn() {
    if (!window.google || !google.accounts || !google.accounts.id) return;
    
    try {
        google.accounts.id.initialize({
            client_id: '177625116230-r2stj5gno0j1t9oufpvjgqs9tcghbcoq.apps.googleusercontent.com',
            callback: handleGoogleSignIn,
            context: 'signin',
            ux_mode: 'popup'
        });
        
        const btnContainer = document.getElementById('google-signin-button');
        if (btnContainer) {
            google.accounts.id.renderButton(
                btnContainer,
                { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
            );
        }
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
    }
}

async function handleGoogleSignIn(response) {
    if (!response || !response.credential) return;

    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            showToast('Login successful! Redirecting...', 'success');
            await syncCollections();
            window.location.href = '/landing/index.html';
        } else {
            showToast(data.error || 'Google sign-in failed', 'error');
        }
    } catch (error) { showToast('Network error', 'error'); }
}

// Check for Google Sign-In script load
const checkGoogleInterval = setInterval(() => {
    if (window.google && google.accounts) {
        clearInterval(checkGoogleInterval);
        initializeGoogleSignIn();
    }
}, 100);

// Stop checking after 10 seconds
setTimeout(() => clearInterval(checkGoogleInterval), 10000);