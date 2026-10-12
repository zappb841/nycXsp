const transitJSON = `[
  { "year": 2000, "spSubwayFare": 1.40, "spMinWage": 0.68, "nySubwayFare": 1.50, "nyMinWage": 5.15 },
  { "year": 2003, "spSubwayFare": 1.90, "spMinWage": 1.09, "nySubwayFare": 2.00, "nyMinWage": 5.15 },
  { "year": 2006, "spSubwayFare": 2.30, "spMinWage": 1.59, "nySubwayFare": 2.00, "nyMinWage": 6.75 },
  { "year": 2009, "spSubwayFare": 2.55, "spMinWage": 2.11, "nySubwayFare": 2.00, "nyMinWage": 7.25 },
  { "year": 2011, "spSubwayFare": 3.00, "spMinWage": 2.47, "nySubwayFare": 2.25, "nyMinWage": 7.25 },
  { "year": 2014, "spSubwayFare": 3.50, "spMinWage": 3.29, "nySubwayFare": 2.50, "nyMinWage": 8.00 },
  { "year": 2017, "spSubwayFare": 4.00, "spMinWage": 4.25, "nySubwayFare": 2.75, "nyMinWage": 13.00 },
  { "year": 2020, "spSubwayFare": 4.40, "spMinWage": 4.75, "nySubwayFare": 2.90, "nyMinWage": 15.00 },
  { "year": 2023, "spSubwayFare": 5.00, "spMinWage": 6.00, "nySubwayFare": 2.90, "nyMinWage": 15.00 },
  { "year": 2026, "spSubwayFare": 5.40, "spMinWage": 7.37, "nySubwayFare": 3.00, "nyMinWage": 17.00 }
]`;

const data = JSON.parse(transitJSON);

Chart.defaults.font.family = "'Open Sans', sans-serif";

const chart = new Chart(document.getElementById("fareChart"), {
  type: "line",
  data: {
    labels: data.map(d => d.year),
    datasets: [
      {
        label: "SP Subway (R$)",
        data: data.map(d => d.spSubwayFare),
        city: "sp",
        kind: "fare",
        borderColor: "#00933c",
        backgroundColor: "#00933c",
        yAxisID: "yBRL",
        tension: 0.2
      },
      {
        label: "SP Minimum Wage (R$/hour)",
        data: data.map(d => d.spMinWage),
        city: "sp",
        kind: "wage",
        borderColor: "#6cbe45",
        backgroundColor: "#6cbe45",
        yAxisID: "yBRL",
        tension: 0.2
      },
      {
        label: "NYC Subway (USD)",
        data: data.map(d => d.nySubwayFare),
        city: "nyc",
        kind: "fare",
        borderColor: "#0039a6",
        backgroundColor: "#0039a6",
        yAxisID: "yUSD",
        tension: 0.2
      },
      {
        label: "NYC Minimum Wage (USD/hour)",
        data: data.map(d => d.nyMinWage),
        city: "nyc",
        kind: "wage",
        borderColor: "#2398ff",
        backgroundColor: "#2398ff",
        yAxisID: "yUSD",
        tension: 0.2
      }
    ]
  },
  options: {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 40
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const v = ctx.parsed.y.toFixed(2);
            const isWage = ctx.dataset.label.includes("Wage");
            if (ctx.dataset.yAxisID === "yBRL") {
              return `${ctx.dataset.label.split(" (")[0]}: R$${v.replace(".", ",")}${isWage ? "/hour" : ""}`;
            }
            return `${ctx.dataset.label.split(" (")[0]}: USD $${v}${isWage ? "/hour" : ""}`;
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      yBRL: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: { display: true, text: "São Paulo (R$)" },
        ticks: { callback: v => `R$${v}` }
      },
      yUSD: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        title: { display: true, text: "New York (USD)" },
        ticks: { callback: v => `$${v}` },
        grid: { drawOnChartArea: false }
      }
    }
  }
});

// --- Toggle logic ---

const view = { city: "both", kind: "both" };

function updateChart() {
  chart.data.datasets.forEach(ds => {
    const cityOk = view.city === "both" || ds.city === view.city;
    const kindOk = view.kind === "both" || ds.kind === view.kind;
    ds.hidden = !(cityOk && kindOk);
  });

  chart.options.scales.yBRL.display = view.city !== "nyc";
  chart.options.scales.yUSD.display = view.city !== "sp";

  chart.update();
}

function setupToggle(groupId, key) {
  const buttons = document.querySelectorAll(`#${groupId} button`);
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      view[key] = btn.dataset.value;
      updateChart();
    });
  });
}

setupToggle("cityToggle", "city");
setupToggle("typeToggle", "kind");