// Chart.js configuration and initialization

// Color palette for charts
const chartColors = [
    'rgba(66, 133, 244, 0.8)',
    'rgba(219, 68, 55, 0.8)',
    'rgba(244, 180, 0, 0.8)',
    'rgba(15, 157, 88, 0.8)',
    'rgba(102, 0, 204, 0.8)',
    'rgba(255, 112, 67, 0.8)',
    'rgba(3, 169, 244, 0.8)',
    'rgba(0, 188, 212, 0.8)',
    'rgba(0, 150, 136, 0.8)',
    'rgba(76, 175, 80, 0.8)'
];

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

// Initialize Products Chart
function initProductsChart(products) {
    const ctx = document.getElementById('productsChart').getContext('2d');

    if (!products || products.length === 0) {
        return;
    }

    // Extract data for chart
    const labels = products.map(p => p.Description);
    const data = products.map(p => p.total);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                backgroundColor: chartColors.slice(0, products.length),
                borderColor: chartColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + formatNumber(value);
                        }
                    }
                },
                x: {
                    ticks: {
                        callback: function (value) {
                            const label = this.getLabelForValue(value);
                            return label.length > 15 ? label.substr(0, 15) + '...' : label;
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize Countries Chart
function initCountriesChart(countries) {
    const ctx = document.getElementById('countriesChart').getContext('2d');

    if (!countries || countries.length === 0) {
        return;
    }

    // Extract data for chart
    const labels = countries.map(c => c.Country);
    const data = countries.map(c => c.total_revenue);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: chartColors.slice(0, countries.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}