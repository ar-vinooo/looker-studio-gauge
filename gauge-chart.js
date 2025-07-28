const dscc = require('@google/dscc');
const d3 = require('d3');

// Fungsi menggambar gauge chart
const drawGauge = (data) => {
  const container = document.getElementById('viz');
  container.innerHTML = ''; // Bersihkan isi sebelumnya

  // Validasi data
  const rows = data.tables.DEFAULT;
  if (!rows || rows.length === 0 || rows[0][0] == null) {
    container.innerText = 'No data available';
    return;
  }

  const value = Number(rows[0][0]);
  const width = 300;
  const height = 300;
  const minValue = 0;
  const maxValue = 100;
  const radius = width / 2;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Background arc (abu-abu)
  const backgroundArc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius * 0.9)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  svg.append("path")
    .attr("d", backgroundArc)
    .attr("fill", "#eee")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Skala nilai ke derajat
  const scale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([-90, 90]);

  // Tambahkan jarum (dari posisi -90 derajat)
  const needle = svg.append("line")
    .attr("x1", width / 2)
    .attr("y1", height / 2)
    .attr("x2", width / 2)
    .attr("y2", height / 2 - radius * 0.8)
    .attr("stroke", "red")
    .attr("stroke-width", 4)
    .attr("transform", `rotate(${-90}, ${width / 2}, ${height / 2})`);

  // Animasi ke posisi nilai
  needle.transition()
    .duration(1000)
    .attr("transform", `rotate(${scale(value)}, ${width / 2}, ${height / 2})`);

  // Tampilkan nilai di bawah gauge
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "#333")
    .text(`${value}`);
};

// Subscribe ke data dari Looker Studio
dscc.subscribeToData(drawGauge, { transform: dscc.objectTransform });
