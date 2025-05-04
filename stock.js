import { restClient } from '@polygon.io/client-js';

const polygonAPIKey = '2BITcZGgSpwuVeo9kBXJYebbqoxJpBi4';
const tradestieAPI = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

const rest = restClient(polygonAPIKey);

function lookupStock() {
  const ticker = document.getElementById('stockTicker').value.toUpperCase();
  const days = document.getElementById('dateRange').value;

  // Calculate the start date based on the selected number of days
  const startDate = getStartDate(days);
  const endDate = new Date().toISOString().split('T')[0];  // Today's date

  // Use Polygon.io API to fetch stock aggregates (OHLCV)
  rest.stocks.aggregates(ticker, 1, "day", startDate, endDate, {
    adjusted: "true",
    sort: "asc",
    limit: 120
  })
  .then(data => {
    if (data.results) {
      displayChart(data.results);
    } else {
      console.error('No stock data available:', data);
    }
  })
  .catch(e => {
    console.error('Error fetching stock data:', e);
  });

  // Fetch Reddit stock data
  fetch(tradestieAPI)
    .then(res => res.json())
    .then(data => {
      displayRedditStocks(data);
    })
    .catch(err => console.error('Error fetching Reddit data:', err));
}

function getStartDate(days) {
  const today = new Date();
  today.setDate(today.getDate() - days);  // Subtract the days from today
  return today.toISOString().split('T')[0];  // Format as YYYY-MM-DD
}

function displayChart(data) {
  const dates = data.map(item => new Date(item.t * 1000).toLocaleDateString());
  const prices = data.map(item => item.c);  // Closing prices

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
    cell3.innerText = stock.sentiment === 'Bullish' ? 'Bullish' : 'Bearish';  // Replaced emoji with text
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
