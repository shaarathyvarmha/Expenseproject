/* script.js */
let transactions = [];

// Chart instances for reinitialization
let monthlyChart;
let categoryChart;

// Add Transaction
document.getElementById('add-transaction').addEventListener('submit', (e) => {
    e.preventDefault();

    const month = document.getElementById('month').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!month || isNaN(amount) || amount <= 0 || !category) {
        alert('Please fill in all fields correctly!');
        return;
    }

    transactions.push({ month, amount, category });
    updateSummary();
    updateCharts();
    saveToLocalStorage();
});

// Update Summary
function updateSummary() {
    const income = transactions
        .filter(t => t.category === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.category !== 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('total-income').textContent = income.toFixed(2);
    document.getElementById('total-expenses').textContent = expenses.toFixed(2);
    document.getElementById('balance').textContent = (income - expenses).toFixed(2);
}

// Calculate Monthly Expenses
function calculateMonthlyExpenses() {
    const monthlyExpenses = {};
    transactions.forEach(t => {
        if (t.category !== 'income') {
            monthlyExpenses[t.month] = (monthlyExpenses[t.month] || 0) + t.amount;
        }
    });
    return monthlyExpenses;
}

// Calculate Category Expenses
function calculateCategoryExpenses() {
    const categoryExpenses = {};
    transactions.forEach(t => {
        if (t.category !== 'income') {
            categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        }
    });
    return categoryExpenses;
}

// Update Charts
function updateCharts() {
    if (transactions.length === 0) {
        console.log('No transactions to display.');
        return;
    }

    // Monthly Expenses Chart
    const monthlyExpenses = calculateMonthlyExpenses();
    const months = Object.keys(monthlyExpenses);
    const monthlyData = Object.values(monthlyExpenses);

    const monthlyChartCtx = document.getElementById('monthly-chart').getContext('2d');
    if (monthlyChart) monthlyChart.destroy(); // Destroy the previous chart
    monthlyChart = new Chart(monthlyChartCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyData,
                backgroundColor: '#007bff',
                borderColor: '#0056b3',
                borderWidth: 1,
            }]
        },
        options: { responsive: true }
    });

    // Category Expenses Chart
    const categoryExpenses = calculateCategoryExpenses();
    const categories = Object.keys(categoryExpenses);
    const categoryData = Object.values(categoryExpenses);

    const categoryChartCtx = document.getElementById('category-chart').getContext('2d');
    if (categoryChart) categoryChart.destroy(); // Destroy the previous chart
    categoryChart = new Chart(categoryChartCtx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff', '#c9cbcf']
            }]
        },
        options: { responsive: true }
    });
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load from Local Storage
function loadFromLocalStorage() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        updateSummary();
        updateCharts();
    }
}

// Initialize
loadFromLocalStorage();
