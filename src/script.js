function drawMap() {
    const width = 800;
    const height = 600;

    var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

    const path = d3.geoPath(projection);

    const g = svg.append('g');

    d3.json('https://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json')
        .then(data => {

            const countries = topojson.feature(data, data.objects.eer);

            g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'country').attr('d', path)
                .style("fill", d => {

                    if (d.properties.EER13NM == "North East") return "green";
                    else return "red";
                })
        }).catch(err => {
            throw err;
        });
}

function drawMap3() {

    const width = 2000;
    const height = 6000;

    let projection = d3.geoNaturalEarth1();
    let path = d3.geoPath().projection(projection);
    //let svg = d3.select("#worldMap").append('svg').append("g");
    var svg = d3.select('body').append('svg').attr('width', width).attr('height', height).append("g");

    d3.json('https://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json')
        .then(data => {
            const uk = topojson.feature(data, data.objects.eer);

            svg.selectAll('path')
                .data(uk.features)
                .enter()
                .append('path')
                .attr("stroke","#313131")
                .attr("stroke-width",1)
                .attr("fill", "#535353")
                .attr("d", path);
        });
}

function drawMap4(){
    const width = 2000;
    const height = 2000;

    let projection = d3.geoEquirectangular()
                        .center([-10,60])
                        .scale(20000);


    let path = d3.geoPath().projection(projection);

    var svg = d3.select('.map-container')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('margin', '0 auto');
                // .attr('id', "uk-map");
        
    var g = svg.append('g');

    d3.json("assets/united-kingdom-detailed-boundary_1061.geojson")
        .then(data => {
            const uk = data; topojson.feature(data, data.features);

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

window.onload = drawMap4;
