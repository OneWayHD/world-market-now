// 通貨レート（USDを基準に換算率を定義。毎時更新でも差し替え可能）
const exchangeRates = {
  USD: 1,
  JPY: 140.25,
  EUR: 0.91
};

// ↓↓↓ ここが変更点！↓↓↓
// ここで latestData（data.js から読み込み）を受け取って使う
const chartData = latestData;

// 初期通貨
let selectedCurrency = "USD";

// 通貨で価格換算
function convertPrices(prices, fromCurrency, toCurrency) {
  const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  return prices.map(price => Math.round(price * rate * 100) / 100);
}

// チャート描画
function renderCharts() {
  const container = document.getElementById("chart-container");
  container.innerHTML = ""; // 初期化

  chartData.forEach(stock => {
    const card = document.createElement("div");
    card.className = "chart-card";

    const title = document.createElement("div");
    title.className = "chart-title";
    title.textContent = `${stock.label} (${selectedCurrency})`;
    card.appendChild(title);

    const canvas = document.createElement("canvas");
    card.appendChild(canvas);
    container.appendChild(card);

    const converted = convertPrices(stock.prices, stock.currency, selectedCurrency);

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu"],
        datasets: [{
          label: stock.label,
          data: converted,
          borderColor: "#0ea5e9",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  });
}

// 通貨タブイベント
document.querySelectorAll("#currency-tabs .tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#currency-tabs .tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCurrency = btn.dataset.currency;
    renderCharts();
  });
});

// 初期表示
renderCharts();
