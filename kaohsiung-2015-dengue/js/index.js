(function(window) {

  var map,
      data,
      villageData,
      threeCircleData,
      fiveCircleData,
      oneCircleData,
      drugOrg,
      drugData,
      circles = [],
      drugCircles = [],
      markers = [],
      day = 3,
      info = L.control(),
      showDrug = false,
      drugGeojson,
      drugLayer = [],
      parseDate = d3.time.format("%Y/%m/%d").parse,
      from,
      end,
      pivot,
      diffDays,
      latlngs = {},
      topoLayer,
      stopIntervalIsTrue = false,
      defaultZoom,
      defaultCircleParams = {
        size: 500,
        color: '#e851c',
        fillColor: '#E24A31',
        showBig: true,
        opacity: 0.1
      };

  info.onAdd = onInfoAdd;
  info.update = onInfoUpdate;
  window.initData = initData;
  window.initDate = initDate;
  window.initMap = initMap;
  window.updateVis = updateVis;

  function initDate(f, e) {
    from = parseDate(f);
    end = parseDate(e);
  }

  var myFirebaseRef = new Firebase("https://realtaiwanstat2.firebaseio.com");
  function initData(dengueUrl, drugUrl, barUrl, villageUrl, topoUrl, drugGeoUrl) {
    $('.current').text('資料載入中...'); 

    myFirebaseRef.child("dengue-kao1").limitToLast(1).on("child_added", function(snapshot) {
      var d = JSON.parse(snapshot.val());
      
      //d3.json(dengueUrl, function(d) {
      data = d;
      console.log(data);
      if(d.end) {
        end = new Date(d.end);
      }

      var timeDiff = Math.abs(end.getTime() - from.getTime());
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      $('.range input')[0].max = diffDays;
      var pivot = new Date(end);
      var key = pivot.toISOString().substring(0, 10).replace(/-/g, '/');
      $('.current').text(key); 
      threeCircleData = format(data[key].three);
      fiveCircleData = format(data[key].five);
      oneCircleData = format(data[key].one);

      if (oneCircleData) {
        defaultCircleParams.size = 50;
        defaultCircleParams.opacity = 0.8;
        defaultCircleParams.color = 'rgb(222, 50, 24)';
      }
      drawCircle(threeCircleData, defaultCircleParams);
  
      if (drugUrl)
        d3.json(drugUrl, function(data) {
          drugOrg = data;
          drugData = format(drugOrg[key]);
          toggleDrugCircle();
        });
    });

    if (topoUrl)
      d3.json(topoUrl, function(topoData) {
        for (var key in topoData.objects) {
          geojson = topojson.feature(topoData, topoData.objects[key]);
        }
        topoLayer = L.geoJson(geojson, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map);
      });
    
    if (barUrl) {
      //d3.json(barUrl, function(error, data) { 
      myFirebaseRef.child("dengue-kao2").limitToLast(1).on("child_added", function(snapshot) {
        data = JSON.parse(snapshot.val());
        new window.BarLineChart('#bar', data, showDefaultTip, {
          showLine: true
        }); 
      });
    }

    if (villageUrl) d3.json(villageUrl, function(data) { villageData = data; });

    if (drugGeoUrl) {
      d3.json(drugGeoUrl, function(data) {
        drugGeojson = data;
      });
    }
  }

  function format(arr) {
    if (!arr) return null;
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

  function getDate(dateArr) {
    if (dateArr[1] < 10) {
      dateArr[1] = '0' + dateArr[1];
    }
    if (dateArr[2] < 10) {
      dateArr[2] = '0' + dateArr[2];
    }
    return dateArr;
  }

  function initMap(centerLat, centerLng, _defaultZoom) {
    defaultZoom = _defaultZoom;
    map = new L.Map('map');

    var url = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
    var osm = new L.TileLayer(url, {minZoom: 12,  maxZoom: 19, attribution: attrib});   

    map.setView(new L.LatLng(centerLat, centerLng), defaultZoom);
    osm.addTo(map);
    info.addTo(map); 
  }

  function drawCircle(data, argvs) {
    latlngs = {};
    if (data === undefined) return;
    data.forEach(function(point) {
      if (point.Longitude < point.Latitude) {
        var tmp = point.Latitude;
        point.Latitude = point.Longitude;
        point.Longitude = tmp;
      }
      if (latlngs[point.Longitude] && latlngs[point.Longitude][point.Latitude]) {
        return;
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

  function onInfoAdd(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    if (defaultZoom < 14) {
      this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：' +
        '這個範圍3天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    }
    else {
      this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：' +
        '這個範圍3天內的登革熱病例數超過3人</h4><span>（半徑50公尺）</span>';
    }
    return this._div;
  }

  function onInfoUpdate() {
    if (defaultZoom < 14) {
     this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍' + day  +
       '天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    }
    else {
     this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍' + day  +
       '天內的登革熱病例數超過3人</h4><span>（半徑50公尺）</span>';
    }
    return this._div;
  }


  function updateCircle(d) {
    day = d;
    removeCircles(circles);
    if (day == 3) {
      drawCircle(threeCircleData, defaultCircleParams);
    }
    else if (day == 5){
      drawCircle(fiveCircleData, defaultCircleParams);
    }
    else if (day == 1){
      drawCircle(oneCircleData, defaultCircleParams);
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

  var update = false;
  function updateVis (input, interval) {
    update = !update;
    if (!update && interval) return;
    input.value = parseInt(input.value) + 1;

    var pivot = new Date(from);
    pivot.setDate(from.getDate() + parseInt(input.value));
    var key = pivot.toISOString().substring(0, 10).replace(/-/g, '/');
    $('.current').text(key); 

    if (parseInt(input.value) > diffDays || stopIntervalIsTrue) {
      clearInterval(interval);
    }
    if (data === undefined || !data.hasOwnProperty(key)) return;

    // dengue data
    threeCircleData = format(data[key].three);
    fiveCircleData = format(data[key].five);
    oneCircleData = format(data[key].one);
    updateCircle(day);

    if (drugGeojson) {
      drugLayer.forEach(function(layer) {
        if (isExpire(key, layer.date)) {
          map.removeLayer(layer.layer);
        }
      });
    }

    if (drugGeojson && key in drugGeojson) {
      drugGeojson[key].forEach(function(layer) {
        var dlayer =  L.geoJson(layer, {}).addTo(map);
        drugLayer.push({
          layer: dlayer,
          date: key
        })
      });
    }



    // hightline bar
    $('rect').attr("class", "");
    $('#bar-'+key.replace(/\//g, '-')).attr("class", "active");


    // drug
    if (drugOrg && key in drugOrg) 
      drugData = format(drugOrg[key]);

    if (showDrug) {
      removeCircles(drugCircles);
      if (drugOrg && drugData) {
        drawCircle(drugData, {
          color: '#028D9B',
          fillColor: '#028D9B',
          size: 50,
          opacity: 0.5,
          showBig: false
        });
      }
    }
  }

  $('.play').click(function() {
    stopIntervalIsTrue = false;
    var input = $('.range input')[0];
    var interval = setInterval(function(){ 
        // update circle data
        return updateVis(input, interval);
      }, 800); 
  });

  $('.pause').click(function() {
    stopIntervalIsTrue = true;
  });

  $('.stepback').click(function() {
    stopIntervalIsTrue = true;
    $('.range input')[0].value = 0;
  });

  $('.range input').change(function() {
    updateVis(this); 
  });

  $('.checkbox')
    .checkbox({
      onChange: function() {
        var checkboxs = $(this);
        checkboxs.each(function(i) {
          var value = checkboxs[i].value;
          var name = checkboxs[i].name;
          if (name == 'drug'){
            return toggleDrugCircle();
          }

          if (checkboxs[i].checked) {
            if (name == 'days') {
              updateCircle(value); 
            }
          }
          else if (value == 'on') {
            updateCircle(day, 'off'); 
          } 
        });
      }
  });

  function showDefaultTip(d) {
    var info = d.date.toLocaleDateString() + 
      '  <strong>病例數：</strong> <span style="color:red">' + d.value + '</span><br/>';
    if (d.氣溫) {
      info += '<strong>氣溫：</strong> <span style="color:red">' + d.氣溫 + '</span> '+
        '<strong>降水量：</strong> <span style="color:red">' + d.降水量 + '</span> ' +
        '<strong>相對溼度：</strong> <span style="color:red">' + d.相對溼度 + '</span>';
    }
    return info;
  }

  function style(feature) {
    return {
      fillColor: '#D5D5D5',
      weight: 1,
      opacity: 0.3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.1
    };
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: layerOnClick
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


  function layerOnClick(e) {
    viewStreet(e); 

    var village = e.target.feature.properties.TOWNNAME + e.target.feature.properties.VILLAGENAM;

    var svg = $('#bar svg');
    if (svg.length > 0) {
      svg[0].remove();
    }

    new window.BarLineChart('#bar', villageData[village], function(d) {
      var info = d.date.toLocaleDateString() + 
       '  <strong>病例數：</strong> <span style="color:red">' + d.value + '</span>';
      if (d.降水量 > 0)
        info += '<br/>降水：<span style="color:red">' + d.rain_day + '</span>天內<br/>' +
          '降水量：<span style="color:red">' + d.降水量 + '</span>（毫米）';
      return info;
    }, {
      showLine: true
    });
  }

  function viewStreet(e) {
    if ($('#street-view').length === 0)
      return;
    $('#street-view').empty();
    var latlng = new google.maps.LatLng(e.latlng.lat, e.latlng.lng);
    var dist = new google.maps.LatLng(e.latlng.lat+0.01, e.latlng.lng+0.01);
    var hyperlapse = new Hyperlapse(document.getElementById('street-view'), {
      lookat: latlng,
      zoom: 1,
      use_lookat: true,
      width: $('#street-view').width(),
      height: $('#street-view').height(),
      elevation: 50
    });
    hyperlapse.onError = function(e) {
      console.log(e);
    };

    hyperlapse.onRouteComplete = function(e) {
        hyperlapse.load();
    };

    hyperlapse.onLoadComplete = function(e) {
        hyperlapse.play();
        setTimeout(function(){ hyperlapse.pause(); }, 3000);
    };
    var directions_service = new google.maps.DirectionsService();

    var route = {
        request:{
            origin: latlng,
            destination: latlng,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }
    };

    directions_service.route(route.request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            hyperlapse.generate( {route:response} );
        } else {
            console.log(status);
        }
    }); 
  }

  function isExpire(now, date) {
    var current = new Date(now);
    var from = new Date(date)
    var timeDiff = Math.abs(current.getTime() - from.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays >= 14 ? true : false;
  }


})(window);
