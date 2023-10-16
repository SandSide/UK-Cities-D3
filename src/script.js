// function drawMap() {
//     const width = 800;
//     const height = 600;

//     var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

//     const path = d3.geoPath(projection);

//     const g = svg.append('g');

//     d3.json('https://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json')
//         .then(data => {

//             const countries = topojson.feature(data, data.objects.eer);

//             g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'country').attr('d', path)
//                 .style("fill", d => {

//                     if (d.properties.EER13NM == "North East") return "green";
//                     else return "red";
//                 })
//         }).catch(err => {
//             throw err;
//         });
// }

// function drawMap3() {

//     const width = 2000;
//     const height = 6000;

//     let projection = d3.geoNaturalEarth1();
//     let path = d3.geoPath().projection(projection);
//     //let svg = d3.select("#worldMap").append('svg').append("g");
//     var svg = d3.select('body').append('svg').attr('width', width).attr('height', height).append("g");

//     d3.json('https://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json')
//         .then(data => {
//             const uk = topojson.feature(data, data.objects.eer);

//             svg.selectAll('path')
//                 .data(uk.features)
//                 .enter()
//                 .append('path')
//                 .attr("stroke","#313131")
//                 .attr("stroke-width",1)
//                 .attr("fill", "#535353")
//                 .attr("d", path);
//         });
// }

function drawMap4(){
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
            .center([-1.3,58])
      
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

function placePoints(){

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

function test(){
    const width = 600;
    const height = 900;

    // var map = d3.json("assets/united-kingdom-detailed-boundary_1061.geojson");
    // var cities =   d3.json("http://34.38.72.236/Circles/Towns/10");

    let projection = d3.geoMercator()
    .center([1,58])
    .scale(2500);

    var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('id', "map");
        
    var g = svg.append('g');

    d3.json("assets/united-kingdom-detailed-boundary_1061.geojson")
        .then(data => {
            const uk = data;

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


    d3.json("http://34.38.72.236/Circles/Towns/10")
    .then(data => {

        var cities = svg.selectAll('.point')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", function(d) { return projection([d.lng, d.lat])[0]; })
            .attr("cy", function(d) { return projection([d.lng, d.lat])[1]; })
            .attr("r", 5)
            .attr("fill", "red");

            // svg.selectAll(".point-label")
            //     .data(data)
            //     .enter()
            //     .append("text")
            //     .attr("class", "point-label")
            //     .attr("x", function(d) { return projection([d.lng, d.lat])[0] + 10; })
            //     .attr("y", function(d) { return projection([d.lng, d.lat])[1]; })
            //     .text(function(d) { return d.Town; });

    }).catch(err => {
        console.error(err);
    });
}


window.onload = function(){
    test();
    // drawMap4();
    // placePoints();
};

