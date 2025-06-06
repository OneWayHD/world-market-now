const chartContainer = document.getElementById("chart-container");
const currencyButtons = document.querySelectorAll(".currency-btn");
let currentCurrency = "USD";
let charts = [];

const exchangeRates = {
  USD: 1,
  JPY: 138,
  EUR: 0.92
};

// 値をランダムに生成（±0.5%変動）
function generateRandomChange(value) {
  const change = value * (Math.random() * 0.01 - 0.005);
  return value + change;
}

// チャートを作成
function createChartCard(indexData) {
  const card = document.createElement("div");
  card.className = "chart-card";

  const title = document.createElement("div");
  title.className = "chart-title";
  title.innerHTML = `<img class="chart-flag" src="${indexData.flag}" /> ${indexData.name}`;
  card.appendChild(title);

  const canvas = document.createElement("canvas");
  card.appendChild(canvas);

  const info = document.createElement("div");
  info.className = "chart-info";
  card.appendChild(info);

  chartContainer.appendChild(card);

  const ctx = canvas.getContext("2d");
  const initialValue = indexData.baseValue;
  const initialData = Array.from({ length: 20 }, (_, i) => generateRandomChange(initialValue));

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array(20).fill(""),
      datasets: [{
        data: initialData,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        borderColor: "gray"
      }]
    },
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });

  charts.push({ chart, info, indexData });
}

// チャートを毎秒更新
function updateCharts() {
  charts.forEach(({ chart, info, indexData }) => {
    const lastValue = chart.data.datasets[0].data.at(-1);
    const newValue = generateRandomChange(lastValue);
    const converted = newValue * exchangeRates[currentCurrency];

    chart.data.datasets[0].data.push(newValue);
    if (chart.data.datasets[0].data.length > 20) {
      chart.data.datasets[0].data.shift();
    }

    // 色変更（赤 or 緑）
    chart.data.datasets[0].borderColor = newValue >= lastValue ? "#22c55e" : "#ef4444";
    chart.update();

    // 表示更新
    const percentChange = ((newValue - indexData.baseValue) / indexData.baseValue * 100).toFixed(2);
    const valueDisplay = converted.toLocaleString(undefined, { maximumFractionDigits: 2 });

    info.innerHTML = `
      <span>${currentCurrency} ${valueDisplay}</span>
      <span class="${newValue >= indexData.baseValue ? 'up' : 'down'}">
        ${percentChange}%
      </span>
    `;
  });
}

// 通貨切替イベント
currencyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currencyButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCurrency = btn.dataset.currency;
    updateCharts();
  });
});

// 初期描画
indices.forEach(createChartCard);
setInterval(updateCharts, 1000);
