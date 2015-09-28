function makeToggle(output, position, barHeight, marker, layer, map) {
	var check = true;

	var svg = d3.select("#toggle")
	  .append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%"); 

	svg.append("rect")
	    .attr("width", "80%")
	    .attr("height", "60%")
	    .attr("x", "10%")
	    .attr("y", "20%")
	    .attr("rx", "15px")
	    .attr("ry", "15px")
	    .attr("fill", "white")
	    .attr("stroke-width", 3)
	    .attr("stroke", "#ADADAD");

	svg.append("circle")
	    .attr("cx", "30%")
	    .attr("cy", "50%")
	    .attr("r", "25%")
	    .style("fill", "white")
	    .style("cursor", "pointer")
	    .attr("stroke-width", 3)
	    .attr("stroke", "#ADADAD")
	    .on("click", function() {
			var button = d3.select("#toggle")
			  .select("svg")
			  .select("circle")
			    .transition()
			    .duration(500);

			if(check) {
				button.attr("cx", "70%");
				changeToToday(output, position, barHeight, marker, layer);
			}
			else {
				button.attr("cx", "30%");
				changeToAll(output, position, barHeight, marker, layer);
			}

			check = !check;
			resetView(map);
	    });
};

function changeToToday(output, position, barHeight, marker, layer) {
	position.pTop = barHeight * (output.length - 1) + 10;
	position.pBottom = 10;

	for(var i = 0; i < output.length; i++) {
		var time = output[i].year + "_" + output[i].month + "_" + output[i].date;
		var date = new Date();

		if(output[i].year == date.getFullYear() && output[i].month == date.getMonth() + 1 && output[i].date == date.getDate()) {
			continue;
		}

		$("." + time).hide();
		position.pTop = position.pTop - barHeight;
		marker[ output[i].townId ].setOpacity(0);
		layer[ output[i].townId ].setStyle({
			fillOpacity: 0,
			opacity: 0,
		});
	}

	origin(barHeight);
};

function changeToAll(output, position, barHeight, marker, layer) {
	for(var i = 0; i < output.length; i++) {
		var time = output[i].year + "_" + output[i].month + "_" + output[i].date;
		$("." + time).show();
		marker[ output[i].townId ].setOpacity(1);
		layer[ output[i].townId ].setStyle({
			fillOpacity: 0.5,
			opacity: 0.5,
		});
	}

	position.pTop = barHeight * (output.length - 1) + 10;
	position.pBottom = 10;
	origin(barHeight);
};

function origin(barHeight) {
	d3.select("#chart")
	  .select("svg")
	  .selectAll("g")
	    .transition()
	    .duration(500)
	    .attr("transform", function(d, i) {
			d.y =  i * barHeight + 10;
			return "translate(0, " + (i * barHeight + 10) + ")";
	    });
};

function resetView(map) {
	map.setView(new L.LatLng(24, 121), 7);
};
