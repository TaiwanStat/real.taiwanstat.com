var graph_margin = {top: 20, right: 0, bottom: 30, left: 30},
	graph_height = 600 - graph_margin.top - graph_margin.bottom,
	graph_width = 700 - graph_margin.left - graph_margin.right;

var graph = d3.select("#graph").append("svg")
	.attr("width", graph_width + graph_margin.left + graph_margin.right)
	.attr("height", graph_height + graph_margin.top + graph_margin.bottom)
	.append("g")
	.attr("transform", "translate(" + graph_margin.left + ", " + graph_margin.top + ")");

var projection = d3.geo.mercator()
	.center([120.379531, 23.008567])
	.scale(55000)
	.translate([graph_width/2, graph_height/1.35]);

var path = d3.geo.path()
	.projection(projection);

var chart_margin = {top: 30, right: 10, bottom: 30, left: 50},
	chart_height = 550 - chart_margin.top - chart_margin.bottom,
	chart_width = 500 - chart_margin.left - chart_margin.right;

var chart = d3.select("#chart").append("svg")
	.attr("width", chart_width + chart_margin.left + chart_margin.right)
	.attr("height", chart_height + chart_margin.top + chart_margin.bottom)
	.append("g")
	.attr("transform", "translate(" + chart_margin.left + ", " + chart_margin.top + ")");

var xScale = d3.scale.linear().range([0, chart_width]);
var yScale = d3.scale.ordinal().rangeRoundBands([0, chart_height], 0.1);
var xAxis = d3.svg.axis().scale(xScale).orient("top");
var yAxis = d3.svg.axis().scale(yScale).orient("left");
var rectColorScale = d3.scale.pow().exponent(1/4).range(["#B8BF03", "#C22B2B"]);
var mapColorScale = d3.scale.pow().exponent(1/4).range(["#B8BF03", "#C22B2B"]);
var parser = d3.time.format("%Y/%m/%e").parse;
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.html(function(d, i) { return "<span>" + d.properties.TOWNNAME + "</span>"; });

var chart_tip = d3.tip()
	.attr('class', 'd3-tip')
	.html(function(d, i) {
		if (isNaN(d.length)) {
			return "<span>" + d + "</span>";
		}
		else {
			return "<span>" + d.length + "</span>";
		}
	});

