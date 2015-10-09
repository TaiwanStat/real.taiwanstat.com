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
  
  var myFirebaseRef = new Firebase("https://realtaiwanstat3.firebaseio.com");

  init();
  function init() {
    time = (now > 5 && now < 18) ? '白天' : '晚上';
    myFirebaseRef.child("rain").limitToLast(1).on("child_added", function(snapshot) {
      var _data = snapshot.val();
    //$.getJSON('./data/data.json').then(function(_data) {
      data = _data;
      $('.updateAt').text(data[0].PublishTime);
      $('body').css('background-color', 'black');
      $('canvas').remove();
      countryData = {};
      sumCountryData();
      $('.loading').remove();
      $('#layout-header').show();
    });
  }

  function setBackground(type, placeNmae, maxRainValue) {
    var image = document.createElement('img');
    image.id = 'background-img';
    image.crossOrigin = 'anonymous';
    document.body.appendChild(image);

    if (type === 'rain') {
      image.onload = function() {
          engine = new RainyDay({
              image: this
          });
          var isMobile = $(window).width() < 680;

          // default window rain drop
          if (maxRainValue < 2) {
            engine.rain([ [1, 3, 1000*maxRainValue] ]);
          }
          else if (maxRainValue < 5) {
            engine.rain([ [1, 5, 1000] ]);
          }
          else {
            engine.rain([ [1, 8, 1000] ]);
          }

          // dynamic drop size
          var drops = [[1, 3, 2]];
          if (isMobile) {}
          else if (maxRainValue > 1) {
            drops.push([2, 3, 10]);
          }
          else if (maxRainValue > 5) {
            drops.push([5, 10, 20]);
          }
          else if (maxRainValue > 10) {
            drops.push([7, 15, 20]);
          }
          
          // freq
          if (maxRainValue < 1 || isMobile) {
            engine.rain(drops, 500);
          }
          else if (maxRainValue < 5) {
            engine.rain(drops, 100/maxRainValue);
          }
          else if (maxRainValue < 10){
            engine.rain(drops, 5);
          }
          else {
            engine.rain(drops, 0.5);
          }
      };
    }
    image.src = './images/' + placeNmae + time + '.jpg';
  }

  function removeBackground() {
    if ($('#background-img')) {
      $('#background-img').remove(); 
      $('canvas').remove();
      engine = {};
    }
  }

  function sumCountryData() {
    var numberKeys = [
      'Rainfall10min', 'Rainfall1hr', 'Rainfall24hr'
    ];

    data.forEach(function(site) {
      if (!countryData.hasOwnProperty(site.County)) {
        countryData[site.County] = {
          Rainfall10min: 0.0,
          Rainfall1hr: 0.0,
          Rainfall24hr: 0.0,
          Sitenumber: 0.0
        };
      }
      //site.Rainfall1hr = Math.random()*90;
      //site.Rainfall10min = Math.random()*20;
      countryData[site.County].Sitenumber += 1;
      for (var i in numberKeys) {
        if (numberKeys[i] !== 'Sitenumber') {
          countryData[site.County][numberKeys[i]] += parseFloat(site[numberKeys[i]]); 
        }
      }
    }); 

    for (var key in countryData) {
      for (var i in numberKeys) {
        countryData[key][numberKeys[i]] =  (countryData[key][numberKeys[i]] / 
        countryData[key].Sitenumber).toFixed(2);
      }
    }
    var hash = window.location.hash;
    var hashValue = hash.substring(hash.indexOf('#')+1);
    if (hashValue in countryData) {
      showDetail({id: hashValue});
    }
    else {
      draw(countryData);
    }
  }
  
  function draw(data) {
    var numberOfRain = 0;
    var maxRainValue = 0;
    removeBackground();
    countryOrder.forEach(function(key) {
      $('.mychart').append(
        '<div class="raindrop" id="'+ key + '">' + '<h3>' + key + '</h3>' +
        '<h6>10分鐘平均累積雨量<br/>' + colorlize(data[key].Rainfall10min) + '</h6>' +
        '<h6>1小時平均累積雨量<br/>' + colorlize(data[key].Rainfall1hr) + '</h6>' +
        '<h6>日平均累積雨量<br/>' + colorlize(data[key].Rainfall24hr) + '</h6>' +
        '<a href="#title" class="btn-more" onClick=showDetail(' + key + ')>點擊觀看</a></div>' 
      );

      if (Math.round(10*data[key].Rainfall1hr) !== 0) {
        createRainDrop('#'+key, getOptions(data[key].Rainfall10min, data[key].Rainfall24hr));
        numberOfRain += 1;
        if (data[key].Rainfall10min > maxRainValue) {
          maxRainValue = data[key].Rainfall10min;
        }
      }
      addTick('#'+key);
    });
    if (numberOfRain > 4 || maxRainValue >= 2) {
      setBackground('rain', '', maxRainValue);
    }
    else {
      setBackground('sunny', '');
    }
  }

  function addTick(id) {
    var width = $(id).width();
    var height = $(id).height();
    var svg = d3.select(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("position", 'absolute');

    var yScale = d3.scale.linear()
                .range([height, 0])
                .domain([0, 500]);
      //Define Y axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(5);
    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(30,0)")
        .call(yAxis); 
  }

  function colorlize(value) {
    if (value > 0) 
      return '<span class="red">' + value + '</span>';
    return value;
  }

  function createRainDrop(id, options) {
    options = options || {};
    var raindrop = $(id).raindrops(options);
  }

  function getOptions(rainValue10min, rainValue24hr) {
    var canvasHeight = rainValue24hr;
    var density = 0.01;
    var rippleSpeed = 0.01;
    var frequency;
    var color = 'rgb(23, 139, 202)';
    var waveHeight = 40;
    var waveLength = 400;

    if (rainValue10min < 1) {
      frequency = 5 * rainValue10min;
    }
    else if (rainValue10min < 5) {
      color = 'rgb(23, 139, 202)';
      frequency = 10 * rainValue10min/5; 
    }
    else if (rainValue10min < 10) {
      color = 'rgb(23, 139, 202)';
      waveLength = 200;
      frequency = 15*rainValue10min/10;
      waveHeight = 80;
    }
    else if (rainValue10min < 15) {
      color = '#f2711c';
      waveLength = 200;
      frequency = 20*rainValue10min/15;
      waveHeight = 90;
    }
    else if (rainValue10min < 20) {
      color = '#f2711c';
      waveLength = 200;
      waveHeight = 90;
      frequency = 25*rainValue10min/20;
    }
    else {
      color = '#DB2828';
      frequency = 30;
      waveLength = 180;
      waveHeight = 100;
      $('span').removeClass('red');
    }
    if (canvasHeight > 500) {
      canvasHeight = 500;
    }

    return {
      color: color,
      waveLength: waveLength,
      frequency: frequency,
      waveHeight: waveHeight,
      density: 0.04, 
      canvasHeight: canvasHeight
    };

  }

  function showDetail(county) {
    var sites = [];
    data.forEach(function(site) {
      if (site.County === county.id) sites.push(site); 
    });
    $('.mychart').empty();
    drawDetail(sites);
  }

  function drawDetail(data) {
    var numberOfRain = 0;
    var maxRainValue = 0;
    removeBackground();

    data.forEach(function(site) {
      var name = site.SiteName.replace(/[()]/g, '-');
      $('.mychart').append('<div class="raindrop" id="'+ site.SiteId + '">' +
        '<h3 class="sitename">' + name + '（' + site.Township + '）</h3>' +
        '<h6>10分鐘累積雨量<br/>' + colorlize(site.Rainfall10min) + '</h6>' +
        '<h6>1小時累積雨量<br/>' + colorlize(site.Rainfall1hr) + '</h6>' +
        '<h6>日累積雨量<br/>' + colorlize(site.Rainfall24hr) + '</h6>' +
        '<a href="#' +  site.County + '" class="btn-back" onClick=goBack()>返回</a></div>' 
      );
      if (Math.round(10*site.Rainfall1hr) !== 0) {
        createRainDrop('#'+site.SiteId, getOptions(site.Rainfall10min, site.Rainfall24hr));
        numberOfRain += 1;
        if (site.Rainfall10min > maxRainValue) {
          maxRainValue = site.Rainfall10min;
        }
      }
    });
    var minRains = data.length * 1 / 4;
    if (numberOfRain > minRains || maxRainValue > 2) {
      setBackground('rain', data[0].County, maxRainValue);
    }
    else {
      setBackground('sunny', data[0].County);
    }
    setTimeout(function() { window.location.hash = data[0].County;}, 1000);
  }

  function goBack() {
    $('.mychart').empty();
    draw(countryData);
    setTimeout(function() { window.location.hash = ''; }, 1000);
  }

})(window);
