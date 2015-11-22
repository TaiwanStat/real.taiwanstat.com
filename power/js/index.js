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

  people_amount.forEach(function(a) {
    people.push(zhutil.annotate(a) + " 人");
  });

  $( document ).ready(function() {

    //var myFirebaseRef = new Firebase("https://realtaiwanstat2.firebaseio.com");
    //myFirebaseRef.child("power_4").limitToLast(1).on("child_added", function(snapshot) {
    //  var text = snapshot.val();  
    //  var data = d3.csv.parseRows(text)[0];
    var api = "http://52.69.145.204:3000/powers/latest";
    d3.json(api, function(_data) {
      var regionData = _data.regionData;
      var data = [
        regionData.updateTime, regionData.northSupply,regionData.northUsage,
        regionData.centerSupply, regionData.centerUsage,
        regionData.southSupply, regionData.southUsage,
        regionData.eastSupply, regionData.eastUsage
      ];
      var id;
      var perUsage;

      for (var i = 1; i < data.length; ++i) {
        data[i] = (+data[i]);
        region = Math.round(i/2)-1;

        if (i % 2 === 0) {
          perUsage = Math.round(data[i]*10000/people_amount[region]*1000);
          
          $('#'+ids[region]).siblings('.usage')
                 .children('h5')
                 .text(regions[region]+'即時用電量：' + data[i] + '萬瓩');
        
          $('#'+ids[region]).siblings('.person')
                 .children('h5')
                 .text('區域人均耗電量：' + perUsage + '瓦');

          totalUsage += data[i];
        }
        else {
          $('#'+ids[region]).siblings('.supply')
                 .children('h5')
                 .text(regions[region]+'即時發電量：' + data[i] + '萬瓩');
          totalSupply += data[i];
        }
      }

      loadReserveData(data, _data.reserveData);
    });
  });

  function loadReserveData (data, loadReserve) {
      powerLoadData = [loadReserve.reserveLoad, loadReserve.reserveSupply, 
        loadReserve.updateTime];
      reserveSupply = powerLoadData[1];
      reserveLoad = powerLoadData[0];
      reserveLoadRate = ((reserveSupply-reserveLoad)/reserveLoad)*100;
      reserveLoadRate = reserveLoadRate.toFixed(2);
      $('.update-at').text('更新時間：' + powerLoadData[2] + '（每小時更新）');
      $('.load-rate').text(reserveLoadRate + '％');
      
      for (var i in areaSupplyRate) {
        areaMaxSupply.push(Math.round(areaSupplyRate[i]*reserveSupply));
        areaMinSupply.push(Math.round(areaSupplyRate[i]*0.5*reserveSupply));
        if (i < 3) {
          $('#'+ids[i]).siblings('.max-supply')
               .children('h5')
               .text('預估區域最大供電能力：' + areaMaxSupply[i].toFixed(1) + '萬瓩');
        }
          $('#'+ids[i]).siblings('.supply-people')
              .children('h5')
              .text('供給人數：' + people[+i]);
      }
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

      createGauges(data);
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
        .style("fill", 'rgb(137, 137, 137)');

  }

	function createGauge(id, label, min, max) {
		var config = {
			size: 300,
			label: label,
			min: undefined !== min ? min : 0,
			max: undefined !== max ? max : 100,
			minorTicks: 5
		};

		var range = config.max - config.min;
		config.greenZones = [{ from: config.min, to: config.min + range*0.5 }];
		config.yellowZones = [{ from: config.min + range*0.5, to: config.min + range*0.8 }];
		config.redZones = [{ from: config.min + range*0.8, to: config.max }];

		gauges[id] = new Gauge(id, config);
		gauges[id].render();
	}

	function createGauges(data) {
    var minValues = [];

	  for (var i in ids) {
		  createGauge(ids[i], regions[i]+"用電", areaMinSupply[i], areaMaxSupply[i]);
    }

    createTaiwanGauge();
    setGaugeValue(data);
    //setTimeout(function() { setGaugeValue(data);}, 1000);
  }

  function setGaugeValue(data) {
    var i = 1;
    for (var key in gauges) {
      var value = 10;
      gauges[key].redraw(data[i*2]);
      i+=1;
    }
    gauges.TwGaugeContainer.redraw(totalUsage);
  }
  
  function createTaiwanGauge() {
    var id = 'TwGaugeContainer';
    var perUsage = Math.round(totalUsage*10000/people_amount[4]*1000);

		createGauge(id, "全台灣用電", Math.round(reserveSupply*0.5), Math.round(reserveSupply));
    $('#'+id).siblings('.usage')
               .children('h5')
               .text('全台灣即時用電量：' + totalUsage.toFixed(1) + '萬瓩');
    if (totalUsage > totalSupply) {
      totalSupply = totalUsage;
    }
    
    $('#'+id).siblings('.supply')
               .children('h5')
               .text('全台灣即時發電量：' + totalSupply.toFixed(1) + '萬瓩');
    
    $('#'+id).siblings('.person')
           .children('h5')
           .text('台灣人均耗電量：' + perUsage + '瓦');
    
    $('#'+id).siblings('.max-supply')
               .children('h5')
               .text('預估今天最大供電能力：' + Math.round(reserveSupply) + '萬瓩');
    
    $('#'+id).siblings('.supply-people')
              .children('h5')
              .text('供給人數：' + people[4]);
  }


})();
