(function(window) {

  var countryData = {};

  d3.json('./rain.json', function(_data) {
    draw([_data[0]]);
  });


  function draw(data) {
    var numberOfRain = 0;
    var maxRainValue = 0;

    data.forEach(function(site) {
      var name = site.SiteName.replace(/[()]/g, '-');
      $('#rain').append('<div class="raindrop" id="A'+ site.SiteId + '">' +
        '<h3 class="sitename">' + name + '（' + site.Township + '）</h3>' +
        '<h5>10分鐘累積雨量<br/>' + colorlize(site.Rainfall10min) + '</h5>' +
        '<h5>1小時累積雨量<br/>' + colorlize(site.Rainfall1hr) + '</h5>' +
        '<h5>日累積雨量<br/>' + colorlize(site.Rainfall24hr) + '</h5></div>'
      );
      if (Math.round(10*site.Rainfall24hr) !== 0) {
        createRainDrop('#A'+site.SiteId, getOptions(site.Rainfall10min, site.Rainfall24hr));
        numberOfRain += 1;
        if (site.Rainfall10min > maxRainValue) {
          maxRainValue = site.Rainfall10min;
        }
      }
      addTick('#A'+site.SiteId);
    });
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
                      .tickPadding(0)
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
    var canvasHeight = rainValue24hr*1.25;
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



})(window);
