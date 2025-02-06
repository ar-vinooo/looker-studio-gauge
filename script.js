const dscc = require('@google/dscc');
const d3 = require('d3');

const drawGauge = (data) => {
    d3.select("svg").remove(); // Hapus elemen sebelumnya untuk update data

    const width = 400, height = 400;
    const minValue = 0, maxValue = 100;
    const value = data.tables.DEFAULT[0].value;

    const svg = d3.select("#viz")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const radius = width / 2;
    const arc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.9)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

    svg.append("path")
        .attr("d", arc)
        .attr("fill", "#ddd")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const scale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([-Math.PI / 2, Math.PI / 2]);

    const needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2)
        .attr("y2", height / 2 - radius * 0.8)
        .attr("stroke", "red")
        .attr("stroke-width", 4);

    needle.transition()
        .duration(1000)
        .attr("transform", `rotate(${(scale(value) * 180) / Math.PI}, ${width / 2}, ${height / 2})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "#333")
        .text(value);
};

dscc.subscribeToData(drawGauge, { transform: dscc.objectTransform });
