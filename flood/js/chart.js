function makeChart(map, site, marker) {
	var barHeight = 80;
	var svg = d3.select("#chart")
	  .append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%");

	var chart = svg.selectAll("g")
	    .data(site)
	  .enter().append("g")
	    .attr("class", function(d) {
			return d.year + "_" + d.month + "_" + d.date;
	    })
	    .attr("transform", function(d, i) {
			d.y =  i * barHeight + 10;
			return "translate(0, " + (i * barHeight + 10) + ")";
	    });

	//add timeline
	chart.append("line")
	    .attr("x1", 120 + "px")
	    .attr("y1", function(d, i) {
			if(i == 0) {
				return "10px";
			}
			else {
				return "0px";
			}
	     })
	    .attr("x2", 120 + "px")
	    .attr("y2", barHeight + "px")
	    .attr("stroke-linecap", "round")
	    .style("stroke", "black")
	    .style("stroke-width", "3px");
	chart.append("circle")
	    .attr("cx", 120 + "px")
	    .attr("cy", barHeight / 2 + 2)
	    .attr("r", "5px")
	    .style("fill", "black")
	    .style("cursor", "pointer")
	    .on("click", function(d) {
			marker[d.townId].openPopup();
			return setPosition(map, [d.lat, d.lon]);
	    });

	var date = new Date();
	//test today
	//site[0].year = date.getFullYear();
	//site[0].month = date.getMonth() + 1;
	//site[0].date = date.getDate();

	//add time
	var tempYear;
	var tempMonth;
	var tempDate;
	chart.append("text")
	    .attr("x", function(d) {
			if(d.year == date.getFullYear() && d.month ==  date.getMonth() + 1 && d.date == date.getDate()) {
				return "70px";
			}
			else {
				return "18px";
			}
		})
	    .attr("y", barHeight / 2 - 10)
	    .style("fill", "#A8A8A8")
	    .style("font-size", "15")
	    .text(function(d) {
			if(d.year == date.getFullYear() && d.month ==  date.getMonth() + 1 && d.date == date.getDate()) {
				if(d.year == tempYear && d.month == tempMonth && d.date == tempDate) {
					return "";
				}
				else {
					tempYear = d.year;
					tempMonth = d.month;
					tempDate = d.date;
					return "今日";
				}
			}
			else {
				if(d.year == tempYear && d.month == tempMonth && d.date == tempDate) {
					return "";
				}
				else {
					tempYear = d.year;
					tempMonth = d.month;
					tempDate = d.date;
					return d.year + "/" + d.month + "/" + d.date + " ";
				}
			}
		});
	//add time
	chart.append("text")
	    .attr("x", "60px")
	    .attr("y", barHeight / 2 + 8 + "px")
	    .style("fill", "black")
	    .style("font-weight", "bold")
	    .style("font-size", "15")
	    .text(function(d) {
			return d.hour + ":" + d.min;
	    });

	//add position
	chart.append("text")
	    .attr("x", "140px")
	    .attr("y", barHeight / 2 + 8 + "px")
	    .style("fill", "#black")
	    .style("font-weight", "bold")
	    .style("font-size", "15")
	    .style("cursor", "pointer")
	    .text(function(d) {
			return d.countyName + " " + d.areaName;
	    })
	    .on("click", function(d) {
			marker[d.townId].openPopup();
			return setPosition(map, [d.lat, d.lon]);
		});

	chart.append("text")
	    .attr("x", "140px")
	    .attr("y", barHeight / 2 + 25 + "px")
	    .style("fill", function(d) { return (d.level == "一級") ? "#CC0000" : "#EDA92C"; })
	    .style("font-weight", "bold")
	    .style("font-size", "10")
	    .style("cursor", "pointer")
	    .text(function(d) {
			return "警戒等級： " + d.level + "警戒";
	    })
	    .on("click", function(d) {
			marker[d.townId].openPopup();
			return setPosition(map, [d.lat, d.lon]);
		});
};

function setPosition(map, position) {
	map.setView(new L.LatLng(position[0], position[1]), 10);
}
