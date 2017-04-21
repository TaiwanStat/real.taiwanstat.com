(function() {

  var map;
  var siteInfo;
  var riverData;
  var geojson; // basin layer

  var basinRPI = {};
  var geoData = null;
  var showLinks = false;
  var info = L.control();

  var GeojsonMinifier = require('geojson-minifier');
  var minifier = new GeojsonMinifier({ precision: 3 });


  window.getLocation = getLocation;
  window.resetView = resetView;
  window.toogleLinks = toogleLinks;
  window.showRPIInfo = showRPIInfo;
  window.hideRPIInfo = hideRPIInfo;

  var geoJSONStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.2
  };

  $.getJSON('./data/river.geojson.packed', function(data) {
    var unpacked = minifier.unpack(data);
    geoData = data;
    geojson = L.geoJson(geoData, {
      style: style,
      onEachFeature: onEachFeature
    });
    geojson.addTo(map);
    info.update();
  });

  $( document ).ready(function() {
    initMap();
    $.getJSON('./data/river.json', function(data) {
      riverData = data;
      console.log(data);
      addSiteToMap();
    });
  });

  function addSiteToMap () {
    $.getJSON('./data/siteInfo.json', function(data) {
      siteInfo = data;

      for (var i in siteInfo) {
        if(siteInfo[i].SiteName in riverData) {
          riverData[siteInfo[i].SiteName]['RPI'] =
            parseFloat(riverData[siteInfo[i].SiteName]['RPI']);
          if (isNaN(riverData[siteInfo[i].SiteName]['RPI'])) {
            continue;
          }

          var polluDegree = getPollutionDegree(riverData[siteInfo[i].SiteName]['RPI']);
          var icon =  L.AwesomeMarkers.icon({prefix: 'fa', icon: 'map-marker',
            markerColor: polluDegree.color});

          var marker = L.marker([
            siteInfo[i].TWD97Lat, siteInfo[i].TWD97Lon],
            {icon: icon, opacity: 0.9})
            .addTo(map);

          /*marker.on('click', function(e) {
            map.setView(this.getLatLng(), 11);
          });*/

          marker.bindPopup('<strong>測站名稱：' + siteInfo[i].SiteName
                      + '</strong><br/><span class="red">污染程度：' + polluDegree.disc
                      + "</span><br/>所屬流域：" + siteInfo[i].Basin
                      + '<br/>RPI指標：' + riverData[siteInfo[i].SiteName].RPI
                      + '<br/>酸鹼值：' + riverData[siteInfo[i].SiteName].PH
                      + '<br/>懸浮固體：'
                      + riverData[siteInfo[i].SiteName].SS + '（mg/L）'
                      + '<br/>溶氧量：'
                      + riverData[siteInfo[i].SiteName].DO + '（mg/L）'
                      + '<br/>生化需氧量：'
                      + riverData[siteInfo[i].SiteName].COD + '（mg/L）'
                      + '<br/>氨氮：' + riverData[siteInfo[i].SiteName].NH3N + '（mg/L）'
                      + '<br/>地址：'+ siteInfo[i].SiteAddress);

          if (siteInfo[i].Basin in basinRPI) {
            basinRPI[siteInfo[i].Basin].RPI += riverData[siteInfo[i].SiteName]['RPI'];
            basinRPI[siteInfo[i].Basin].siteNumber += 1;
          }
          else {
            basinRPI[siteInfo[i].Basin] = {};
            basinRPI[siteInfo[i].Basin].RPI = riverData[siteInfo[i].SiteName]['RPI'];
            basinRPI[siteInfo[i].Basin].siteNumber = 1;
          }
        }
       }
      for (var i in basinRPI) {
        basinRPI[i].RPI = parseFloat(basinRPI[i].RPI) / basinRPI[i].siteNumber;
      }

      geojson = L.geoJson(geoData, {
        style: style,
        onEachFeature: onEachFeature
      });
      geojson.addTo(map);

    });

  }

  function getPollutionDegree(RPI) {
    if (RPI <= 2) {
      return { disc: '未(稍)受污染', color: 'blue'};
    }
    else if (RPI <= 3) {
      return { disc: '輕度污染', color: 'orange'};
    }
    else if (RPI <= 6) {
      return { disc: '中度污染', color: 'red'};
    }
    else {
      return { disc: '嚴重污染', color: 'darkpurple'};
    }
  }

  function initMap() {
    map = new L.Map('map');

    var url = 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png';
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    var osm = new L.TileLayer(url, {minZoom: 1,  maxZoom: 16, attribution: attrib});

    map.setView(new L.LatLng(23.7, 121), 8);
    osm.addTo(map);
    info.addTo(map);
    legend.addTo(map);
  }

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.name),
        weight: 2,
        opacity: 1,
        color: '#eee',
        dashArray: '3',
        fillOpacity: 0.4
    };
  }

  function getColor(name) {
    var d = 0;
    if (name+'流域' in basinRPI) {
      d = basinRPI[name + '流域'].RPI;
    }
    else {
     return 'transparent';
    }

    return d <= 2 ? '#39AADD' :
      d <= 3   ? '#E39941' :
      d <= 6   ? '#D24C39' :
      '#684064';
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    //info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    info.update(e.target.feature.properties);
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4>流域圖層載入中 <i class="fa fa-spinner"></i></h4>'
    return this._div;
  };

  info.update = function (props) {
    if (props && props.name+'流域' in basinRPI) {
      this._div.innerHTML = '<h4>河川流域名稱：' +  (props ?
         props.name + '</h4>平均污染指數RPI<sup class="rpi-q"><a href="#" onclick="showRPIInfo()">[?]</a></sup>：' + basinRPI[props.name + '流域'].RPI.toFixed(1)
         : '</h4>請點選畫面區塊' );
    }
    else {
     this._div.innerHTML = '<h4>河川流域名稱：' +  (props ?
         props.name + '</h4>流域內無測站資料'
         : '</h4>請點選畫面區塊' );
    }
  };

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#684064', '#D24C39', '#E39941', '#39AADD'];
      var labels = ['嚴重污染（6+）', '中度污染（3-6）', '輕度污染（2-3）', '未（稍）受污染（0-2）'];

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
          position.coords.longitude), 12);
  }

  function resetView () {
    map.setView(new L.LatLng(23.7, 121), 8);
  }

  function toogleLinks() {
    if (showLinks) {
      $('.links').hide();
    }
    else {
      $('.links').show();
    }
    showLinks = !showLinks;
  }

  function showRPIInfo() {
      $('.rpi-info').show();
  }
  function hideRPIInfo() {
      $('.rpi-info').hide();
  }

})();