var dragTrack = 1100;
var incident_count = 0;
var myFirebaseRef = new Firebase("https://realtaiwanstat.firebaseio.com");
d3.json('../../data/taiwan-map/twTown1982.topo.json', function(err, topo_data) {
    myFirebaseRef.child("dengue-fever").limitToLast(1).on("child_added", function(snapshot) {
      var text = snapshot.val();  
      var data = d3.csv.parse(text);
 
		var topo = topojson.feature(topo_data, topo_data.objects["twTown1982.geo"]);
		var topomesh = topojson.mesh(topo_data, topo_data.objects["twTown1982.geo"], function(a, b){
			return a !== b;
		});

		topo.features.forEach(function(d, i) {
			if(d.properties.TOWNID === "1605" || d.properties.TOWNID === "1603" ||  d.properties.TOWNID=== "1000128") {
				topo.features.splice(i, 1);
			}
		})

		var cityTowns = [];
		for (var i = 0; i < topo.features.length; i++) {
			if (topo.features[i].properties.COUNTYNAME == "台南市") {
				cityTowns.push(topo.features[i]);
			}
		}
		cityTowns.splice(0, 1);
		cityTowns.splice(cityTowns.length - 1, 1);

		dataByArea = organize(data);

		function organize(data) {
			var townNames = [];
			d3.map(cityTowns, function(d) { townNames.push(d.properties.TOWNNAME); });
			var dataArray = [];
			for (var i = 0; i < townNames.length; i++) {
				var result = [];
				for (var m = 0; m < data.length; m++) {
					if (data[m].區別 == townNames[i]) {
						result.push(data[m]);
					}
				}
				if (result.length != 0) {
					dataArray.push(result);
				}
				else {}
			}
			return dataArray;
		}

		var dataArray = [];
			for (var i = 0; i < dataByArea.length; i++) {
				if (dataByArea[i].length != 0) {
					dataArray.push(dataByArea[i]);
				} else {}
			}


		var dateScaleMin = new Date(2015, 0, 1);
		var dateScaleMax = d3.max(dataArray, function(district) {
					return d3.max(district, function(town) { return parser(town.日期); }); });
 		dateScaleMax = new Date(2015, dateScaleMax.getMonth() + 1, 1);

		var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
		var months = monthList.slice(dateScaleMin.getMonth(), dateScaleMax.getMonth() + 1 );
		console.log(months);
		var dateScale = d3.scale.linear().domain([dateScaleMin, dateScaleMax]).range([0, dragTrack]);
		console.log(dateScale.domain());
		var scaleSVG = d3.select("#yearScale").append("svg").attr("height", 20).attr("width", dragTrack + 100);
		var t1 = new Date(2015, 0, 1),
		    t2 = new Date(dateScaleMax);

		var dateScale = d3.time.scale()
		    .domain([t1, t2])
		    .range([0, dragTrack]);

		var x = dateScale.copy().clamp(true);

		var dateAxis = d3.svg.axis()
			.scale(dateScale)
			.orient("top");

		scaleSVG.append("g").attr("class", "dateAxis").attr("transform", "translate(" + 40 + ", " + 20 + ")").call(dateAxis);

		var dispatch = d3.dispatch("sliderChange");

		var slider = d3.select(".slider").style("width", dragTrack);
		var sliderTray = slider.append("div").attr("class", "slider-tray");
		var sliderHandle = slider.append("div").attr("class", "slider-handle");
		sliderHandle.append("div").attr("class", "slider-handle-icon");

		// slider
		slider.call(d3.behavior.drag()
			.on("dragstart", function() {
				var date = d3.mouse(sliderTray.node())[0];
				dispatch.sliderChange(x.invert(date));
				d3.event.sourceEvent.preventDefault();
				changeIndex(date);
			})
			.on("drag", function() {
				var date = d3.mouse(sliderTray.node())[0];
				dispatch.sliderChange(x.invert(date));
				changeIndex(date);
			}));

		dispatch.on("sliderChange.slider", function(value) {
		  sliderHandle.style("left", x(value) + "px")
		});

		$(document).ready(function() {
			sliderHandle.style("left", 1100 + "px")
		});
		graph.call(tip);
		mapColorScale.domain([0,
			d3.max(dataArray, function(district) { return district.length; })]);

		graph.selectAll('path.town')
			.data(cityTowns)
			.enter()
			.append('path')
			.attr('class', function(d) { return d.properties.TOWNNAME; })
			.attr('d', path)
			.style("stroke", "rgba(255,255,255,0.5)")
			.attr("stroke-width", "2px")
			.attr("fill", "#38A032")
			.attr("opacity", 0.8)
			.on('mouseover', tip.show)
  			.on('mouseout', tip.hide);

		graph.append('path')
			.attr('class', 'boundary')
			.datum(topomesh)
			.attr('d', path)
			.style('fill', 'none')
			.style('stroke', "rgba(255,255,255,0.5)")
			.style('stroke-width', '2px');

		var counta = graph.append("text").attr("class", "counta").attr("x", 450).attr("y", 20).text("動畫累積件數: 7506");

		for (var i = 0; i < dataByArea.length; i++) {
			if (dataByArea[i].length != 0) {
				$("." + dataByArea[i][0].區別).attr("fill", mapColorScale(dataByArea[i].length));
			}
		}

		drawPoints(dataByArea);

		function drawPoints(dataByArea) {
			var townGroups = graph.selectAll("g.townGroup")
				.data(dataByArea)
				.enter().append("g")
				.attr("class", function(d) {
					if (d.length != 0) {
						return "townGroup" + " " + d[0].區別;
					}
					else {
						return "townGroup";
					}
				});

			townGroups.selectAll(".occPoint")
				.data(function(d) { return d; })
				.enter().append("circle")
				.attr("class", function(d) { return "occPoint" + " " + d.日期; })
				.attr("r", 3)
				.attr("transform", function(d) { return "translate(" + projection([d.Longitude, d.Latitude]) + ")"; })
				.attr("fill", "red")
				.attr("visibility", "true");
		}

		dataByArea.sort(function(a, b) { return b.length - a.length; });
		var top15 = dataByArea.slice(0, 16);

		drawChart(top15);

		function drawChart(top15) {
			var x_max = 0;
			top15.forEach(function(d) {
				if(d.length > x_max)
					x_max = d.length;
			})

			rectColorScale.domain([0, +x_max]);
			xScale.domain([0, +x_max]);
			yScale.domain(top15.map(function(d) { return d[0].區別; }));

			chart.append("g").attr("class", "xAxis").call(xAxis);
			chart.append("g").attr("class", "yAxis").call(yAxis);

			chart.call(chart_tip);
			console.log(top15);

			chart.selectAll(".dataRect")
				.data(top15)
				.enter().append("rect")
				.attr("class", "dataRect")
				.attr("x", 0).attr("y", function(d, i) { return yScale(d[0].區別);})
				.attr("width", function(d, i) { return xScale(d.length); }).attr("height", yScale.rangeBand())
				.attr("fill", function(d) { return rectColorScale(d.length); })
				.on("mouseover", chart_tip.show)
				.on("mouseout", chart_tip.hide);
		}

		var index = 0;
		var set_switch_year;
		var counta = 8;

		function set_loop() {
			clearTimeout(set_switch_year);
			set_switch_year = setInterval(function() {
				console.log(months.length)
				var unit = 1100/ (months.length - 1)
				index += unit;
				counta++;
				changeIndex(index);
				console.log(index);
				sliderHandle.style("left", index + "px");
				if (counta >= months.length - 1) {
					clearTimeout(set_switch_year);
				}
				else {}
			}, 1000);
		}

		document.getElementById("start").onclick = function() {
			if (counta == months.length - 1) {
		      	index = 0; //prevent for NaN
		      	counta = 0;
	   		}
			set_loop();
		}

		document.getElementById("stop").onclick = function() {
			clearTimeout(set_switch_year);
		}

		document.getElementById("restart").onclick = function() {
			index = 0;
			counta = 0;
			changeIndex(index);
			clearTimeout(set_switch_year);
			sliderHandle.style("left", "0px");
			set_loop();
		}

		function changeIndex(index) {

			d3.selectAll(".occPoint")
			.transition()
			.duration(1000)
			.attr("visibility", function(d) {
				if (dateScale(parser(d.日期)) < index) {
					return "true";
				}
				else {
					return "hidden";
				}
			});

			var incident_count = 0;

			for (var i = 0; i < dataByArea.length; i++) {
				for (var m = 0; m < dataByArea[i].length; m++) {
					if (dateScale(parser(dataByArea[i][m].日期)) < index) {
						incident_count++;
					}
				}
			}

			var itemList = [];
			for (var i = 0; i < top15.length; i++) {
				var result = [];
				for (var m = 0; m < top15[i].length; m++) {
					if (dateScale(parser(top15[i][m].日期)) < index) {
						result.push(top15[i][m]);
					}
				}
				if (typeof(result) != 'undefined') {
					itemList.push(result.length);
				}
				else itemList.push(0);
			}

			d3.selectAll(".dataRect")
				.data(itemList)
				.transition()
				.duration(1000)
				.attr("width", function(d) { return xScale(d); });
				// .on("mouseover", chart_tip.show)
				// .on("mouseout", chart_tip.hide);

			d3.select(".counta").transition().duration(1000).text("動畫累積件數: " + incident_count);

		}

	});
});
