(function() {

	var gauges = [];
  var powerLoadData;
  var reserveSupply;
  var reserveLoadRate;
  var areaMaxSupply = [];
  var areaMinSupply = [];
  var ids = ["NorthGaugeContainer", 'CenterGaugeContainer',
      'SouthGaugeContainer', 'EastGaugeContainer'];
  var colors = ["#7BF02A", "#FDCA00", "#ED2F03"]; // Green, Yellow, Red;
  var people_amount = [10540288, 5799473, 6305750, 557162, 23202673]; // 北部、中部、南部、東部、全台
  var totalSupply = 0;
  var totalUsage = 0;
  var regions = ['北部', '中部', '南部', '東部'];
  var areaSupplyRate = [0.35, 0.33, 0.32, 0.022];
  var people = [];

  $( document ).ready(function() {

    d3.json('./power.json', function(_data) {
      var regionData = _data.regionData;
      $('#power').append('<svg id="battery"></svg><div>備轉容量率：<span class="load-rate"></span></div>');
      loadReserveData(_data, _data.reserveData);
    });
  });

  function loadReserveData (data, loadReserve) {
      powerLoadData = [loadReserve.reserveLoad, loadReserve.reserveSupply, 
        loadReserve.updateTime];
      reserveSupply = powerLoadData[1];
      reserveLoad = powerLoadData[0];
      reserveLoadRate = ((reserveSupply-reserveLoad)/reserveLoad)*100;
      reserveLoadRate = reserveLoadRate.toFixed(2);
      $('.load-rate').text(reserveLoadRate + '％');
      var percentage = (reserveLoadRate/15).toFixed(2);

      if (reserveLoadRate >= 10) {
        $('.state-note').text('供電狀況：供電充裕，系統供電餘裕充足。');
        visualBattery('#battery', percentage, colors[0]);
      }
      else if (reserveLoadRate > 6 && reserveLoadRate < 10) {
        $('.state-note').text('供電狀況：供電吃緊，系統供電餘裕緊澀');
        visualBattery('#battery', percentage, colors[1]);
        $('.state-note').addClass('red');
      }
      else if (reserveLoadRate <= 6) {
        $('.state-note').text('供電狀況：供電警戒，系統限電機率增加。');
        $('.state-note').addClass('red');
        visualBattery('#battery', percentage, colors[2]);
      }
  }


  
  function visualBattery (id, percentage, color) {
    
    // container
    d3.select(id)
        .append("rect")
        .attr("width", 110)
        .attr("height", 60)
        .attr("stroke", "rgb(198, 202, 203)")
        .attr("stroke-width", "5px")
        .attr("x", 5)
        .attr("y", 5)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "transparent");

     // content
     d3.select(id)
        .append("rect")
        .attr("width", 100*percentage)
        .attr("height", 45)
        .attr("x", 10)
        .attr("y", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .style("fill", color);
  
     d3.select(id)
        .append("rect")
        .attr("width", 8)
        .attr("height", 20)
        .attr("x", 117)
        .attr("y", 20)
        .attr("rx", 2)
        .attr("ry", 1)
        .style("fill", 'rgb(198, 202, 203)');
 

     d3.select(id)
        .append("svg:text")
        .attr("width", 8)
        .attr("height", 20)
        .attr("x", 50)
        .attr("y", 40)
        .attr("rx", 2)
        .attr("ry", 1)
        .text(Math.round(percentage*100) + '%')
        .style("fill", 'rgb(255, 255, 255)');

  }


})();
