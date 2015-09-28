(function () {
	var map;
	var showInfo;
	var showChart = 1;

	window.getLocation = getLocation;
	window.resetView = resetView;
	window.toogleInfo = toogleInfo;

  var myFirebaseRef = new Firebase("https://realtaiwanstat.firebaseio.com");
  myFirebaseRef.child("gamma").limitToLast(1).on("child_added", function(snapshot) {
    var raw = snapshot.val();  
    var data = d3.csv.parse(raw);
    var timeTemp = data[0].時間;
		map = makeMap();

		window.resetView = resetView(map);
		$("#chart").hide();
		$("#resetView").click(function() { resetView(); });
		$("#getLocation").click(function() { getLocation(); });
		$("#toogleInfo").click(function() { toogleInfo(); });
		$("#barChart").click(function() { barChart(); });

		//add map
		for(var d in data) {
			if(data[d].時間 >= timeTemp) {
				$(".updateAt").text("更新時間：" + data[d].時間 + "（每小時更新）");
				timeTmp = data[d].時間;
			}

			addMarker(map, data[d]);
		}

		addPolygon(map, data);
		addInfo(map);

		//add chart
		chart(data, map, barChart);
	});

	function getLocation() {
		if (navigator.geolocation) {
			return navigator.geolocation.getCurrentPosition(setPosition);
		}
	}

	function setPosition(position) {
		map.setView(new L.LatLng(position.coords.latitude, 
			position.coords.longitude), 10);
	}

	function resetView () {
		map.setView(new L.LatLng(24, 121), 7);
	}

	function toogleInfo() {
		if (showInfo) {
			$("#main-info").hide(); 
		}
		else {
			$("#main-info").show(); 
		}
		showInfo = !showInfo;
	}

	function barChart() {
		if(showChart) {
			$("#chart").show();
			$("#map").hide();
			$("#resetView").hide();
			$("#getLocation").hide();
			$("footer").hide();
		}
		else {
			$("#chart").hide();
			$("#map").show();
			$("#resetView").show();
			$("#getLocation").show();
			$("footer").show();
		}
		showChart = !showChart;
	}
})();
