//create two promise;
$(document).ready(function(){
function getData(url) {
  return new Promise((resolve, reject) => {
    d3.tsv(url, data => {
      if(data) {
        resolve(data);
      }
      else{
        reject(new Error('get data error'));
      }
    });
  });
}

function getGPS() {
  return new Promise((resolve, reject) => {
    if(navigator.geolocation)
      navigator.geolocation.watchPosition(position => {
        resolve(position);
      })
    else{
      reject();
    }
  });
}

$('#hintButton').on('click', () => {
  $('#hint').removeClass('show');
})


function urlParse( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}
let map = L.map('map').setView([22.99,120.218],13),
  accessToken = 'pk.eyJ1IjoiYWJ6NTMzNzgiLCJhIjoiUkRleEgwVSJ9.rWFItANcHAZQ2U0ousK4cA',
  mapID = 'abz53378.0klc153h',
  today = new Date();

// set marker and center
//download map
L.tileLayer(`https://api.tiles.mapbox.com/v4/${mapID}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a><a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/nl/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/3.0/nl/80x15.png" /></a>.'
}).addTo(map);


if(window.innerWidth <= 800) {
  document.getElementsByClassName('leaflet-control-container')[0].innerHTML +=
    `<button id="QA" class="circular primary ui icon button">
        <i class="help icon"></i>
    </button>`;
  window.setTimeout(() => {
    document.getElementById('QA').addEventListener('click', () => {
      $("#hint").addClass('show');
    }, false) ;
    $("#QA").click();
  }, 1000);
  window.alert('請開啟定位，才能正常瀏覽此網頁！');
  getGPS()
    .then((position) => {
      let lat = position.coords.latitude,
        lng = position.coords.longitude;

      map.setView([lat, lng],15)
      L.marker([lat,lng]).addTo(map)
        .bindPopup('所在位置')
        .openPopup();
      L.circle([lat, lng], 500, {
        stroke: false,
        fillColor: 'blue',
      }).addTo(map);

    })
    .catch(() => {

      window.alert("此裝置不支援GPS");
    });
}
else{
  document.getElementsByClassName('leaflet-control-container')[0].innerHTML += `<button id="GPS" class="ui primary button">我的位置</button>`;
  window.setTimeout(() => {

    document.getElementById('GPS').addEventListener("click",function listener() {
      console.log(123);
      document.getElementById('GPS').className += ' loading';
      getGPS()
        .then((position) => {
          let lat = position.coords.latitude,
            lng = position.coords.longitude;

          map.setView([lat, lng],15)
          L.marker([lat,lng]).addTo(map)
            .bindPopup('所在位置')
            .openPopup();
          L.circle([lat, lng], 500, {
            stroke: false,
            fillColor: 'blue',
          }).addTo(map);
          return {lat, lng};
        })
        .then(({lat, lng}) => {

          let className = document.getElementById('GPS').className;
          document.getElementById('GPS').innerText = `${parseInt(lat*100)/100},${parseInt(lng*100)/100}`;
          document.getElementById('GPS').className = className.replace('loading','');
          document.getElementById('GPS').removeEventListener('click',listener,false);

        })
        .catch(() => {

          window.alert("此裝置不支援GPS");
        });
    })
    document.getElementsByClassName('leaflet-control-zoom-out')[0].addEventListener('click',() => {map.zoomOut()},false);
    document.getElementsByClassName('leaflet-control-zoom-in')[0].addEventListener('click',() => {map.zoomIn()},false);

  },1000);
}
// //set every circle

let myIcon = L.icon({
  iconUrl: './hospital1.png',
  //iconRetinaUrl: 'my-icon@2x.png',
  iconSize: [64, 64],
  //iconAnchor: [16, 16],
  //popupAnchor: [-3, -76],
  //shadowUrl: './hospital.png',
  //shadowRetinaUrl: 'my-icon-shadow@2x.png',
  //shadowSize: [23, 23],
  //shadowAnchor: [22, 94]
});
getData('./data/dengue105.csv').then(data => {
  let num = 0;
  data.forEach(d => {
    let date = new Date(d['確診日']),
      times = 432000000;
    if(today - date < times) {
      num ++;
      L.circle([d['緯度座標'], d['經度座標']], 200, {
        stroke: false,
        fillColor: 'red',
      }).addTo(map);
    }

  });
  return num;
})
  .then(num => {
    document.getElementsByClassName('leaflet-control-container')[0].innerHTML += `<div id="info">近五日內共有${num}個確診病例數</div>`;
  })
  .catch(err => {console.error(err);});

getData('./data/hospital_combine.tsv').then(data => {


  let num = 0;
  console.log(data);
  data.forEach(d => {
    L.marker([d['緯度'], d['經度']],{icon:myIcon}).addTo(map)
      .bindPopup(`${d['名稱']}<br/>${d['電話']}<br/>${d['地址']}`);
  });
  return num;
})
});
