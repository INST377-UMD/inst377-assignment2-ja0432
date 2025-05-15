const polygonAPIKey = '2BITcZGgSpwuVeo9kBXJYebbqoxJpBi4';
const tradestieAPI = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

let chart; // For updating the chart later

function lookupStock() {
  const ticker = document.getElementById('stockTicker').value.toUpperCase();
  const days = parseInt(document.getElementById('dateRange').value);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${polygonAPIKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        displayChart(data.results, ticker);
      } else {
        console.error('No stock data available:', data);
      }
    })
    .catch(e => console.error('Error fetching stock data:', e));

  // Reddit trending stocks fetch
  fetch(tradestieAPI)
    .then(res => res.json())
    .then(data => {
      displayRedditStocks(data);
    })
    .catch(err => console.error('Error fetching Reddit data:', err));
}

function displayChart(data, ticker) {
  const dates = data.map(item => new Date(item.t).toLocaleDateString());
  const prices = data.map(item => item.c);

  const ctx = document.getElementById('stockChart').getContext('2d');

  // Destroy the old chart if it exists
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: `${ticker} Stock Price`,
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

function displayRedditStocks(data) {
  const stocks = data.slice(0, 5);
  const table = document.getElementById('redditStocksTable').getElementsByTagName('tbody')[0];
  table.innerHTML = ''; // Clear previous rows

  stocks.forEach(stock => {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.innerHTML = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
    cell2.innerText = stock.comment_count;
    cell3.innerText = stock.sentiment === 'Bullish' ? 'Bullish' : 'Bearish';
  });
}

// Voice commands using Annyang
if (annyang) {
  const commands = {
    'lookup *ticker': ticker => {
      document.getElementById('stockTicker').value = ticker;
      lookupStock();
    }
  };

  annyang.addCommands(commands);
}
