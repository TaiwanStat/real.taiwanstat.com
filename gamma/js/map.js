function makeMap() {
	var map = L.map("map")
	  .setView(new L.LatLng(24, 121), 7);

	L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		maxZoom: 18,
		attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
		id: "hsuting.cc8f0fcb",
		accessToken: "pk.eyJ1IjoiaHN1dGluZyIsImEiOiJRajF4Y0hjIn0.9UDt8uw_fxEX791Styd-lA"
	}).addTo(map);

	return map;
};

function addMarker(map, site) {
	var icon;
	var check = (site["監測值(微西弗/時)"] >= 0.2) ? 1 : 0;

	if(check == 1) {
		icon = L.icon({
			iconUrl: "image/red.png",
			iconSize: [25, 41],
			iconAnchor: [13, 42],
			popupAnchor: [0, -35]
		});
	}
	else {
		icon = L.icon({
			iconUrl: "/marker-icon.png",
			iconSize: [25, 41],
			iconAnchor: [13, 42],
			popupAnchor: [0, -35]
		});
	}

	L.marker([ site.GPS緯度, site.GPS經度 ], {
		icon: icon,
		opscity: 0.9
	  })
	  .addTo(map)
	  .bindPopup("<b>監測站： </b>" + site.監測站 + "<br>"
		+ "<b>監測值： </b>" + site["監測值(微西弗/時)"] + "（微西弗／時）" + "<br>"
		+ "<font style = 'color: " + ((check==1)?"red":"blue") + "'><b>" + ((check==1)?"超標":"未超標") + "</b></font>"
	  );
};

function addPolygon(map, data) {
	var point = [];
	for(var i in data) {
		var latlng = [data[i].GPS緯度, data[i].GPS經度];
		point.push(latlng);
	}

	var position = d3.geom.voronoi(point);
	for(var i in position) {
		//solve bug
		if(data[i].監測站 == "澳底") {
			for(var j in position[i]) {
				if(position[i][j][1] > 122) {
					position[i][j] = [25.26656249999999, 122.3];
				}
			}
		}
		if(data[i].監測站 == "龍門") {
			position[i].splice(1, 0, [25.26656249999999, 122.3]);
		}

		L.polygon(position[i], {
		  color: "black",
		  fillOpacity: "0",
		  opacity: "0.2",
		  weight: "1px"
		}).addTo(map);
	}

	$(".leaflet-clickable").on("mouseover", function() {
		$(this).animate({
			fillOpacity: 0.4
		}, 0);
	});
	$(".leaflet-clickable").on("mouseout", function() {
		$(this).animate({
			fillOpacity: 0
		}, 0);
	});
}

function addInfo(map) {
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
		this._div.innerHTML = "<h4 class=\"\">格狀區塊：表示該區域內最近的測站</h4>";
		return this._div;
	};

	info.addTo(map);
}
