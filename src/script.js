let projection;


function displayMap() {

    var map = d3.json("assets/united-kingdom-detailed-boundary_1061.geojson");
    var cities = d3.json("http://34.38.72.236/Circles/Towns/25");

    Promise.all([map, cities])
        .then(data => {
            drawMap(data[0], data[1]);
        })
        .catch(err => {
            console.error(err);
        });
}

function drawMap(map, cities) {
    const width = 600;
    const height = 900;

    // var amountToDispaly = 

    projection = d3.geoMercator()
        .center([1, 58])
        .scale(2500);

    var svg = d3.select('.map-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'map');

    var g = svg.append('g');

    let path = d3.geoPath().projection(projection);

    g.selectAll('path')
        .data(map.features)
        .enter()
        .append('path')
        .attr("class", "country")
        .attr('d', path);

    // var c = svg.selectAll('.point')
    //     .data(cities)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', function (d) { return projection([d.lng, d.lat])[0]; })
    //     .attr('cy', function (d) { return projection([d.lng, d.lat])[1]; })
    //     .attr('r', d => d.Population/12000)
    //     .attr('class', 'point')
    //     .on('mouseover', function(){
    //         d3.select(this).classed('hover', true);
    //     })
    //     .on("mouseout", function(){
    //         d3.select(this).classed('hover', false);
    //     })

    // svg.selectAll('.point-label')
    //     .data(cities)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'point-label')
    //     .attr('x', function(d) { return projection([d.lng, d.lat])[0] + 10})
    //     .attr('y', function(d) { return projection([d.lng, d.lat])[1] })
    //     .text(function(d) { return d.Town; })
    //     .on("mouseover", function(d){

    //     });
}

function displayTowns() {

    var numToDisplay = document.getElementById('townRange').value;

    var temp = d3.json("http://34.38.72.236/Circles/Towns/" + numToDisplay)
        .then(data => {

            var svg = d3.select('#map');

            // Remove Old Data
            svg.selectAll("circle.point").remove();
            svg.selectAll("text.point-label").remove();

            var c = svg.selectAll('.point')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', function (d) { return projection([d.lng, d.lat])[0]; })
                .attr('cy', function (d) { return projection([d.lng, d.lat])[1]; })
                .attr('r', d => d.Population / 12000)
                .attr('class', 'point')
                .on('mouseover', function () {
                    d3.select(this).classed('hover', true);
                })
                .on("mouseout", function () {
                    d3.select(this).classed('hover', false);
                })

            svg.selectAll('.point-label')
                .data(data)
                .enter()
                .append('text')
                .attr('class', 'point-label')
                .attr('x', function (d) { return projection([d.lng, d.lat])[0] + 10 })
                .attr('y', function (d) { return projection([d.lng, d.lat])[1] })
                .text(function (d) { return d.Town; })
                .on("mouseover", function (d) {

                });
        });
}

window.onload = function () {
    displayMap();
};

