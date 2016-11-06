$(document).ready(function() {
  $('#hintButton').on('click', function() {
    $('#hint').removeClass('show');
  })
  var map = L.map('map').setView([22.99,120.218],13),
    accessToken = 'pk.eyJ1IjoiYWJ6NTMzNzgiLCJhIjoiUkRleEgwVSJ9.rWFItANcHAZQ2U0ousK4cA',
    mapID = 'abz53378.0klc153h',
    today = new Date();

  // set marker and center
  // download map
  L.tileLayer(`https://api.tiles.mapbox.com/v4/${mapID}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a><a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/nl/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/3.0/nl/80x15.png" /></a>.'
  }).addTo(map);

  if(window.innerWidth <= 800) {
    document.getElementsByClassName('leaflet-control-container')[0].innerHTML +=
      `<button id="QA" class="circular primary ui icon button">
        <i class="help icon"></i>
    </button>`;
    window.setTimeout(function() {
      document.getElementById('QA').addEventListener('click', () => {
        $("#hint").addClass('show');
      }, false) ;
      $("#QA").click();
    }, 1000);
    window.alert('請開啟定位，才能正常瀏覽此網頁！');
    var had = 0;
    getGPS(function(position) {
      var lat = position.coords.latitude,
          lng = position.coords.longitude;

        map.setView([lat, lng],15)
        L.marker([lat,lng]).addTo(map)
          .bindPopup('所在位置')
          .openPopup();
        L.circle([lat, lng], 500, {
          stroke: false,
          fillColor: 'blue',
        }).addTo(map);
    }, function(){
      window.alert("此裝置不支援GPS");
    });
  }
  else{
    document.getElementsByClassName('leaflet-control-container')[0].innerHTML += `<button id="GPS" class="ui primary button">我的位置</button>`;
    window.setTimeout(function() {

      document.getElementById('GPS').addEventListener("click",function listener() {
        document.getElementById('GPS').className += ' loading';
        getGPS(function(position) {
          var lat = position.coords.latitude,
              lng = position.coords.longitude;

            map.setView([lat, lng],15)
            L.marker([lat,lng]).addTo(map)
              .bindPopup('所在位置')
              .openPopup();
            L.circle([lat, lng], 500, {
              stroke: false,
              fillColor: 'blue',
            }).addTo(map);
          var className = document.getElementById('GPS').className;
            document.getElementById('GPS').innerText = `${parseInt(lat*100)/100},${parseInt(lng*100)/100}`;
            document.getElementById('GPS').className = className.replace('loading','');
            document.getElementById('GPS').removeEventListener('click',listener,false);

        }, function(){
          window.alert("此裝置不支援GPS");
        });
      })
      document.getElementsByClassName('leaflet-control-zoom-out')[0].addEventListener('click',() => {map.zoomOut()},false);
      document.getElementsByClassName('leaflet-control-zoom-in')[0].addEventListener('click',() => {map.zoomIn()},false);

    },1000);
  }
  // //set every circle

  var myIcon = L.icon({
    iconUrl: './vaccine.png',
    iconSize: [32, 32],
  });
  d3.json('./data/hospitals.json', function(err, data) {
    let num = 0, markerArr = [];
    var markers = L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        return L.divIcon({html:
          '<div class="cluster-icon"><img src="./vaccine.png"/><div>' +
          cluster.getChildCount() +
          '</div></div>'
        });
      },
    });
    markerArr = data.forEach(function(d) {
      markers.addLayer(
      L.marker([d.lat, d.lng],{icon: myIcon})
        .bindPopup(d.hospital + '<br/>' + d.phone + '<br/>' + d.address));
    });
    map.addLayer(markers);
    markers.refreshClusters();
  });
});

function getGPS(resolve, reject) {
  if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function(position) {
      resolve(position);
    })
  else{
    reject();
  }
}
