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

function addBorder(map, border, point, Layer) {
	L.TopoJSON = L.GeoJSON.extend({
		addData: function(border) {
			if (border.type === "Topology") {
				for (key in border.objects) {
					geojson = topojson.feature(border, border.objects[key]);
					L.GeoJSON.prototype.addData.call(this, geojson);
				}
			}
			else {
				L.GeoJSON.prototype.addData.call(this, border);
			}
		}
	});

	var topoLayer = new L.TopoJSON();
	topoLayer.addData(border);
	topoLayer.addTo(map);
	topoLayer.eachLayer(function (layer) { Layer[layer.feature.properties.townid] = layer; return handleLayer(layer, point); });
};

function handleLayer(layer, point) {
	point[layer.feature.properties.townid] = layer.feature.geometry.coordinates[0];
	layer.setStyle({
		color: (layer.feature.properties.level == "一級") ? "#CC0000" : "#CC6600",
		fillOpacity: 0.5,
		clickable: false,
	});
};

function addSite(map, output) {
	temp = {};
	for(var i = 0; i < output.length; i++) {
		temp[output[i].townId] = L.marker([output[i].lat, output[i].lon])
		  .addTo(map)
		  .bindPopup("<b>發布時間： </b>" + output[i].year + "." + output[i].month + "." + output[i].date + " " + output[i].hour + ":" + output[i].min + "<br>" +
				"<b>區域： </b>" + output[i].countyName + " " + output[i].areaName + "<br>" +
				"<b>監測站： </b>" + output[i].station + "站" + "<br>" +
				"<b>監測值： </b>" + output[i].rain + "<br>" +
				"<font style = 'color: " + ((output[i].level == "一級") ? "#CC0000" : "#EDA92C") + "'><b>警戒等級： </b>" + output[i].level + "</font><br>" +
				"<b>注意事項： </b><br>" + output[i].text
		  );
	}
	return temp;
}
