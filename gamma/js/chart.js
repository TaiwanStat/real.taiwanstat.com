function chart(data, map, barChart) {
	var width = $(window).width() * 0.9;
	var barHeight = 30;

	var x = d3.scale.linear()
	  .range([0, width]);

	var chart = d3.select("body")
	  .select("#chart")
	  .append("svg")
	    .attr("width", width)
	    .attr("height", barHeight * data.length + 10);

	var max_data = d3.max(data, function(d) {
		if(d["監測值(微西弗/時)"] <= 0.2)
			return d["監測值(微西弗/時)"]; 
	});

	var kx = 1 - (160 / width) - 0.1;
	var offset = 0;
	if($(window).width() < 740) {
		offset = 40;
	}

	x.domain([0, d3.max(data, function(d) { return d["監測值(微西弗/時)"]; })]);

	var bar = chart.selectAll("g")
	    .data(data)
	  .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(0, " + i * barHeight + ")"; });

	bar.append("rect")
		.attr("x", function(d) { return width - x(d["監測值(微西弗/時)"]) * kx - 140 - offset; })
	    .attr("height", barHeight - 1)
	    .attr("width", function(d) { return x(d["監測值(微西弗/時)"]) * kx; })
	    .style("fill", function(d) {
			if(d["監測值(微西弗/時)"] <= 0.2)
				return "steelblue";
			else
				return "red";
		})
		.style("opacity", function(d) { return d["監測值(微西弗/時)"] / max_data; })
	    .on("click", function(d) {
			$("#chart").hide();
			$("#map").show();
			map.setView(new L.LatLng(d.GPS緯度, d.GPS經度), 10);
			barChart();
		});

	bar.append("text")
	    .attr("x", width - 120 - offset + "px")
	    .attr("y", barHeight / 2 - 5)
	    .attr("dy", ".75em")
	    .text(function(d) { return d.監測站;} );

	bar.append("text")
	    .attr("x", width - 40 - offset + "px")
	    .attr("y", barHeight / 2 - 5)
	    .attr("dy", ".75em")
	    .text(function(d) { return d["監測值(微西弗/時)"];} );	 
}
