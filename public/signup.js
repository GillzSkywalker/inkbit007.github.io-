document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                alert('Signup successful!');
                window.location.href = '/landing/index.html';
            } else {
                const data = await response.json();
                alert(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
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