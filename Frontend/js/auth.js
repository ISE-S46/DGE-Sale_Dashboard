// Auth API endpoints
const AUTH_URL = 'http://localhost:3001/api/auth';

// Handle login form submission
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('login-error');

            try {
                // Clear previous errors
                errorEl.classList.add('d-none');

                // Send login request
                const response = await fetch(`${AUTH_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Store token and redirect to dashboard
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';

            } catch (error) {
                // Display error message
                errorEl.textContent = error.message;
                errorEl.classList.remove('d-none');
            }
        });
    }

    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
            try {
                // Get token for authorization header
                const token = localStorage.getItem('token');

                // Send logout request
                await fetch(`${AUTH_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Remove token and redirect to login regardless of API success
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            }
        });
    }

    // Check if user is authenticated (on dashboard page)
    if (window.location.pathname.includes('dashboard')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
        }
    }
});