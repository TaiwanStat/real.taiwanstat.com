
var width = 960,
    height = width / 2;

var radius = d3.scale.pow()
    .domain([0, 10])
    .range([0, 75]);

var projection = d3.geo.naturalEarth()
    .translate([width/2, height/2])
    .scale(150/900*width);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule.outline)
    .attr("class", "water")
    .attr("d", path);

svg.append("g")
    .attr("class", "graticule")
  .selectAll("path")
    .data(graticule.lines)
  .enter().append("path")
    .attr("d", path);

var focus = svg.append("text")
    .attr("class", "focus");

d3.json("world-110m.json", function(error, world) {

  svg.insert("path", ".graticule")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a.id !== b.id; }))
      .attr("class", "borders")
      .attr("d", path);

});

d3.json('tectonics.json', function(err, data) {

  svg.insert("path", ".graticule")
      .datum(topojson.object(data, data.objects.tec))
      .attr("class", "tectonic")
      .attr("d", path);

});

d3.json('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson', function(err, data) {
  
  var e_arr = [];

  data.features.forEach(function(date) {
    e_arr.push(Date.now() - date.properties.time);
  })

  var max = d3.max(e_arr)

  var quakes = svg.append("g")
    .attr("class", "quakes")
      .selectAll(".quake")
      .data(data.features)
    .enter().append("g")
        .attr("class", "quake")
        .attr("transform", function(d) {
          return "translate(" + projection(d.geometry.coordinates)[0] + "," + projection(d.geometry.coordinates)[1] + ")";
        })
        .attr("opacity", function(d) {
          var num = 100000 *(max / d.properties.time);
          return ((num - Math.floor(num)))
        })
        .on("mouseover", function() {
          focus.style("opacity", 1);
        })
        .on("mouseout", function() {
          focus.style("opacity", 0);
        })
        .on("mousemove", function(d) {
          var o = projection(d.geometry.coordinates);
          focus
            .text(d.properties.place + ' : ' + d.properties.mag + ' ' + moment(+d.properties.time).calendar())
            .attr("dy", +20)
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + o[0] + "," + o[1] + ")" );
        });

  quakes.append("circle")
        .attr("r", 2)
        .style("fill", function(d) {
          return "rgb(222, 45, 38)"; // color( +d.geometry.coordinates[2] );
        });

  setInterval(function() {

    quakes.append("circle")
        .attr("r", 0)
        .style("stroke", function(d) {
          return "rgb(222, 45, 38)"; // color( +d.geometry.coordinates[2] );
        })
        .style("stroke-width", 2)
      .transition()
        .ease("linear")
        .duration(function(d) { return 125*radius(d.properties.mag); })
        .attr("r", function(d) { return radius(d.properties.mag); })
        .style("stroke-opacity", 0)
        .style("stroke-width", 0)
        .remove();

  }, 1000);

});
