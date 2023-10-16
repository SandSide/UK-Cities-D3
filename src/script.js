function drawMap4() {
    const width = 700;
    const height = 900;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', "map")
        .style('margin', '0 auto');

    var g = svg.append('g');

    d3.json("assets/united-kingdom-detailed-boundary_1061.geojson")
        .then(data => {
            const uk = data; topojson.feature(data, data.features);

            let projection = d3.geoEquirectangular()
                .center([-1.3, 58])

                .scale(2000)

            let path = d3.geoPath().projection(projection);

            g.selectAll('path')
                .data(uk.features)
                .enter()
                .append('path')
                .attr("class", "country")
                .attr("d", path);

        }).catch(err => {
            console.error(err);
        });
}

function placePoints() {

    var svg = d3.select("#map");

    d3.json("http://34.38.72.236/Circles/Towns/10")
        .then(data => {

            var cities = svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr("cx", d => d.lng)
                .attr("cy", d => d.lat)
                .attr("r", 5);
        }).catch(err => {
            console.error(err);
        });
}

function displayMap() {

    var map = d3.json("assets/united-kingdom-detailed-boundary_1061.geojson");
    var cities = d3.json("http://34.38.72.236/Circles/Towns/50");

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

    let projection = d3.geoMercator()
        .center([1, 58])
        .scale(2500);

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', "map");

    var g = svg.append('g');

    let path = d3.geoPath().projection(projection);

    g.selectAll('path')
        .data(map.features)
        .enter()
        .append('path')
        .attr("class", "country")
        .attr("d", path);

    var c = svg.selectAll('.point')
        .data(cities)
        .enter()
        .append('circle')
        .attr("cx", function (d) { return projection([d.lng, d.lat])[0]; })
        .attr("cy", function (d) { return projection([d.lng, d.lat])[1]; })
        .attr("r", 5)
        .attr("fill", "red");

    svg.selectAll(".point-label")
        .data(cities)
        .enter()
        .append("text")
        .attr("class", "point-label")
        .attr("x", function(d) { return projection([d.lng, d.lat])[0] + 10; })
        .attr("y", function(d) { return projection([d.lng, d.lat])[1]; })
        .text(function(d) { return d.Town; });
}


window.onload = function () {
    displayMap();
};

