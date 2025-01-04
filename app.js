const symbols = [
    { symbol: "USDTIRT", title: "USDT", unit: "T", factor: 0.1 },
    { symbol: "PAXGIRT", title: "PAXG", unit: "T", factor: 0.1 },
    { symbol: "BTCIRT", title: "BTC", unit: "T", factor: 0.1 },
    { symbol: "ETHIRT", title: "ETH", unit: "T", factor: 0.1 },
    { symbol: "BNBIRT", title: "BNB", unit: "T", factor: 0.1 },
    { symbol: "SOLIRT", title: "SOL", unit: "T", factor: 0.1 },
    { symbol: "TRXIRT", title: "TRX", unit: "T", factor: 0.1 },
    { symbol: "XRPIRT", title: "XRP", unit: "T", factor: 0.1 },
    { symbol: "DOGEIRT", title: "DOGE", unit: "T", factor: 0.1 },
    { symbol: "SHIBIRT", title: "SHIB", unit: "T", factor: 0.1 },
    { symbol: "TONIRT", title: "TON", unit: "T", factor: 0.1 },
    { symbol: "NOTIRT", title: "NOT", unit: "T", factor: 0.1 },
];

const priceList = document.getElementById('price-list');
const prices = {};

// Create WebSocket connection
const socket = new WebSocket('wss://wss.nobitex.ir/connection/websocket');

// Initialize table rows
symbols.forEach(item => {
    prices[item.symbol] = 0; // Initialize with 0
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.symbol}</td>
        <td class="price" id="${item.symbol}">Loading...</td>
    `;
    priceList.appendChild(row);
});

// Listen for WebSocket messages
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'ticker' && data.symbol && data.price) {
        updatePrice(data.symbol, parseFloat(data.price));
    }
});

// Function to update prices
function updatePrice(symbol, newPrice) {
    const priceElement = document.getElementById(symbol);
    const oldPrice = prices[symbol];
    prices[symbol] = newPrice;

    priceElement.textContent = (newPrice * 0.1).toFixed(2); // Apply factor

    if (oldPrice > 0) {
        const priceChangeClass = newPrice > oldPrice ? 'green' : 'red';
        priceElement.classList.add(priceChangeClass);
        setTimeout(() => {
            priceElement.classList.remove(priceChangeClass);
        }, 3000);
    }
}

// Send subscription request
socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
        type: 'subscribe',
        channels: symbols.map(s => `ticker-${s.symbol}`)
    }));
});

// Reconnect logic
socket.addEventListener('close', () => {
    console.error('WebSocket closed, reconnecting...');
    setTimeout(() => {
        window.location.reload();
    }, 5000);
});
