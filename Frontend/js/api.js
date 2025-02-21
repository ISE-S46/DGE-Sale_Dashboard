// API base URL - update this to your backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making authenticated API requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if no token exists
        window.location.href = 'index.html';
        return null;
    }

    // Set default headers with authorization
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // If unauthorized, redirect to login
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return null;
        }

        // Parse JSON response
        const data = await response.json();

        // Check for errors
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
}

// API functions for different endpoints
const api = {
    // Get dashboard metrics
    async getRevenue() {
        return await apiRequest('/revenue');
    },

    async getTotalOrders() {
        return await apiRequest('/total-orders');
    },

    async getTopProducts() {
        return await apiRequest('/top-products');
    },

    async getTopCountry() {
        return await apiRequest('/top-country');
    }
};