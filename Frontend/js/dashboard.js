// Dashboard initialization and data loading
document.addEventListener('DOMContentLoaded', async function () {
    // Only run on dashboard page
    if (!window.location.pathname.includes('dashboard')) {
        return;
    }

    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Load dashboard data
    async function loadDashboardData() {
        try {
            // Fetch all data in parallel
            const [revenueData, ordersData, productsData, countryData] = await Promise.all([
                api.getRevenue(),
                api.getTotalOrders(),
                api.getTopProducts(),
                api.getTopCountry()
            ]);

            // Update revenue card
            if (revenueData && revenueData[0]) {
                document.getElementById('total-revenue').textContent = formatCurrency(revenueData[0].total || 0);
            }

            // Update orders card
            if (ordersData && ordersData[0]) {
                document.getElementById('total-orders').textContent = ordersData[0].total_orders || 0;
            }

            // Update top product card
            if (productsData && productsData.length > 0) {
                const topProduct = productsData[0];
                document.getElementById('top-product-name').textContent = topProduct.Description || 'N/A';
                document.getElementById('top-product-revenue').textContent = formatCurrency(topProduct.total || 0);
            }

            // Update top country card
            if (countryData && countryData[0]) {
                document.getElementById('top-country-name').textContent = countryData[0].Country || 'N/A';
                document.getElementById('top-country-revenue').textContent = formatCurrency(countryData[0].total_revenue || 0);
            }

            // Initialize charts
            if (productsData && productsData.length > 0) {
                initProductsChart(productsData.slice(0, 5));
            }

            if (countryData && countryData.length > 0) {
                initCountriesChart(countryData);
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load initial data
    loadDashboardData();
});