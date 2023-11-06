let projection;

// Display map
function displayMap() {

    var mapUK = d3.json("https://raw.githubusercontent.com/SandSide/UK-Cities-D3/development/src/assets/united-kingdom-detailed-boundary_1061.geojson");

    // Load of map data then process
    Promise.all([mapUK])
        .then(data => {
            drawMap(data[0]);
        })
        .catch(err => {
            console.error(err);
        });
}

// Draw the map
function drawMap(map) {

    // Map params
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

// Plot towns onto the map
function plotTowns() {

    // Get number to display
    var numToDisplay = document.getElementById('townRange').value;

    var temp = d3.json("http://34.38.72.236/Circles/Towns/" + numToDisplay)
        .then(data => {

            // Remove Old Data
            clearData();

            var svg = d3.select('#map');

            // Create tooltip
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

            // Animate plot points into view
            c.transition()
                .duration(1000)
                .attr('cx', function (d) { return mapCoordinatesToXY(d)[0] })
                .attr('cy', function (d) { return mapCoordinatesToXY(d)[1] })

        });
}

// Clear old data
function clearData() {
    var svg = d3.select('#map');
    svg.selectAll('circle.point').remove();
    svg.selectAll('text.point-label').remove();
    d3.selectAll('div.tool-tip').remove();
}

// Calculate radius based on population size
function calculateRadius(population) {
    return Math.max((population / 12000), 8);
}

// Update tooltip
function updateToolTip(d) {
    var tooltip = d3.select('.tool-tip')

    tooltip.html(`<p><strong>Town Name</strong>: ${d.Town} </p> <p><strong>Population</strong>: ${d.Population}</p>`)
        .style('left', mapCoordinatesToXY(d)[0] + 50 + 'px')
        .style('top', mapCoordinatesToXY(d)[1] + 'px')
        .style('opacity', 1);
}

// Get position based on screen position
function mapCoordinatesToXY(d) {
    return projection([d.lng, d.lat]);
}

function updateSliderLabel(){
    var sliderValue = document.getElementById('townRange').value;
    document.getElementById('town-slider-label').innerHTML = `Town Display Amount: <strong>${sliderValue}</strong>`;
}

window.onload = function () {
    displayMap();
    plotTowns();
    updateSliderLabel();
};

