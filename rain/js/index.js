(function(window) {

  window.showDetail = showDetail;
  window.goBack = goBack;
  var data;
  var countryData = {};
  var engine;
  var time;
  var now = new Date().getHours();
  var countryOrder = [
      '基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', 
      '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', 
      '臺南市', '高雄市', '屏東縣', 
      '宜蘭縣', '花蓮縣', '臺東縣', 
      '連江縣', '金門縣','澎湖縣'
  ];
  
  init();
  function init() {
    if (now > 5 && now < 18) {
      time = 'daytime';
    }
    else {
      time = 'night';
    }

    $.getJSON('./data/data.json').then(function(_data) {
      data = _data;
      sumCountryData();
    });
  }

  function setBackground(type) {
    var image = document.getElementById('background-img');
    image.crossOrigin = 'anonymous';
    if (type === 'rain') {
      image.onload = function() {
          engine = new RainyDay({
              image: this
          });
          engine.rain([ [1, 2, 8000] ]);
          engine.rain([ [3, 3, 0.88], [5, 5, 0.9], [6, 2, 1] ], 100);
      };
      image.src = './images/' + time + '-' + type + '.jpg';
    }
    else {
      image.src = './images/' + time + '-' + type + '.jpg';
    }
  }

  function sumCountryData() {
    var numberKeys = ['Rainfall10min', 'Rainfall1hr', 'Rainfall3hr', 'Rainfall6hr',
      'Rainfall12hr', 'Rainfall24hr'];

    data.forEach(function(site) {
      if (!countryData.hasOwnProperty(site.County)) {
        countryData[site.County] = {
          Rainfall10min: 0,
          Rainfall1hr: 0,
          Rainfall3hr: 0,
          Rainfall6hr: 0,
          Rainfall12hr: 0,
          Rainfall24hr: 0,
          Sitenumber: 0
        };
      }

      for (var i in numberKeys) {
        countryData[site.County][numberKeys[i]] += parseFloat(site[numberKeys[i]]); 
        countryData[site.County].Sitenumber += 1;
      }
    }); 

    for (var key in countryData) {
      for (var i in numberKeys) {
        countryData[key][numberKeys[i]] =  (countryData[key][numberKeys[i]] / 
          countryData[key].Sitenumber).toFixed(2);
      }
    }
    draw(countryData);
  }
  
  function draw(data) {
    countryOrder.forEach(function(key) {
      $('.mychart').append(
        '<div class="raindrop" id="'+ key + '">' + '<h3>' + key + '</h3>' +
        '<h6>10分鐘平均累積雨量<br/><span class="red">' + data[key].Rainfall10min + 
        '</span></h6>'  +
        '<h6>1小時平均累積雨量<br/><span class="red">' + data[key].Rainfall1hr + 
        '</span></h6>' +
        '<a href="#' + key + '" class="btn-more" onClick=showDetail(' + 
          key + ')>點擊觀看</a></div>' 
      );
      if (Math.round(10*data[key].Rainfall1hr) !== 0) {
        createRainDrop('#'+key, getOptions(data[key].Rainfall10min));
      }
    });
      setBackground('sunny');
  }

  function createRainDrop(id, options) {
    options = options || {};
    $(id).raindrops(options);
  }

  function getOptions(rainValue) {
    var weak = {
      color: 'rgb(23, 139, 202)',
      waveLength: 400,
      frequency: 2,
      waveHeight: 80,
      density: 0.04, 
      rippleSpeed: 0.03
    };
    var normal = {
      color: 'rgb(23, 139, 202)',
      waveLength: 400,
      frequency: 2,
      waveHeight: 80,
      density: 0.04, 
      rippleSpeed: 0.03
    };
    var strong = {
      color:'#f77b7b',
      waveLength: 400,
      frequency: 2,
      waveHeight: 80,
      density: 0.04, 
      rippleSpeed: 0.03
    };
    normal.canvasHeight = rainValue*10;
    if (normal.canvasHeight && normal.canvasHeight > 300) {
      normal.canvasHeight = 300;
    }
    return normal;
  }

  function showDetail(county) {
    var sites = [];
    data.forEach(function(site) {
      if (site.County === county.id) sites.push(site); 
    });
    $('canvas').remove();
    drawDetail(sites);
  }

  function drawDetail(data) {
    $('.mychart').empty();
    var numberOfRain = 0;
    data.forEach(function(site) {
      var name = site.SiteName.replace(/[()]/g, '-');
      $('.mychart').append( '<div class="raindrop" id="'+ site.SiteId + '">' +
        '<h3>' + name + '</h3>' +
        '<h6>10分鐘累積雨量<br/><span class="red">' + site.Rainfall10min + '</span></h6>' +
        '<h6>1小時累積雨量<br/><span class="red">' + site.Rainfall1hr + '</span></h6>' +
        '<h6>日累積雨量<br/><span class="red">' + site.Rainfall24hr + '</span></h6>' +
        '<a href="#" class="btn-back" onClick=goBack()>返回</a></div>' 
      );
      if (Math.round(10*site.Rainfall10min) !== 0) {
        createRainDrop('#'+site.SiteId, getOptions(site.Rainfall1hr));
        numberOfRain += 1;
      }
    });
    if (numberOfRain > 1) {
      setBackground('rain');
    }
    else {
      setBackground('sunny');
    }
  }

  function goBack() {
    $('.mychart').empty();
    draw(countryData);
  }


})(window);
