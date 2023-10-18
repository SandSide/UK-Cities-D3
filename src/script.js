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

    // Set projection
    projection = d3.geoMercator()
        .center([1, 58])
        .scale(2500);

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
        .attr("class", "country")
        .attr('d', path);

}

function displayTowns() {

    // Get number to display
    var numToDisplay = document.getElementById('townRange').value;

    var temp = d3.json("http://34.38.72.236/Circles/Towns/" + numToDisplay)
        .then(data => {

            var svg = d3.select('#map');

            // Remove Old Data
            svg.selectAll('circle.point').remove();
            svg.selectAll('text.point-label').remove();
            d3.selectAll('div.tool-tip').remove();

            var tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tool-tip');

            // Plot points
            var c = svg.selectAll('.point')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', d => Math.max((d.Population / 12000),5))
                .attr('class', 'point')
                .on('mouseover', function (event, d) {

                    d3.select(this).classed('hover', true);
                    tooltip.html("<p>Town Name: " + d.Town + "</p><p>Population: " + d.Population + "</p>")
                        .style('left', projection([d.lng, d.lat])[0] + 50 + 'px')
                        .style('top', projection([d.lng, d.lat])[1] + 'px')
                        .style('opacity', 1);

                })
                .on("mouseout", function () {
                    d3.select(this).classed('hover', false);
                    tooltip.style('opacity', 0);
                })

                c.transition()
                    .duration(1000)
                    .attr('cx', function (d) { return projection([d.lng, d.lat])[0];})
                    .attr('cy', function (d) { return projection([d.lng, d.lat])[1]; })

            // Plot points town name
            svg.selectAll('.point-label')
                .data(data)
                .enter()
                .append('text')
                .attr('class', 'point-label')
                .attr('x', function (d) { return projection([d.lng, d.lat])[0] + 10 })
                .attr('y', function (d) { return projection([d.lng, d.lat])[1] })
                .text(function (d) { return d.Town; })
        });
}

// function calculateRadius(population)
// {

// }

window.onload = function () {
    displayMap();
    displayTowns();
};

