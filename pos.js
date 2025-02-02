let dailySales = JSON.parse(localStorage.getItem('dailySales')) || [];
let currentTransaction = JSON.parse(localStorage.getItem('currentTransaction')) || [];
let salesChart = null;

// Simulated product database
const products = [
    { id: '001', name: 'Apple', unitType: 'kg' },
    { id: '002', name: 'Banana', unitType: 'kg' },
    { id: '003', name: 'Milk', unitType: 'packet' },
    { id: '004', name: 'Bread', unitType: 'packet' },
    { id: '005', name: 'Eggs', unitType: 'packet' },
    { id: '006', name: 'Rice', unitType: 'kg' },
    { id: '007', name: 'Sugar', unitType: 'kg' },
    { id: '008', name: 'Salt', unitType: 'kg' },
    { id: '009', name: 'Flour', unitType: 'kg' },
    { id: '010', name: 'Butter', unitType: 'packet' },
    { id: '011', name: 'Cheese', unitType: 'packet' },
    { id: '012', name: 'Yogurt', unitType: 'packet' },
    { id: '013', name: 'Ice Cream', unitType: 'cone' },
    { id: '014', name: 'Juice', unitType: 'btl' },
    { id: '015', name: 'Soda', unitType: 'btl' },
    { id: '016', name: 'Water', unitType: 'packet' },
    { id: '017', name: 'Coffee', unitType: 'packet' },
    { id: '018', name: 'Tea', unitType: 'packet' },
    { id: '019', name: 'Beer', unitType: 'can' },
    { id: '020', name: 'Wine', unitType: 'bottle' },
];

// Fetch product details based on Product ID
document.getElementById('product-id').addEventListener('input', function() {
    const productId = this.value;
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('unit-type').value = product.unitType;
        document.getElementById('price').value = product.price;
    } else {
        document.getElementById('product-name').value = '';
        document.getElementById('unit-type').value = 'kg';
        document.getElementById('price').value = '';
    }
});

document.getElementById('pos-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const sale = {
        productId: document.getElementById('product-id').value,
        productName: document.getElementById('product-name').value,
        unitType: document.getElementById('unit-type').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        total: parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('price').value),
        time: new Date().toLocaleString()
    };

    currentTransaction.push(sale);
    updateSalesTable();
    updateCurrentTransactionTotal();
    this.reset();
});

function updateSalesTable() {
    const tbody = document.getElementById('sales-body');
    tbody.innerHTML = '';

    currentTransaction.forEach((sale, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${sale.productId}</td>
            <td>${sale.productName}</td>
            <td>${sale.unitType}</td>
            <td>${sale.quantity}</td>
            <td>रु${sale.price.toFixed(2)}</td>
            <td>रु${sale.total.toFixed(2)}</td>
            <td>${sale.time}</td>
            <td><button class="delete-btn" style="background-color:rgb(237, 69, 69); color: white;" onclick="deleteItem(${index})">Delete</button></td>
        `;
    });

    localStorage.setItem('currentTransaction', JSON.stringify(currentTransaction));
}

function updateHistoryTable() {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    dailySales.forEach((sale, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${sale.productId}</td>
            <td>${sale.productName}</td>
            <td>${sale.unitType}</td>
            <td>${sale.quantity}</td>
            <td>रु${sale.price.toFixed(2)}</td>
            <td>रु${sale.total.toFixed(2)}</td>
            <td>${sale.time}</td>
            <td><button class="delete-btn" style="background-color:rgb(237, 69, 69); color: white;" onclick="deleteItem(${index})">Delete</button></td>
        `;
    });
}

function updateCurrentTransactionTotal() {
    const currentTransactionTotal = currentTransaction.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('current-transaction-total').textContent = `Current Transaction Total: रु${currentTransactionTotal.toFixed(2)}`;
}

function updateDailyTotal() {
    const dailyTotal = dailySales.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('daily-total').textContent = `Daily Total: रु${dailyTotal.toFixed(2)}`;
}

function deleteItem(index) {
    currentTransaction.splice(index, 1);
    updateSalesTable();
    updateCurrentTransactionTotal();
}

function deleteHistoryItem(index) {
    dailySales.splice(index, 1);
    updateHistoryTable();
    updateDailyTotal();
    localStorage.setItem('dailySales', JSON.stringify(dailySales));
    
}

function deleteCurrentTransaction() {
    currentTransaction = [];
    updateSalesTable();
    updateCurrentTransactionTotal();
    localStorage.setItem('currentTransaction', JSON.stringify(currentTransaction));
}

function completePayment() {
    const receivedAmount = parseFloat(document.getElementById('received-amount').value);
    const currentTransactionTotal = currentTransaction.reduce((sum, sale) => sum + sale.total, 0);
    const change = receivedAmount - currentTransactionTotal;
    const errorMessage = document.getElementById("error-message");
    if (change < 0 ) {
        errorMessage.textContent= 'Insufficient amount ❌'; 
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
        errorMessage.style.opacity = "1";
        errorMessage.style.transform = "scale(1)";
        errorMessage.style.transition = "5s";
        return
        
    }
    else if (!receivedAmount ) {
        errorMessage.textContent='Please enter the valid amount  ❌';  
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
        errorMessage.style.opacity = "1";
        errorMessage.style.transform = "scale(1)";
        errorMessage.style.transition = "5s";
          
        return
    }
    else {
        errorMessage.textContent = "Thank you for shopping with us don't forget to take your receipt and change ✅";   
        errorMessage.style.color = "#4CAF50";
        errorMessage.style.display = "block";
        errorMessage.style.opacity = "1";
        errorMessage.style.transform = "scale(1)";
        errorMessage.style.transition = "2s";
       

    }
      
        
        
         
      
 

    dailySales = dailySales.concat(currentTransaction);
    localStorage.setItem('dailySales', JSON.stringify(dailySales));
    currentTransaction = [];
    updateSalesTable();
    updateHistoryTable();
    updateCurrentTransactionTotal();
    updateDailyTotal();
    document.getElementById('change-amount').textContent = `Change: रु${change.toFixed(2)}`;
    updateSalesChart();
    document.getElementById('received-amount').value = '';
}

function exportToCSV() {
    const headers = ['Product ID', 'Product Name', 'Unit Type', 'Quantity', 'Price/Unit', 'Total', 'Time'];
    const rows = dailySales.map(sale => [
        sale.productId,
        sale.productName,
        sale.unitType,
        sale.quantity,
        sale.price,
        sale.total,
        sale.time
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `sales_${new Date().toLocaleDateString()}.csv`);
    a.click();
}

function updateSalesChart() {
    const salesByProduct = dailySales.reduce((acc, sale) => {
        if (!acc[sale.productName]) {
            acc[sale.productName] = {
                quantity: 0,
                total: 0
            };
        }
        acc[sale.productName].quantity += sale.quantity;
        acc[sale.productName].total += sale.total;
        return acc;
    }, {});

    const sortedProducts = Object.entries(salesByProduct)
        .sort((a, b) => b[1].total - a[1].total);

    const labels = sortedProducts.map(([product]) => product);
    const data = sortedProducts.map(([, stats]) => stats.total);

    if (salesChart) {
        salesChart.destroy();
    }

    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Sales (रु)',
                data: data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Sales (रु)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Products'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Sales by Product'
                }
            }
        }
    });
}

// Initial setup after page load
document.addEventListener('DOMContentLoaded', () => {
    updateSalesTable();
    updateHistoryTable();
    updateCurrentTransactionTotal();
    updateDailyTotal();
    updateSalesChart();
});