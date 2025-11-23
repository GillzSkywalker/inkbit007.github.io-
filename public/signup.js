// ===== Toast Notification Helper =====
function showToast(message, type = 'info', ttl = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
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