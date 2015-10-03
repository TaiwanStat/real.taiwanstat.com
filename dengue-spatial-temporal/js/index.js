(function() {

  var map;
  var data;
  var threeData;
  var oneData;
  var drugData;
  var bugData;
  var circles = [];
  var latlngs = {};
  var drugCircles = [];
  var markers = [];
  var bugMarkers = [];
  var day = 3;
  var legend = L.control({position: 'bottomleft'});
  var info = L.control();
  var dist800 = 'off';
  var showDrug = false;
  var defaultCircleParams = {
    size: 500,
    color: '#e851c',
    fillColor: '#E24A31',
    showBig: true,
    opacity: 0.1
  };
  var count = 0;


  legend.onAdd = onLegnendAdd;
  info.onAdd = onInfoAdd;
  info.update = onInfoUpdate;


  initMap();
  var myFirebaseRef = new Firebase("https://realtaiwanstat2.firebaseio.com");

  myFirebaseRef.child("dengue-st").limitToLast(1).on("child_added", function(snapshot) {
  //d3.json('./data/data.json', function(data) {
    var data = JSON.parse(snapshot.val());
    threeData = format(data.three);
    oneData = format(data.one);
    var from = new Date(threeData[threeData.length-1].日期);
    var latestDate = new Date();
    latestDate.setDate(from.getDate()+2);
    $('.updateAt').text(latestDate.toLocaleDateString());
    $('.dataUpdateAt').text(from.toLocaleDateString());
    drawCircle(threeData, defaultCircleParams);
  });

  myFirebaseRef.child("dengue-st2").limitToLast(1).on("child_added", function(snapshot) {
  //d3.csv('./data/data.csv', function(data) {
    var raw = snapshot.val();  
    data = d3.csv.parse(raw);
    markers = initMakers(data, {icon: 'circle'});
    $('.total').text(count);
  });

  myFirebaseRef.child("dengue-st4").limitToLast(1).on("child_added", function(snapshot) {
    //d3.csv('./data/drug_data.csv', function(data) {
    var raw = snapshot.val();  
    var data = d3.csv.parse(raw);
    drugData = data;
  });

  d3.csv('./bug_data.csv', function(data) {
    bugData = data;
    bugMarkers = initMakers(bugData, {icon: 'bug'});
  });

  d3.json('./data/tainan.topo.json', function(topoData) {
    for (var key in topoData.objects) {
        geojson = topojson.feature(topoData, topoData.objects[key]);
      }
    topoLayer = L.geoJson(geojson, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map).setZIndex(99);
  });

  function format(arr) {
    var data = [];
    for (var i = 1; i < arr.length; ++ i){
      var tmp = {};
      for (var j = 0; j < arr[i].length; ++ j) {
        tmp[arr[0][j]] = arr[i][j];
      }
      data.push(tmp);
    }
    return data;
  }

  function style(feature) {
    return {
      fillColor: '#D5D5D5',
      weight: 1,
      opacity: 0.3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0
    };
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
    layer.bindPopup(feature.properties.TOWNNAME +
        ' ' + feature.properties.VILLAGENAM);
  }

  function resetHighlight(e) {
    topoLayer.resetStyle(e.target);
  }

  function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.6
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  function initMap() {
    map = new L.Map('map');

    var url = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
    var osm = new L.TileLayer(url, {minZoom: 12,  maxZoom: 19, attribution: attrib});   

    map.setView(new L.LatLng(23, 120.2), 13);
    osm.addTo(map);
    map.on('click', onCircleClick);
    legend.addTo(map);
    info.addTo(map); 
  }

  function drawCircle(data, argvs) {
    latlngs = {};

    data.forEach(function(point) {
      if (latlngs[point.Longitude] && latlngs[point.Longitude][point.Latitude]) {
        return;
      }
      if (argvs.showBig && dist800 == 'on') {
        var bigCircle = L.circle([point.Latitude, point.Longitude], 800, 
          {fillColor: '#DE8552', color: '#CA1F18', opacity: 0.1, clickable: false})
          .addTo(map);
        circles.push(bigCircle);
      }
     
      var circle = L.circle([point.Latitude, point.Longitude], argvs.size,
        {fillColor: argvs.fillColor, color: argvs.color, opacity: argvs.opacity,
          clickable: false})
        .addTo(map);

      if (argvs.showBig) {
        circles.push(circle);
      }
      else {
        drugCircles.push(circle);
      }
      if (!latlngs[point.Longitude])
        latlngs[point.Longitude] = {};
        latlngs[point.Longitude][point.Latitude] = true;
      });
  }

  function initMakers(data, params) {
    var markers = [];
    data.forEach(function(e) {
      var icon;
      var marker;
      var content = '';

      icon =  L.AwesomeMarkers.icon({prefix: 'fa', icon: params.icon, 
        markerColor: e.color});

      marker = L.marker([e.Latitude, e.Longitude], {icon: icon});

      for (var key in e) {
        content += key + '： ' + e[key] + '<br/>';
      }
      if (e.color == 'red') count += 1;

      marker.bindPopup(content);
      markers.push(marker);
    });
    return markers;
  }

  function onCircleClick(e) {
    var nearPoints = getNearBy(e.latlng);
    addPoints(nearPoints);
  }

  function getNearBy(source) {
    var nearPoints = [];
    markers.forEach(function(marker) {
      if (source.distanceTo(marker.getLatLng()) < 500){
        nearPoints.push(marker);
      }
    });
    return nearPoints;
  }

  function addPoints(points) {
    points.forEach(function(marker) {
      marker.addTo(map);   
    });
  }

  function onInfoAdd(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍3天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }
  function onInfoUpdate() {
     this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍' + day  +
       '天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }

  function onLegnendAdd (map) {

      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#F52305', '#436978', '#6F7F23', '#5A386A'];
      var labels = ['3天內', '7天內', '布氏指數<10', '布氏指數>=10'];

      for (var i = 0; i < labels.length; i++) {
          div.innerHTML += '<i style="background:' + color[i] + 
            '"></i>' + labels[i] + '<br/>';
      }

      return div;
  }

  function updateCircle(d, dist) {
    day = d;
    dist800 = dist;
    removeCircles(circles);
    if (day == 3) {
      drawCircle(threeData, defaultCircleParams);
    }
    else if (day == 1){
      drawCircle(oneData, defaultCircleParams);
    }
    info.update();
  }

  function removeCircles(_circles) {
    _circles.forEach(function(circle) {
      map.removeLayer(circle);
    }); 
  }

  function toggleDrugCircle () {
    showDrug = !showDrug;
    if (!showDrug)  
      return removeCircles(drugCircles);
    drawCircle(drugData, {
      color: '#028D9B',
      fillColor: '#028D9B',
      size: 50,
      opacity: 0.5,
      showBig: false
    });
  }
  
  $('.checkbox')
    .checkbox({
      onChange: function() {
        var checkboxs = $(this);
        //var checkboxs = $('.checkbox').find('input');
        checkboxs.each(function(i) {
          var value = checkboxs[i].value;
          var name = checkboxs[i].name;
          if (name == 'drug'){
            return toggleDrugCircle();
          }

          if (checkboxs[i].checked) {
            // day
            if (value == 1 || value == 3) {
              updateCircle(value, dist800); 
            }
            else if (name == 'bug') {
              addPoints(bugMarkers);
            }
            // 800 meter
            else {
              updateCircle(day, value); 
            }
          }
          // off
          else if (value == 'on') {
            updateCircle(day, 'off'); 
          } 
          else if (name == 'bug') {
            removeCircles(bugMarkers);
          }
        });
      }
    });

})();
