// ===== Toast Notification Helper =====
function showToast(message, type = 'info', ttl = 3000) {
    try {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(container);
        }
        
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.textContent = message;
        el.style.cssText = `padding: 14px 20px; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); opacity: 0; transform: translateY(16px) scale(.95); transition: opacity 240ms ease, transform 240ms ease; max-width: 300px; word-wrap: break-word;`;
        
        // Add color based on type
        if (type === 'success') {
            el.style.backgroundColor = '#4caf50';
            el.style.color = '#fff';
        } else if (type === 'error') {
            el.style.backgroundColor = '#f44336';
            el.style.color = '#fff';
        } else if (type === 'warn') {
            el.style.backgroundColor = '#ff9800';
            el.style.color = '#fff';
        } else {
            el.style.backgroundColor = '#2196f3';
            el.style.color = '#fff';
        }
        
        container.appendChild(el);
        
        // Show the toast
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, 50);
        
        // Hide and remove the toast
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px) scale(.98)';
        }, ttl);
        
        setTimeout(() => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, ttl + 300);
        
        console.log('Toast shown:', message, type);
    } catch (error) {
        console.error('Error showing toast:', error);
        // Fallback: use alert
        alert(message);
    }
}

// ===== Validation Helper =====
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

// ===== Main Signup Handler =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    if (!form) {
        console.error('Signup form not found: expected element with id "signup-form"');
        return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.warn('Signup submit button not found inside the form.');
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // ===== Input Validation =====
        if (!email || !username || !password || !confirmPassword) {
            showToast('All fields are required.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        if (!validatePassword(password)) {
            showToast('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        // ===== Disable button during request =====
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: username, email: email, password: password })
            });

            if (response.ok) {
                // Sync local collections after signup
                await syncCollections();
                showToast('Account created successfully! Redirecting...', 'success');
                setTimeout(() => { window.location.href = '/landing/index.html'; }, 1500);
                return;
            }

            // Try to parse JSON error, fall back to text
            let errorMsg = 'Signup failed. Please try again.';
            try {
                const data = await response.json();
                if (data && data.error) errorMsg = data.error;
            } catch (parseErr) {
                try {
                    const text = await response.text();
                    if (text) errorMsg = text;
                } catch (_) {
                    /* ignore */
                }
            }

            console.warn('Signup failed:', response.status, errorMsg);
            showToast(errorMsg, 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Signup network/error:', error);
            showToast('Network or server error during signup. Check server is running.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });

    // Handle guest button click
    const guestBtn = document.getElementById('guest-btn');
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            window.location.href = '/landing/index.html';
        });
    }
});

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

// ===== Google Sign-In Integration =====
function initializeGoogleSignIn() {
    try {
        google.accounts.id.initialize({
            client_id: '177625116230-r2stj5gno0j1t9oufpvjgqs9tcghbcoq.apps.googleusercontent.com',
            callback: handleGoogleSignIn,
            context: 'signup',
            ux_mode: 'popup'
        });
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { 
                theme: 'outline', 
                size: 'large',
                width: '100%',
                text: 'signup_with'
            }
        );
        console.log('Google Sign-In initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
            buttonContainer.innerHTML = '<p style="color: red;">Google Sign-In not available</p>';
        }
    }
}

// Load Google Sign-In script if not already loaded
if (!window.google || !google.accounts) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = function() {
        setTimeout(initializeGoogleSignIn, 100);
    };
    script.onerror = function() {
        console.error('Failed to load Google Sign-In script');
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
            buttonContainer.innerHTML = '<p style="color: red;">Google Sign-In not available</p>';
        }
    };
    document.head.appendChild(script);
} else {
    initializeGoogleSignIn();
}

// Handle Google Sign-In response
async function handleGoogleSignIn(response) {
    console.log('Received Google signup response');
    
    if (!response || !response.credential) {
        showToast('Invalid Google sign-in response', 'error');
        return;
    }

    try {
        // Send the token to your backend
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: response.credential
            })
        });

        const data = await res.json();
        console.log('Backend response:', data);

        if (data.success) {
            showToast('Account created successfully! Redirecting...', 'success');
            // Sync local collections after signup
            await syncCollections();
            setTimeout(() => {
                window.location.href = '/landing/index.html';
            }, 2000);
        } else {
            showToast(data.error || 'Google sign-up failed', 'error');
        }
    } catch (error) {
        console.error('Error during Google sign-up:', error);
        showToast('Error during sign-up. Please try again.', 'error');
    }

}


