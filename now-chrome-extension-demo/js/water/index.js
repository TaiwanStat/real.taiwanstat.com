(function() {
  d3.json('./data.json', function(error, data) {
      visualize(data);
  });

  function visualize (data) {
    var configs = {};
    data.forEach(function(reservoir) {
       var reservoirName = reservoir.name;
       var percentage = parseFloat(reservoir.percentage).toFixed(1);
       var updateAt = reservoir.updateAt;
       var volumn = reservoir.volumn;
       var id = reservoir.id;
       var netFlow = -parseFloat(reservoir.daliyNetflow).toFixed(1);
       var netPercentageVar;
       var state;

       if (isNaN(percentage)) {
         return;
       }

       configs[reservoirName] = liquidFillGaugeDefaultSettings();
       configs[reservoirName].waveAnimate = true;
       configs[reservoirName].waveAnimateTime = setAnimateTime(percentage);
       configs[reservoirName].waveOffset = 0.3;
       configs[reservoirName].waveHeight = 0.05;
       configs[reservoirName].waveCount = setWavaCount(percentage);
       setColor(configs[reservoirName], percentage);
      
       // create svg
       $('#water').append('<div class="reservoir">' + '<h4>' + reservoirName + '</h4>' +
                          '<svg id="' + id + '">' + '</svg>' +
                          '<span class="volumn"><h5></h5></span>' +
                          '<span class="state"><h5></h5></span></div>');
       // draw
       loadLiquidFillGauge(id, percentage, configs[reservoirName]);

       // set text
       netPercentageVar = ((netFlow) / parseFloat(reservoir.baseAvailable)*100).toFixed(2);
       if (isNaN(netFlow)) {
          $('#'+id).siblings('.state')
                .children('h5')
                .text('昨日水量狀態：待更新');
       }
       else if (netFlow < 0) {
         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量下降：'+ netPercentageVar + '%');
         $('#'+id).siblings('.state').addClass('red');
       }
       else {
         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量上升：'+ netPercentageVar + '%');
         $('#'+id).siblings('.state').addClass('blue');
       }
   
       $('#'+id).siblings('.volumn').children('h5').text('有效蓄水量：'+volumn+'萬立方公尺');
    });
  }

  function setColor(config, percentage) {
    if (percentage < 25) {
      config.circleColor = "#FF7777";
      config.textColor = "#FF4444";
      config.waveTextColor = "#FFAAAA";
      config.waveColor = "#FFDDDD";
    }
    else if (percentage < 50) {
      config.circleColor = "rgb(255, 160, 119)";
      config.textColor = "rgb(255, 160, 119)";
      config.waveTextColor = "rgb(255, 160, 119)";
      config.waveColor = "rgba(245, 151, 111, 0.48)";
    }
  }

  function setWavaCount(percentage) {
    if (percentage > 75) {
      return 3;
    }
    else if (percentage > 50) {
      return 2;
    }
    return 1;
  }

  function setAnimateTime(percentage) {
    if (percentage > 75) {
      return 2000;
    }
    else if (percentage > 50) {
      return 3000;
    }
    else if (percentage > 25) {
      return 4000;
    }
    return 5000;
  }

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

})();
