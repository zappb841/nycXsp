const occupancyJSON = `[
  { "city": "New York", "peoplePerM2": 5, "color": "#0088ff" },
  { "city": "São Paulo", "peoplePerM2": 9, "color": "#6bbe45be" }
]`;

const occupancy = JSON.parse(occupancyJSON);

// circle positions inside a 100 x 100 square
const layouts = {
  5: [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
  9: [
    [20, 20], [50, 20], [80, 20],
    [20, 50], [50, 50], [80, 50],
    [20, 80], [50, 80], [80, 80]
  ]
};

const radius = 18;
const container = document.getElementById("occupancy");

occupancy.forEach(item => {
  const circles = layouts[item.peoplePerM2]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${item.color}" />`)
    .join("");

  container.innerHTML += `
    <figure class="occupancy-item">
      <svg viewBox="0 0 100 100" class="occupancy-square">
        <defs>
          <clipPath id="clip-${item.peoplePerM2}">
            <rect width="100" height="100" />
          </clipPath>
        </defs>
        <rect width="100" height="100" fill="#fff" />
        <g clip-path="url(#clip-${item.peoplePerM2})">${circles}</g>
      </svg>
      <figcaption>
        <strong>${item.city}</strong><br>
        ${item.peoplePerM2} people/m²
      </figcaption>
    </figure>
  `;
});