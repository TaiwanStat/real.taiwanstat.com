(function() {

  d3Initialize = require('./index');

  var map;
  var geojson; 
  var info = L.control();
  var showInfo;

  var geoData = null;

  window.getLocation = getLocation;
  window.resetView = resetView;
  window.toogleInfo = toogleInfo;

  var yellowIcon = L.icon({
    iconUrl: './images/yellow.png',
    iconSize:     [35, 45], // size of the icon
    iconAnchor:   [17, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });

  var brownIcon = L.icon({
    iconUrl: './images/brown.png',
    iconSize:     [35, 45], // size of the icon
    iconAnchor:   [17, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });



  $( document ).ready(function() {
    initMap();
    d3.csv('./data/site.csv', function(sites) {
      var api = "http://52.69.145.204:3000/airs/latest";
      d3.json(api, function(data) { 
        addSiteToMap(data, sites);
      });
    });
  });


  function addSiteToMap (data, sites) {

    var timeTmp = data[0].PublishTime;
    for (var i in data) {
      
      if (data[i].PublishTime >= timeTmp) {
        $('.updateAt').text('更新時間：' + data[i].PublishTime + '（每小時更新）');
        timeTmp = data[i].PublishTime;
      }
      
      var degree = getDegree(data[i]['PM2.5']);
      var icon;

      if (degree.color == 'yellow') {
        icon = yellowIcon;
      }  
      else if (degree.color == 'brown') {
        icon = brownIcon;
      }
      else {
        icon =  L.AwesomeMarkers.icon({prefix: 'fa', icon: 'map-marker', 
          markerColor: degree.color});
      }
     
      var siteInfo = getSiteInfo(data[i].SiteName, sites);
      var marker = L.marker([siteInfo.TWD97Lat, siteInfo.TWD97Lon],
        {icon: icon, opacity: 0.9})
        .addTo(map);   

      marker.bindPopup('<strong>測站名稱：'  + data[i].SiteName
                  + '</strong><br/><span class="' + degree.color + '">' 
                  + 'PM2.5 空污指標：' + degree.disc
                  + "</span><br/>PM2.5：" + data[i]['PM2.5'] + '（μg/m3）'
                  + '<br/>PM10：' + data[i]['PM10'] + '（μg/m3）'
                  + '<br/>PSI：' + data[i].PSI
                  + '<br/>測站類型：' + siteInfo.SiteType
                  + '<br/>地址：' + siteInfo.SiteAddress);
    }
    d3Initialize(map, sites);
  }

  function getSiteInfo(siteName, siteData) {
    for (var i in siteData) {
      if (siteData[i].SiteName == siteName) {
        return siteData[i];
      }
    } 
  }

  function getDegree(p) {
    if (p <= 12) {
      return { disc: '空氣品質良好', color: 'green'};
    }
    else if (p <= 35) {
      return { disc: '空氣品質普通', color: 'yellow'};
    }
    else if (p <= 55) {
      return { disc: '對敏感性族群不健康', color: 'orange'};
    }
    else if (p <= 150){
      return { disc: '空氣品質不良', color: 'red'}; 
    }
    else if (p <= 250){
      return { disc: '空氣品質非常不良', color: 'purple'}; 
    }
    else {
      return { disc: '空氣品質屬有害', color: 'brown'}; 
    }
  }

  function initMap() {
    map = new L.Map('map');


    /*url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
    attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';*/

    url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
    attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
   /*url = 'http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}';
    attrib = 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';*/

    /*url = 'http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.night/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}'; 
    attrib = 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>';&*/

    var osm = new L.TileLayer(url, {minZoom: 1,  maxZoom: 16, attribution: attrib});   

    map.setView(new L.LatLng(24, 121), 7);
    osm.addTo(map);
    info.addTo(map); 
    legend.addTo(map);
  }

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4 class="">格狀區塊：表示該區域內最近的測站</h4>'
    return this._div;
  };
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#5F2828', '#E062C8', '#F52305', '#F7931C', 'yellow', '#7FB73A'];
      var labels = ['有害', '非常不良', '不良', '接近不良', '普通', '良好'];

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
