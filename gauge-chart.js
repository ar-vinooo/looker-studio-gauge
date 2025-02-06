const dscc = require('@google/dscc');
const d3 = require('d3');

// Function untuk menggambar gauge chart
const drawGauge = (data) => {
    document.getElementById('viz').innerHTML = ''; // Bersihkan sebelum update

    const width = 300, height = 300;
    const minValue = 0, maxValue = 100;
    const value = data.tables.DEFAULT[0].value; // Ambil data dari Looker Studio

    const svg = d3.select("#viz")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const radius = width / 2;

    // Buat arc sebagai background gauge
    const arc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.9)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

    svg.append("path")
        .attr("d", arc)
        .attr("fill", "#ddd")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Skala untuk jarum
    const scale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([-90, 90]);

    const needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2)
        .attr("y2", height / 2 - radius * 0.8)
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("transform", `rotate(${scale(value)}, ${width / 2}, ${height / 2})`);

    // Animasi jarum
    needle.transition()
        .duration(1000)
        .attr("transform", `rotate(${scale(value)}, ${width / 2}, ${height / 2})`);

    // Tampilkan nilai di tengah
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "#333")
        .text(value);
};

// Subscribe ke data Looker Studio
dscc.subscribeToData(drawGauge, { transform: dscc.objectTransform });
