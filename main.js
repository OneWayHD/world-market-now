// ✅ main.js：チャート並び替え＋オーバーレイ実装（カテゴリ別メッセージ付き）

document.addEventListener("DOMContentLoaded", () => {
  const chartContainer = document.getElementById("chart-container");
  const currencySelect = document.getElementById("currency");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const modal = document.getElementById("chart-modal");
  const modalCanvas = document.getElementById("modal-canvas");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");

  let currentCurrency = "USD";
  let currentCategory = "indices";
  let charts = [];
  let modalChart = null;
  let modalChartData = [];
  let modalChartUpdater = null;

  const exchangeRates = {
    USD: 1,
    JPY: 138,
    EUR: 0.92
  };

  function generateRandomChange(base) {
    const change = base * (Math.random() * 0.01 - 0.005);
    return base + change;
  }

  Chart.register({
    id: 'customFillPlugin',
    beforeDatasetsDraw(chart) {
      const { ctx, scales: { y } } = chart;
      chart.data.datasets.forEach((dataset) => {
        const meta = chart.getDatasetMeta(0);
        if (!meta || meta.data.length < 2) return;
        const yBase = y.getPixelForValue(dataset.baseValue);
        ctx.save();
        for (let i = 0; i < meta.data.length - 1; i++) {
          const p0 = meta.data[i];
          const p1 = meta.data[i + 1];
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p1.x, yBase);
          ctx.lineTo(p0.x, yBase);
          ctx.closePath();
          const above = p0.y <= yBase && p1.y <= yBase;
          const below = p0.y > yBase && p1.y > yBase;
          ctx.fillStyle = above ? 'rgba(34,197,94,0.1)' : below ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0)';
          ctx.fill();
        }
        ctx.restore();
      });
    }
  });

  function createChartCard(indexData) {
    const card = document.createElement("div");
    card.className = "chart-card";

    const handle = document.createElement("div");
    handle.className = "chart-drag-handle";
    handle.innerHTML = "&#9776;";
    card.appendChild(handle);

    const title = document.createElement("div");
    title.className = "chart-title";
    title.innerHTML = `<img class="chart-flag" src="${indexData.flag}" /> ${indexData.name}`;
    card.appendChild(title);

    const canvas = document.createElement("canvas");
    card.appendChild(canvas);

    const info = document.createElement("div");
    info.className = "chart-info";
    card.appendChild(info);

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("chart-drag-handle")) return;
      showChartInModal(indexData);
    });

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
          borderColor: "#3b82f6",
          baseValue: indexData.baseValue
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
            position: 'right',
            ticks: { font: { size: 10 } }
          }
        }
      }
    });

    charts.push({ chart, info, indexData });
  }

  function updateCharts() {
    charts.forEach(({ chart, info, indexData }) => {
      const lastValue = chart.data.datasets[0].data.at(-1);
      const newValue = generateRandomChange(lastValue);
      const previousClose = indexData.baseValue;
      const converted = newValue * exchangeRates[currentCurrency];

      chart.data.datasets[0].data.push(newValue);
      if (chart.data.datasets[0].data.length > 20) chart.data.datasets[0].data.shift();
      chart.update();

      const percentChange = ((newValue - previousClose) / previousClose * 100).toFixed(2);
      const valueDisplay = converted.toLocaleString(undefined, { maximumFractionDigits: 2 });
      info.innerHTML = `
        <span>${currentCurrency} ${valueDisplay}</span>
        <span class="${newValue >= previousClose ? 'up' : 'down'}">${percentChange}%</span>
      `;
    });
  }

  function addCategoryOverlay() {
    const overlayMessage = {
      indices: `This category is currently sample data only.\nOfficial real-time data will be available soon.\nPlease join discussions on the Board while you wait.`,
      forex: `Real-time data will be launched after traffic increases.\nPlease stay active in the Board section meanwhile.`,
      crypto: `Real-time data will be launched after traffic increases.\nPlease stay active in the Board section meanwhile.`
    }[currentCategory];

    if (!overlayMessage) return;

    const cards = document.querySelectorAll(".chart-card");
    cards.forEach(card => {
      const overlay = document.createElement("div");
      overlay.className = "chart-overlay";
      overlay.textContent = overlayMessage;
      card.appendChild(overlay);
    });
  }

  function loadChartsByCategory() {
    chartContainer.innerHTML = "";
    charts = [];

    const dataMap = { indices, forex, crypto };
    let dataList = dataMap[currentCategory] || [];

    const savedOrder = localStorage.getItem(`wmn_order_${currentCategory}`);
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      dataList = order.map(name => dataList.find(d => d.name === name)).filter(Boolean);
    }

    dataList.forEach(createChartCard);

    Sortable.create(chartContainer, {
      handle: ".chart-drag-handle",
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: () => {
        const cards = chartContainer.querySelectorAll(".chart-card .chart-title");
        const newOrder = Array.from(cards).map(el => el.textContent.trim());
        localStorage.setItem(`wmn_order_${currentCategory}`, JSON.stringify(newOrder));
      }
    });

    addCategoryOverlay();
  }

  function showChartInModal(indexData) {
    if (modalChart) modalChart.destroy();
    if (modalChartUpdater) clearInterval(modalChartUpdater);

    modal.style.display = "flex";
    modalTitle.innerHTML = `<img class="chart-flag" src="${indexData.flag}" style="width:20px; height:14px; margin-right:6px;"> ${indexData.name}`;

    const ctx = modalCanvas.getContext("2d");
    const initialValue = indexData.baseValue;
    modalChartData = Array.from({ length: 40 }, () => generateRandomChange(initialValue));

    modalChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array(40).fill(""),
        datasets: [{
          data: modalChartData,
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          borderColor: "#3b82f6",
          baseValue: indexData.baseValue
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
            position: 'right',
            ticks: { font: { size: 12 } }
          }
        }
      }
    });

    modalChartUpdater = setInterval(() => {
      const last = modalChartData.at(-1);
      const next = generateRandomChange(last);
      modalChartData.push(next);
      if (modalChartData.length > 40) modalChartData.shift();
      modalChart.data.datasets[0].data = modalChartData;
      modalChart.update();
    }, 1000);
  }

  function closeModal() {
    modal.style.display = "none";
    if (modalChart) modalChart.destroy();
    if (modalChartUpdater) clearInterval(modalChartUpdater);
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      loadChartsByCategory();
    });
  });

  currencySelect.addEventListener("change", () => {
    currentCurrency = currencySelect.value;
    updateCharts();
  });

  categoryButtons.forEach(b => {
    if (b.dataset.category === currentCategory) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  // ✅ preventDefaultで文字選択抑制
  document.addEventListener("touchstart", function (e) {
    if (e.target.classList.contains("chart-drag-handle")) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("chart-drag-handle")) {
      e.preventDefault();
    }
  });

  loadChartsByCategory();
  setInterval(updateCharts, 1000);
});