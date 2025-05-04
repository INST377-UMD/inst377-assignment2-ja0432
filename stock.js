// stocks.js

const polygonAPIKey = 'YOUR_POLYGON_API_KEY';
const tradestieAPI = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

// Lookup the stock and fetch data
function lookupStock() {
  const ticker = document.getElementById('stockTicker').value.toUpperCase();
  const days = document.getElementById('dateRange').value;

  fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-09/2023-02-10?adjusted=true&sort=asc&limit=${days}&apiKey=${polygonAPIKey}`)
    .then(res => res.json())
    .then(data => {
      displayChart(data.results);
    })
    .catch(err => console.error(err));

  // Fetch Reddit stock data
  fetch(tradestieAPI)
    .then(res => res.json())
    .then(data => {
      displayRedditStocks(data);
    })
    .catch(err => console.error(err));
}

// Display the stock data on the chart
function displayChart(data) {
  const dates = data.map(item => new Date(item.t * 1000).toLocaleDateString());
  const prices = data.map(item => item.c); // Closing prices

  const ctx = document.getElementById('stockChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Stock Price',
        data: prices,
        borderColor: 'rgb(0, 123, 255)',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { ticks: { maxRotation: 90, minRotation: 45 } },
        y: { beginAtZero: false }
      }
    }
  });
}

// Display top 5 Reddit stocks
function displayRedditStocks(data) {
  const stocks = data.slice(0, 5);
  const table = document.getElementById('redditStocksTable').getElementsByTagName('tbody')[0];

  stocks.forEach(stock => {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.innerHTML = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
    cell2.innerText = stock.comment_count;
    cell3.innerHTML = stock.sentiment === 'Bullish' ? '👍' : '👎';
  });
}

// Voice command setup for Annyang
if (annyang) {
  const commands = {
    'lookup *ticker': ticker => {
      document.getElementById('stockTicker').value = ticker;
      lookupStock();
    }
  };

  annyang.addCommands(commands);
  annyang.start();
}
