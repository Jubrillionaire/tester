document.getElementById('tradeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const pips = parseInt(document.getElementById('pips').value);
    const month = document.getElementById('month').value;
    const tradesCount = parseInt(document.getElementById('tradesCount').value);
    addTrade({ pips, month, tradesCount });
    clearFormInputs();
});

function clearFormInputs() {
    document.getElementById('pips').value = '';
    document.getElementById('month').value = '';
    document.getElementById('tradesCount').value = '';
}

function loadTrades() {
    return JSON.parse(localStorage.getItem('trades')) || [];
}

function saveTrades(trades) {
    localStorage.setItem('trades', JSON.stringify(trades));
    updateDisplay(trades);
}

function addTrade(trade) {
    const trades = loadTrades();
    trades.push(trade);
    saveTrades(trades);
}

function deleteTrade(index) {
    const trades = loadTrades();
    trades.splice(index, 1);
    saveTrades(trades);
}

function editTrade(index, updatedTrade) {
    const trades = loadTrades();
    trades[index] = updatedTrade;
    saveTrades(trades);
}

function calculateStats(trades) {
    const groupedByMonth = {};
    trades.forEach(trade => {
        const { pips, month } = trade;
        if (!groupedByMonth[month]) {
            groupedByMonth[month] = { pips: 0 };
        }
        groupedByMonth[month].pips += pips;
    });
    return groupedByMonth;
}

function updateDisplay(trades) {
    const stats = calculateStats(trades);
    const accountSize = 200000;
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    trades.forEach((trade, index) => {
        const { pips, month } = trade;
        const percentageWinLoss = ((pips * 133.33) / accountSize * 100).toFixed(2) + '%';

        const [year, monthIndex] = month.split('-');
        const displayDate = new Date(year, monthIndex - 1); // Correctly create the date object

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <p>Total Pips: ${pips}</p>
            <p>Percentage Win/Loss: ${percentageWinLoss}</p>
            <button onclick="deleteTrade(${index})">Delete</button>
            <button onclick="openEditModal(${index}, '${month}', ${pips})">Edit</button>
        `;
        cardsContainer.appendChild(card);
    });
}

// Modal-related functions
function openEditModal(index, month, pips) {
    document.getElementById('editPips').value = pips;
    document.getElementById('editMonth').value = month;
    document.getElementById('editIndex').value = index;
    document.getElementById('editModal').style.display = 'block';
}

document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value);
    const pips = parseInt(document.getElementById('editPips').value);
    const month = document.getElementById('editMonth').value;

    editTrade(index, { pips, month });
    closeModal();
});

document.getElementById('closeModal').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Initialize display from existing local storage data on page load
window.onload = () => {
    const trades = loadTrades();
    updateDisplay(trades);
};

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}
