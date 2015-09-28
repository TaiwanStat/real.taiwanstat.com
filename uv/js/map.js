(function() {

  d3Initialize = require('./index');

  var map;
  var geojson; 
  var info = L.control();
  var showInfo;

  var geoData = null;
  var yellowIcon = L.icon({
    iconUrl: './images/yellow.png',
    iconSize:     [35, 45], // size of the icon
    iconAnchor:   [17, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });


  window.getLocation = getLocation;
  window.resetView = resetView;
  window.toogleInfo = toogleInfo;

  $( document ).ready(function() {
    initMap();
    var myFirebaseRef = new Firebase("https://realtaiwanstat2.firebaseio.com");
    myFirebaseRef.child("uv").limitToLast(1).on("child_added", function(snapshot) {
    var raw = snapshot.val();  
    var data = d3.csv.parse(raw);
      d3.json('./data/locations.json', function(sites) {
        addSiteToMap(data, sites);
      });
    });
  });


  function addSiteToMap (data, sites) {
    $('.updateAt').text('更新時間：' + data[0].PublishTime + '（每小時更新）');

    for (var i in data) {

      var degree = getDegree(data[i].UVI);
      var icon;
      
      if (degree.color == 'yellow') {
        icon = yellowIcon;
      }
      else {
        icon =  L.AwesomeMarkers.icon({prefix: 'fa', icon: 'map-marker', 
          markerColor: degree.color});
      }
    
      var keys = Object.keys(data[i]);
      var name = data[i][keys[0]];
      var latlng = sites[name];
      data[i].TWD97Lat = latlng.lat;
      data[i].TWD97Lon = latlng.lng;

      var marker = L.marker([data[i].TWD97Lat, data[i].TWD97Lon],
        {icon: icon, opacity: 0.9})
        .addTo(map);   

      marker.bindPopup('<strong>測站名稱：'  + data[i].SiteName
                  + '</strong><br/><span class="' + degree.color + '">' 
                  + '紫外線指數分級：' + degree.disc
                  + "</span><br/>紫外線指數：" + data[i].UVI 
                  + '<br/>縣市：' + data[i].County);
    }
    d3Initialize(map, data);
  }

  function getDegree(UVI) {
    if (UVI <= 2) {
      return { disc: '低量級', color: 'green'};
    }
    else if (UVI <= 5) {
      return { disc: '中量級', color: 'yellow'};
    }
    else if (UVI <= 7) {
      return { disc: '高量級', color: 'orange'};
    }
    else if (UVI <= 10){
      return { disc: '過量級', color: 'red'}; 
    }
    else {
      return { disc: '危險級', color: 'purple'}; 
    }
  }

  function initMap() {
    map = new L.Map('map');

    /*url = 'http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}';
    attrib = 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';*/

    url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
    attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    /*url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}';
    attrib = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';*/

    var osm = new L.TileLayer(url, {minZoom: 1,  maxZoom: 16, attribution: attrib});   


    map.setView(new L.LatLng(24, 121), 7);
    osm.addTo(map);
    info.addTo(map); 
    legend.addTo(map);
  }

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4>格狀區塊：表示該區域內最近的測站</h4>'
    return this._div;
  };
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#E062C8', '#F52305', '#F7931C', 'yellow', '#7FB73A'];
      var labels = ['危險級', '過量級', '高量級', '中量級', '低量級'];

      for (var i = 0; i < labels.length; i++) {
          div.innerHTML += '<i style="background:' + color[i] 
            + '"></i>' + labels[i] + '<br/>';
      }

      return div;
  };

  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(setPosition);
    }
    else{
      //x.innerHTML="Geolocation is not supported by this browser.";
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
      $('.main-info').hide(); 
    }
    else {
      $('.main-info').show(); 
    }
    showInfo = !showInfo;
  }


})();
