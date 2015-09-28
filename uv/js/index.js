(function() {

  module.exports = d3Initailze;
  var svg;
  var projection;
  var path;
  var cells;
  var osm;
  var bounds;
  var twgeo = null;
  var data = null;
  var g;
  
  function getData() {
    queue()
   //     .defer(d3.json, './data/twCounty2010merge.topo.json')
        .await(ready);
  }

  function d3Initailze(map, siteData) {
    osm = map;
    data = siteData;
    updateMap();
    map.on('viewreset moveend', function(e) {
      if (e && e.type == 'viewreset') {
        d3.select('#overlay').remove();
      }
      setTimeout(function(){
        updateMap();
      }, 0);
    });
  }

  var selectPoint = function() {
    d3.selectAll('.selected').classed('selected', false);

    var cell = d3.select(this),
        point = cell.datum();

    lastSelectedPoint = point;
    cell.classed('selected', true);
  }

  function updateMap() {

    d3.select('#overlay').remove();

    bounds = osm.getBounds();
    var topLeft = osm.latLngToLayerPoint(bounds.getNorthWest());
    var bottomRight = osm.latLngToLayerPoint(bounds.getSouthEast());
    var existing = d3.set();
    var drawLimit = bounds.pad(0.4);

    projection = d3.geo.mercator()
        .center([122.079531, 23.978567])
        .scale(10200);

    path = d3.geo.path()
        .projection(projection);

    svg = d3.select(osm.getPanes().overlayPane).append("svg")
      .attr('id', 'overlay')
      .attr("class", "leaflet-zoom-hide")
      .style("width", osm.getSize().x + 'px')
      .style("height", osm.getSize().y + 'px')
      .style("margin-left", topLeft.x + "px")
      .style("margin-top", topLeft.y + "px");

    g = svg.append("g")
      .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")");
    if (twgeo) {
      addPonits();
    }
    else {
      getData();
    }
  }

  function ready(error, res1) {
    twgeo = res1;
    addPonits();
  }

  function addPonits () {
    
    var positions = [];
    data.forEach(function(d) {
      var latlng = new L.LatLng(+d.TWD97Lat, +d.TWD97Lon);
      point = osm.latLngToLayerPoint(latlng);
      positions.push(point);
    });

    var svgPoints = g.attr("class", "points")
      .selectAll("g")
        .data(positions)
      .enter().append("g")
        .attr("class", "point");

    var voronoi = d3.geom.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    voronoi(positions).forEach(function(v) { v.point.cell = v; });
    var buildPathFromPoint = function(point) {
        return "M" + point.cell.join("L") + "Z";
    }

    svgPoints.append("path")
      .attr("class", "point-cell")
      .on('click', selectPoint)
      .attr("d", buildPathFromPoint);

  }

})();
