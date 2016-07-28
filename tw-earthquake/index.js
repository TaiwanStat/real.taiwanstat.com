var w = 800,
  h = 600;

var projection = d3.geo.mercator()
  .center([120.979531, 23.978567])
  .scale(10000);


var radius = d3.scale.pow()
  .domain([0, 10])
  .range([0, 500]);

var color = d3.scale.quantize()
  .domain([0, 1])
  .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select('#content')
  .append('svg')
  .attr('width', '80%')
  .attr('height', h )
  .attr('viewBox', "0 0 1000 800")
  .attr('preserveAspectRatio', 'xMidYMid');

var focus = svg.append("text")
  .attr("class", "focus");

d3.json("/data/2.5_month.geojson", function(error, earth_data) {

  var e_arr = [];
  var t_eq = [];

  earth_data.features.forEach(function(date) {
    e_arr.push(date.properties.time);
    if(date.properties.place.indexOf("Taiwan") !== -1) {
      // is taiwan
      t_eq.push(date);
      $(".tbody").append('<tr eq_id="' + date.properties.code + '"><td>' +  moment(+date.properties.time).calendar() + '</td><td>' + date.properties.place + '</td><td>' + date.properties.mag + '</td></tr>')
    }
  })

  $('.tbody tr').hover(
    function() {
      var eq_id = $(this).attr('eq_id');
      $(this).css('color', '#FFA500')
      $('#' + eq_id).css('fill', '#FFA500')
    }, function() {
      var eq_id = $(this).attr('eq_id');
      $(this).css('color', '#000')
      $('#' + eq_id).css('fill', "rgb(222, 45, 38)")
    }
  )

  var max = d3.max(e_arr)

  // loading Taiwan county 2010
  d3.json('/data/taiwan-map/twCounty2010merge.topo.json', function(err, data) {

    var topo = topojson.feature(data, data.objects["layer1"]);

    var topomesh = topojson.mesh(data, data.objects["layer1"], function(a, b){
      return a !== b;
    });

    svg.selectAll('path.village')
      .data(topo.features)
      .enter()
      .append('path')
      .attr('id', function(d) { return d.properties.COUNTYSN; })
      .attr('d', path)
      .attr("class", "land")

    svg.append('path')
      .attr('class', "borders")
      .datum(topomesh)
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', "rgba(255,255,255,0.5)")
      .style('stroke-width', '2px');

    var quakes = svg.append("g")
        .attr("class", "quakes")
          .selectAll(".quake")
          .data(t_eq)
        .enter().append("g")
          .attr("class", "quake")
          .attr("transform", function(d) {
            return "translate(" + projection(d.geometry.coordinates)[0] + "," + projection(d.geometry.coordinates)[1] + ")";
          })
          .attr("opacity", function(d) {
            var num =(d.properties.time / max);
            return (num)
          })


      quakes.append("circle")
            .attr("r", 10)
            .style("fill", function(d) {
              return "rgb(222, 45, 38)"; // color( +d.geometry.coordinates[2] );
            })
            .attr('id', function(d) {
              return d.properties.code
            });

      setInterval(function() {

        quakes.append("circle")
            .attr("r", 0)
            .style("stroke", function(d) {
              return "rgb(222, 45, 38)"; // color( +d.geometry.coordinates[2] );
            })
            .style("stroke-width", 4)
          .transition()
            .ease("linear")
            .duration(function(d) { return 40*radius(d.properties.mag); })
            .attr("r", function(d) { return radius(d.properties.mag) -10; })
            .style("stroke-opacity", 0)
            .style("stroke-width", 0)
            .remove();

      }, 2000);
  })

})
