// Map params
const width = 600;
const height = 900;
const scale = 2500;

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
    var numToDisplay = document.getElementById('town-range').value;
    var showFancyPoints = document.getElementById('show-fancy-points-switch').checked ? 1 : 0;
    var showDefaultPoints = document.getElementById('show-fancy-points-switch').checked ? 0 : 1;

    var temp = d3.json("http://34.38.72.236/Circles/Towns/" + numToDisplay)
        .then(data => {

            var svg = d3.select('#map');

            // Plot points
            var c = svg.selectAll('.point')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'point')

            c.append('circle')
                .attr('class', 'circle-point')
                .attr('r', d => calculateRadius(d.Population))
                .attr('opacity', showDefaultPoints);

            c.append('image')
                .attr('class', 'town-point')
                .attr('xlink:href', 'assets/city.svg')
                .attr('width', d => calculateRadius(d.Population) * 2)
                .attr('height', d => calculateRadius(d.Population) * 2)
                .attr('x', d => -calculateRadius(d.Population))
                .attr('y', d => -calculateRadius(d.Population))
                .attr('opacity', showFancyPoints);

            c.on('mouseover', function (event, d) {
                d3.select(this).classed('hover', true);
                updateToolTip(d);
            })
            .on('mouseout', function () {
                d3.select(this).classed('hover', false);
                hideToolTip();
            })

            // Animate plot points into view
            c.transition()
                .duration(1000)
                .attr('transform', d => `translate(${mapCoordinatesToXY(d)})`)
                .on('end', () => {
                    plotTownLabels(data);
                });
        });
}

// Plot town name labels
function plotTownLabels(data) {

    var svg = d3.select('#map');

    var showLabels = document.getElementById('show-town-labels-switch').checked ? 1 : 0;

    svg.selectAll('.point-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'point-label')
        .attr('x', function (d) { return mapCoordinatesToXY(d)[0] + 10; })
        .attr('y', function (d) { return mapCoordinatesToXY(d)[1]; })
        .attr('opacity', showLabels)
        .text(function (d) { return d.Town; });
}

// Update map with new towns
function updateMap() {
    d3.selectAll('.point').remove();
    d3.selectAll('.point-label').remove();
    plotTowns();
}

// Calculate radius based on population size
function calculateRadius(population) {
    return Math.max((population / 12000), 8);
}

// Create tool tip
function createToolTip() {
    // Create the tooltip only once
    var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tool-tip');
}

// Update tooltip
function updateToolTip(d) {
    var tooltip = d3.select('.tool-tip');

    tooltip.html(`<p><strong>Town Name</strong>: ${d.Town}</p> 
                    <p><strong>Population</strong>: ${d.Population.toLocaleString()}</p> 
                    <p><strong>Lan</strong>: ${d.lng}</p> 
                    <p><strong>Lat</strong>: ${d.lat}</p>`)
        .style('left', mapCoordinatesToXY(d)[0] + 50 + 'px')
        .style('top', mapCoordinatesToXY(d)[1] + 'px')
        .style('opacity', 1);
}

// Hide tooltip
function hideToolTip() {
    var tooltip = d3.select('.tool-tip');
    tooltip.style('opacity', 0);
    tooltip.style('pointer-events', 'none');
}

// Get position based on screen position
function mapCoordinatesToXY(d) {
    return projection([d.lng, d.lat]);
}

// Update slider label with slider value
function updateSliderLabel() {
    var sliderValue = document.getElementById('town-range').value;
    document.getElementById('town-slider-label').innerHTML = `Town Display Amount: <strong>${sliderValue}</strong>`;
}

// Show/hide town point labels
function toggleTownLabels(state) {
    d3.selectAll('.point-label')
        .attr('opacity', function () {
            return state ? 1 : 0;
        })
}

function toggleFancyTowns(state) {
    d3.selectAll('.circle-point')
        .attr('opacity', function () {
            return !state ? 1 : 0;
        })

    d3.selectAll('.town-point')
        .attr('opacity', function () {
            return state ? 1 : 0;
        })
}

// Add events to webpage elements
function addEvents() {

    // Update map event
    const button = document.getElementById('display-towns');
    button.addEventListener('click', updateMap);

    // Remove town points event
    const removeButton = document.getElementById('remove-towns');
    removeButton.addEventListener('click', function () {
        d3.selectAll('.point').remove();
        d3.selectAll('.point-label').remove();
    });

    // When slider value is changed event
    document.getElementById('town-range').addEventListener('input', function () {
        updateSliderLabel();
    });

    // When show town labels with is changed, toggle town labels
    document.getElementById('show-town-labels-switch').addEventListener('change', function (event) {
        toggleTownLabels(event.target.checked);
    });

    // When show town labels with is changed, toggle town labels
    document.getElementById('show-fancy-points-switch').addEventListener('change', function (event) {
        toggleFancyTowns(event.target.checked);
    });
}

window.onload = function () {
    displayMap();
    createToolTip();
    updateSliderLabel();
    addEvents();
};

