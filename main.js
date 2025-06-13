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

// Chart.js カスタムプラグイン（前日終値ラインとティック線の間を塗る）
Chart.register({
  id: 'customFillPlugin',
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { top, bottom },
      scales: { x, y }
    } = chart;

    chart.data.datasets.forEach((dataset, index) => {
      const meta = chart.getDatasetMeta(index);
      if (!meta || !meta.data || meta.data.length < 2) return;

      const base = dataset.baseValue;
      const yBase = y.getPixelForValue(base);
      ctx.save();

      for (let i = 0; i < meta.data.length - 1; i++) {
        const p0 = meta.data[i];
        const p1 = meta.data[i + 1];
        const x0 = p0.x;
        const x1 = p1.x;
        const y0 = p0.y;
        const y1 = p1.y;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1, yBase);
        ctx.lineTo(x0, yBase);
        ctx.closePath();

        const above = y0 <= yBase && y1 <= yBase;
        const below = y0 > yBase && y1 > yBase;
        ctx.fillStyle = above
          ? 'rgba(34,197,94,0.1)' // 薄緑
          : below
          ? 'rgba(239,68,68,0.1)' // 薄赤
          : 'rgba(0,0,0,0)';
        ctx.fill();
      }

      ctx.restore();
    });
  }
});

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
        fill: false,
        pointRadius: 0,
        borderColor: "#3b82f6", // 青線固定
        baseValue: indexData.baseValue // カスタム塗り用
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
              label: { enabled: false }
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: {
          display: true,
          ticks: { font: { size: 10 } }
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
