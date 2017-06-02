(function() {
	var map;
	var layer = {};
	var position = {
		pTop: 0,
		pBottom: 0,
	};
	var barHeight = 80;

	window.getLocation = getLocation;
	window.resetView = resetView;

  make();
	function make() {
	  var FEED_URL = './data.xml';
	  var data = { feed: { entries: [] } };
	  $.get(FEED_URL, function (rssdata) {
	      $(rssdata).find("entry").each(function () {
          var el = $(this);
          data.feed.entries.push({
            id: el.find("id").text(),
            title: el.find("title").text(),
            publishedDate: el.find("updated").text(),
            content: el.find("summary").text()
          })
        });

				d3.json("data/town.json", function(border) {
					$("#resetView").click(function() { resetView(); });
					$("#getLocation").click(function() { getLocation(); });

					//Processing of data
					sort(data.feed.entries);
					var output = compare(data, border.objects.town.geometries);
					var point = {};
					deleteBorder(output, border.objects.town);

					// add map
					map = makeMap();
					addBorder(map, border, point, layer);
					addCoordinates(output, point);
					var marker = addSite(map, output);

					//add chart
					makeChart(map, output, marker);

					//add toggle
					position.pTop = barHeight * (output.length - 1) + 10;
					position.pBottom = 10;
					makeToggle(output, position, barHeight, marker, layer, map);

					//top, bottom
					$("#up").click(function() { up(); });
					$("#down").click(function() { down(); });
				});
     });
	};

	function down() {
		if(position.pTop > $("#chart").height() - barHeight) {
			d3.select("#chart")
			  .select("svg")
			  .selectAll("g")
			    .transition()
			    .duration(500)
			    .attr("transform", function(d) { d.y = d.y - barHeight; return "translate(0, " + d.y + ")"; });
			position.pTop = position.pTop - barHeight;
			position.pBottom = position.pBottom - barHeight;
		}
	};

	function up() {
		if(position.pBottom < 0) {
			d3.select("#chart")
			  .select("svg")
			  .selectAll("g")
			    .transition()
			    .duration(500)
			    .attr("transform", function(d) { d.y = d.y + barHeight; return "translate(0, " + d.y + ")"; });
			position.pTop = position.pTop + barHeight;
			position.pBottom = position.pBottom + barHeight;
		}
	}

	function addCoordinates(output, point) {
		for(var i = 0; i < output.length; i++) {
			var temp = point[ output[i].townId ];
			var lon = 0;
			var lat = 0;

			for(var j = 0; j < temp.length; j++) {
				lon = lon + temp[j][0];
				lat = lat + temp[j][1];
			}
			output[i].lon = lon / temp.length;
			output[i].lat = lat / temp.length;
		}
	};

	function deleteBorder(output, borderData) {
		var temp = [];
		for(var i = 0; i < borderData.geometries.length; i++) {
			for(var j = 0; j < output.length; j++) {
				if(borderData.geometries[i].properties.countyname == output[j].countyName
				  && borderData.geometries[i].properties.townname == output[j].areaName) {
					borderData.geometries[i].properties.level = output[j].level;
					temp.push(borderData.geometries[i]);
				}
			}
		}

		delete borderData.geometries;
		borderData.geometries = temp;
	}

	function sort(data) {
		for(var i = 0; i < data.length; i++) {
			for(var j = i + 1; j < data.length; j++) {
				var time_i = new Date(data[i].publishedDate);
				var time_j = new Date(data[j].publishedDate);

				if(time_j.getFullYear() > time_i.getFullYear()) {
					change(data, i, j);
				}
				else if(time_j.getFullYear() == time_i.getFullYear() && time_j.getMonth() > time_i.getMonth()) {
					change(data, i, j);
				}
				else if(time_j.getFullYear() == time_i.getFullYear() && time_j.getMonth() == time_i.getMonth()
					  && time_j.getDate() > time_i.getDate()) {
					change(data, i, j);
				}
				else if(time_j.getFullYear() == time_i.getFullYear() && time_j.getMonth() == time_i.getMonth()
					  && time_j.getDate() == time_i.getDate() && time_j.getHours() > time_i.getHours()) {
					change(data, i, j);
				}
				else if(time_j.getFullYear() == time_i.getFullYear() && time_j.getMonth() == time_i.getMonth()
					  && time_j.getDate() == time_i.getDate() && time_j.getHours() == time_i.getHours()
					  && time_j.getMinutes() > time_i.getMinutes()) {
					change(data, i, j);
				}
			}
		}
	}

	function change(data, i, j) {
		var temp = data[i];
		data[i] = data[j];
		data[j] = temp;
	}

	function compare(data, info) {
		var output = [];

		for(var i = 0; i < data.feed.entries.length; i++) {
			var temp = normalize(data.feed.entries[i], info);

			var check = false;
			for(var j = 0; j < output.length; j++) {
				if(temp.countyName == output[j].countyName && temp.areaName == output[j].areaName || temp.townId == "") {
					check = true;
					continue;
				}
			}

			if(check == false) {
				output.push(temp);
			}
		}

		return output;
	};

	function normalize(data, info) {
		// solve bug of ("台" and "臺")
		var area = ["鄉", "鎮", "市", "區"];
		var temp = data.content;
		var tempCounty = (temp[5] == "台" ? "臺" : temp[5]) + temp[6] + temp[7];

		// find area
		var tempArea = "";
		var count = 0;
		var check = false;
		for(var j = 8; j < temp.length; j++) {
			for(var k = 0; k < area.length; k++) {
				if(temp[j] == area[k]) {
					check = true;
				}
			}

			tempArea = tempArea + (temp[j] == "台" ? "臺" : temp[j]);
			if(check == true) {
				count = j + 1;
				break;
			}
		}

		// find level
		var tempLevel = "";
		for(var j = count + 2; j < count + 4; j++) {
			tempLevel = tempLevel + temp[j];
		}
		count = count + 6;

		//find station
		var tempStation = "";
		for(count = count + 1; temp[count] != "站"; count++) {
			tempStation = tempStation + temp[count];
		}
		count = count + 1;

		//find rain
		var tempRain = "";
		for(; temp[count] != ")"; count++) {
			tempRain = tempRain + temp[count];
		}

		//find text
		var tempText = "";
		for(var j = count + 3; j < temp.length; j++) {
			tempText = tempText + temp[j];
		}

		//find id
		var tempId = "";
		for(var j = 0; j < info.length; j++) {
			if(tempCounty == info[j].properties.countyname && tempArea == info[j].properties.townname) {
				tempId = info[j].properties.townid;
			}
		}

		//find time
		var tempTime = new Date(data.publishedDate);

		//normalized data
		var output = {
			townId: tempId,
			countyName: tempCounty,
			areaName: tempArea,
			level: tempLevel,
			station: tempStation,
			rain: tempRain,
			text: tempText,
			year: tempTime.getFullYear(),
			month: d3.format("02")(tempTime.getMonth() + 1),
			date: d3.format("02")(tempTime.getDate()),
			hour: d3.format("02")(tempTime.getHours()),
			min: d3.format("02")(tempTime.getMinutes()),
		};

		return output;
	};

	function getLocation() {
		if (navigator.geolocation) {
			return navigator.geolocation.getCurrentPosition(setPosition);
		}
	};

	function setPosition(position) {
		map.setView(new L.LatLng(position.coords.latitude,
			position.coords.longitude), 10);
	};

	function resetView () {
		map.setView(new L.LatLng(24, 121), 7);
	};
})();
