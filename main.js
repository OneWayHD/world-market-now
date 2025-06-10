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
function generateRandomChange(base) {
  const change = base * (Math.random() * 0.01 - 0.005);
  return base + change;
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
  const initialData = Array.from({ length: 20 }, () => generateRandomChange(initialValue));

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array(20).fill(""),
      datasets: [{
        data: initialData,
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        borderColor: "#3b82f6", // ✅ 青色で固定
        segment: {
          backgroundColor: ctx => {
            const y0 = ctx.p0.parsed.y;
            const y1 = ctx.p1.parsed.y;
            const base = indexData.baseValue;
            const above = y0 >= base && y1 >= base;
            const below = y0 < base && y1 < base;
            if (above) return 'rgba(34,197,94,0.1)';  // ✅ 薄緑（上）
            if (below) return 'rgba(239,68,68,0.1)';  // ✅ 薄赤（下）
            return 'rgba(0,0,0,0)';
          }
        }
      }]
    },
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            line: {
              type: 'line',
              yMin: indexData.baseValue,
              yMax: indexData.baseValue,
              borderColor: '#9ca3af',
              borderWidth: 1,
              borderDash: [6, 6],
              label: {
                enabled: false
              }
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: {
          display: true,
          ticks: {
            font: { size: 10 }
          }
        }
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
    const previousClose = indexData.baseValue;
    const converted = newValue * exchangeRates[currentCurrency];

    chart.data.datasets[0].data.push(newValue);
    if (chart.data.datasets[0].data.length > 20) {
      chart.data.datasets[0].data.shift();
    }

    // ✅ 線は常に青、塗り分けはsegmentで処理
    chart.data.datasets[0].borderColor = "#3b82f6";
    chart.options.plugins.annotation.annotations.line.yMin = previousClose;
    chart.options.plugins.annotation.annotations.line.yMax = previousClose;
    chart.update();

    const percentChange = ((newValue - previousClose) / previousClose * 100).toFixed(2);
    const valueDisplay = converted.toLocaleString(undefined, { maximumFractionDigits: 2 });

    info.innerHTML = `
      <span>${currentCurrency} ${valueDisplay}</span>
      <span class="${newValue >= previousClose ? 'up' : 'down'}">
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