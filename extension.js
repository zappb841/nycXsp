const networkJSON = `[
  { "metric": "Extension", "unit": "km", "sp": 110.9, "ny": 400 },
  { "metric": "Number of stations", "unit": "", "sp": 98, "ny": 470 },
  { "metric": "Passengers per day", "unit": "mi", "sp": 4.2, "ny": 4.7 }
]`;

const network = JSON.parse(networkJSON);

function formatMetric(value, unit) {
    const v = String(value).replace(".", ",");
    if (unit === "km") return `${v} km`;
    if (unit === "mi") return `${v} mi`;
    return v;
}

network.forEach((item, i) => {
    new Chart(document.getElementById(`miniChart${i}`), {
        type: "bar",
        data: {
            labels: ["São Paulo", "New York"],
            datasets: [{
                data: [item.sp, item.ny],
                backgroundColor: ["#00933c", "#0039a6"],
                borderRadius: 1000000,
                barThickness: 70
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                legend: { display: false },
                title: { display: true, text: item.metric },
                tooltip: {
                    callbacks: {
                        label: ctx => formatMetric(ctx.parsed.y, item.unit)
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    afterFit: axis => { axis.width = 70; },
                    ticks: { callback: v => formatMetric(v, item.unit) }
                },
                x: { grid: { display: false } }
            }
        }
    });
});