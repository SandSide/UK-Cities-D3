let projection;

function displayMap() {

    var map = d3.json("assets/united-kingdom-detailed-boundary_1061.geojson");

    Promise.all([map])
        .then(data => {
            drawMap(data[0]);
        })
        .catch(err => {
            console.error(err);
        });
}

function drawMap(map) {
    const width = 600;
    const height = 900;
    const scale = 2500;

    // Set projection
    projection = d3.geoMercator()
        .center([1, 58])
        .scale(scale);

    // Create map container
    var svg = d3.select('.map-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'map');

    var g = svg.append('g');

    let path = d3.geoPath().projection(projection);

    // Draw map
    g.selectAll('path')
        .data(map.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path);

}

function displayTowns() {

    // Get number to display
    var numToDisplay = document.getElementById('townRange').value;

    var temp = d3.json("http://34.38.72.236/Circles/Towns/" + numToDisplay)
        .then(data => {

            // Remove Old Data
            clearData();

            var svg = d3.select('#map');

            var tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tool-tip');

            // Plot points
            var c = svg.selectAll('.point')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', d => calculateRadius(d.Population))
                .attr('class', 'point')
                .on('mouseover', function (event, d) {
                    d3.select(this).classed('hover', true);
                    updateToolTip(d);
                })
                .on('mouseout', function () {
                    d3.select(this).classed('hover', false);
                    tooltip.style('opacity', 0);
                })

            c.transition()
                .duration(1000)
                .attr('cx', function (d) { return getXY(d)[0] })
                .attr('cy', function (d) { return getXY(d)[1] })

            // Plot points town name
            svg.selectAll('.point-label')
                .data(data)
                .enter()
                .append('text')
                .attr('class', 'point-label')
                .attr('x', function (d) { return getXY(d)[0] + 10 })
                .attr('y', function (d) { return getXY(d)[1] })
                .text(function (d) { return d.Town; })
        });
}

function clearData() {
    var svg = d3.select('#map');
    svg.selectAll('circle.point').remove();
    svg.selectAll('text.point-label').remove();
    d3.selectAll('div.tool-tip').remove();
}

function calculateRadius(population) {
    return Math.max((population / 12000), 8);
}

function updateToolTip(d) {
    var tooltip = d3.select('.tool-tip')

    tooltip.html("<p>Town Name: " + d.Town + "</p><p>Population: " + d.Population + "</p>")
        .style('left', getXY(d)[0] + 50 + 'px')
        .style('top', getXY(d)[1] + 'px')
        .style('opacity', 1);
}

function getXY(d){
    return projection([d.lng, d.lat]);
}

window.onload = function () {
    displayMap();
    displayTowns();
};

