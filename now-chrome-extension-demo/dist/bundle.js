(function() {
  var image = document.createElement('img');
    image.id = 'background';
    image.crossOrigin = 'anonymous';
    document.body.appendChild(image);
  image.src = './images/background.jpg';
})();

(function() {

  d3.json('./air.json', function(data) { 
    data = data[0];
    $('#pm2_5').append('<div id="' + data.site_id + '">' +
                      '<span class="site_name"><h4>' + data.SiteName + '</h4></span>' +
                      '<div class="status"></div>' +
                      '<img class="status_img" src="../PM2.5/images/pm2.5-wait.png">' + 
                      '<span class="pm25"><h5>PM2.5：</h5></span>' +
                     '</div>');

    if (parseInt(data.PM2_5) <= 11) {
      $('#' + data.site_id + ' .status').attr('class', 'ui green tag label status').text('低');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-1.png');
    }
    else if (parseInt(data.PM2_5) <= 23) {
      $('#' + data.site_id + ' .status').attr('class', 'ui green tag label status').text('低');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-2.png');
    }
    else if (parseInt(data.PM2_5) <= 35) {
      $('#' + data.site_id + ' .status').attr('class', 'ui green tag label status').text('低');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-3.png');
    }
    else if (parseInt(data.PM2_5) <= 41) {
      $('#' + data.site_id + ' .status').attr('class', 'ui yellow tag label status').text('中');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-4.png');
    }
    else if (parseInt(data.PM2_5) <= 47) {
      $('#' + data.site_id + ' .status').attr('class', 'ui orange tag label status').text('中');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-5.png');
    }
    else if (parseInt(data.PM2_5) <= 53) {
      $('#' + data.site_id + ' .status').attr('class', 'ui orange tag label status').text('中');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-6.png');
    }
    else if (parseInt(data.PM2_5) <= 58) {
      $('#' + data.site_id + ' .status').attr('class', 'ui red tag label status').text('高');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-7.png');
    }
    else if (parseInt(data.PM2_5) <= 64) {
      $('#' + data.site_id + ' .status').attr('class', 'ui red tag label status').text('高');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-8.png');
    }
    else if (parseInt(data.PM2_5) <= 70) {
      $('#' + data.site_id + ' .status').attr('class', 'ui black tag label status').text('高');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-9.png');
    }
    else if (parseInt(data.PM2_5) >= 71) {
      $('#' + data.site_id + ' .status').attr('class', 'ui purple tag label status').text('非常高');
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-10.png');
    }
    else if (isNaN(parseInt(data.PM2_5))) {
      $('#' + data.site_id + ' .status_img').attr('src', 'images/PM2.5-wait.png');
    }

    if (isNaN(parseInt(data.PM2_5))) {
      $('#' + data.site_id + ' .pm25').children('h5')
      .text("PM2.5：待更新");
    }
    else {
      $('#' + data.site_id + ' .pm25').children('h5')
      .text("PM2.5： " + data.PM2_5 + " μg/m").append('<sup>3</sup>');
    }
  });
})();

function Gauge(placeholderName, configuration)
{
  this.placeholderName = placeholderName;
  
  var self = this; // for internal d3 functions
  
  this.configure = function(configuration)
  {
    this.config = configuration;
    
    this.config.size = this.config.size * 0.9;
    
    this.config.raduis = this.config.size * 0.97 / 2;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;
    
    this.config.min = undefined != configuration.min ? configuration.min : 0; 
    this.config.max = undefined != configuration.max ? configuration.max : 100; 
    this.config.range = this.config.max - this.config.min;
    
    this.config.majorTicks = configuration.majorTicks || 5;
    this.config.minorTicks = configuration.minorTicks || 2;
    
    this.config.greenColor  = configuration.greenColor || "#109618";
    this.config.yellowColor = configuration.yellowColor || "#FF9900";
    this.config.redColor  = configuration.redColor || "#DC3912";
    
    this.config.transitionDuration = configuration.transitionDuration || 500;
  }

  this.render = function()
  {
    this.body = d3.select("#" + this.placeholderName)
              .append("svg:svg")
              .attr("class", "gauge")
              .attr("width", this.config.size)
              .attr("height", this.config.size);
    
    this.body.append("svg:circle")
          .attr("cx", this.config.cx)
          .attr("cy", this.config.cy)
          .attr("r", this.config.raduis)
          .style("fill", "#ccc")
          .style("stroke", "#000")
          .style("stroke-width", "0.5px");
          
    this.body.append("svg:circle")
          .attr("cx", this.config.cx)
          .attr("cy", this.config.cy)
          .attr("r", 0.9 * this.config.raduis)
          .style("fill", "#fff")
          .style("stroke", "#e0e0e0")
          .style("stroke-width", "2px");
          
    for (var index in this.config.greenZones)
    {
      this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
    }
    
    for (var index in this.config.yellowZones)
    {
      this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
    }
    
    for (var index in this.config.redZones)
    {
      this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
    }
    
    if (undefined != this.config.label)
    {
      var fontSize = Math.round(this.config.size / 9);
      this.body.append("svg:text")
            .attr("x", this.config.cx)
            .attr("y", this.config.cy / 2 + fontSize / 2)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
            .text(this.config.label)
            .style("font-size", 18 + "px") // label font-size 
            .style("fill", "#333")
            .style("stroke-width", "0px");
    }
    
    var fontSize = Math.round(this.config.size / 16);
    var majorDelta = this.config.range / (this.config.majorTicks - 1);
    for (var major = this.config.min; major <= this.config.max; major += majorDelta)
    {
      var minorDelta = majorDelta / this.config.minorTicks;
      for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
      {
        var point1 = this.valueToPoint(minor, 0.75);
        var point2 = this.valueToPoint(minor, 0.85);
        
        this.body.append("svg:line")
              .attr("x1", point1.x)
              .attr("y1", point1.y)
              .attr("x2", point2.x)
              .attr("y2", point2.y)
              .style("stroke", "#666")
              .style("stroke-width", "1px");
      }
      
      var point1 = this.valueToPoint(major, 0.7);
      var point2 = this.valueToPoint(major, 0.85);  
      
      this.body.append("svg:line")
            .attr("x1", point1.x)
            .attr("y1", point1.y)
            .attr("x2", point2.x)
            .attr("y2", point2.y)
            .style("stroke", "#333")
            .style("stroke-width", "2px");
      
      if (major == this.config.min || major == this.config.max)
      {
        var point = this.valueToPoint(major, 0.63);
        
        this.body.append("svg:text")
              .attr("x", point.x)
              .attr("y", point.y)
              .attr("dy", fontSize / 3)
              .attr("text-anchor", major == this.config.min ? "start" : "end")
              .text(major)
              .style("font-size", fontSize + "px")
              .style("fill", "#333")
              .style("stroke-width", "0px");
      }
    }
    
    var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
    
    var midValue = (this.config.min + this.config.max) / 2;
    
    var pointerPath = this.buildPointerPath(midValue);
    
    var pointerLine = d3.svg.line()
                  .x(function(d) { return d.x })
                  .y(function(d) { return d.y })
                  .interpolate("basis");
    
    pointerContainer.selectAll("path")
              .data([pointerPath])
              .enter()
                .append("svg:path")
                  .attr("d", pointerLine)
                  .style("fill", "#dc3912")
                  .style("stroke", "#c63310")
                  .style("fill-opacity", 0.7)
          
    pointerContainer.append("svg:circle")
              .attr("cx", this.config.cx)
              .attr("cy", this.config.cy)
              .attr("r", 0.12 * this.config.raduis)
              .style("fill", "#4684EE")
              .style("stroke", "#666")
              .style("opacity", 1);
    
    var fontSize = Math.round(this.config.size / 10);
    pointerContainer.selectAll("text")
              .data([midValue])
              .enter()
                .append("svg:text")
                  .attr("x", this.config.cx)
                  .attr("y", this.config.size - this.config.cy / 4 - fontSize + 5)
                  .attr("dy", fontSize / 2)
                  .attr("text-anchor", "middle")
                  .style("font-size", 16 + "px") // ValueText
                  .style("fill", "rgb(244, 0, 0)")
                  .style("font-weight", "700")
                  .style("stroke-width", "0px");
    
    this.redraw(this.config.min, 0);
  }
  
  this.buildPointerPath = function(value)
  {
    var delta = this.config.range / 13;
    
    var head = valueToPoint(value, 0.85);
    var head1 = valueToPoint(value - delta, 0.12);
    var head2 = valueToPoint(value + delta, 0.12);
    
    var tailValue = value - (this.config.range * (1/(270/360)) / 2);
    var tail = valueToPoint(tailValue, 0.28);
    var tail1 = valueToPoint(tailValue - delta, 0.12);
    var tail2 = valueToPoint(tailValue + delta, 0.12);
    
    return [head, head1, tail2, tail, tail1, head2, head];
    
    function valueToPoint(value, factor)
    {
      var point = self.valueToPoint(value, factor);
      point.x -= self.config.cx;
      point.y -= self.config.cy;
      return point;
    }
  }
  
  this.drawBand = function(start, end, color)
  {
    if (0 >= end - start) return;
    
    this.body.append("svg:path")
          .style("fill", color)
          .attr("d", d3.svg.arc()
            .startAngle(this.valueToRadians(start))
            .endAngle(this.valueToRadians(end))
            .innerRadius(0.65 * this.config.raduis)
            .outerRadius(0.85 * this.config.raduis))
          .attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
  }
  
  this.redraw = function(value, transitionDuration)
  {
    var pointerContainer = this.body.select(".pointerContainer");
    
    pointerContainer.selectAll("text").text(Math.round(value) + '萬瓩'); // setValueText
    
    var pointer = pointerContainer.selectAll("path");
    pointer.transition()
          .duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
          //.delay(0)
          //.ease("linear")
          //.attr("transform", function(d) 
          .attrTween("transform", function()
          {
            var pointerValue = value;
            if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
            else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
            var targetRotation = (self.valueToDegrees(pointerValue) - 90);
            var currentRotation = self._currentRotation || targetRotation;
            self._currentRotation = targetRotation;
            
            return function(step) 
            {
              var rotation = currentRotation + (targetRotation-currentRotation)*step;
              return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
            }
          });
  }
  
  this.valueToDegrees = function(value)
  {
    // thanks @closealert
    //return value / this.config.range * 270 - 45;
    return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
  }
  
  this.valueToRadians = function(value)
  {
    return this.valueToDegrees(value) * Math.PI / 180;
  }
  
  this.valueToPoint = function(value, factor)
  {
    return {  x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
          y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value))    };
  }
  
  // initialization
  this.configure(configuration);  
}

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

!function(t,r){t.exports;(function(){function r(t,r){for(var n=-1,e=r.length>>>0;++n<e;)if(t===r[n])return!0;return!1}var n,e,i,o,l,u,a,f,s,c,h,p,g,v,x,d,b="".replace;for(n=["○","一","二","三","四","五","六","七","八","九"],e=["零","壹","貳","參","肆","伍","陸","柒","捌","玖"],o={},l=0,u=n.length;u>l;++l)a=l,f=n[l],o[f]=a;i=o,c=function(){var t,r,i,o={};for(t=0,i=(r=n).length;i>t;++t)a=t,f=r[t],o[e[a]]=f;return o}(),c["０"]="○",c["兩"]="二",c["拾"]="十",c["佰"]="百",c["仟"]="千",s=c,h={"十":10,"百":100,"千":1e3,"萬":1e4,"億":Math.pow(10,8),"兆":Math.pow(10,12)},p=["萬","億","兆"],g=function(t){var r;return r=parseInt(b.call(t,",","")),isNaN(r)?void 0:r},v=function(t){var n,e,o,l,u,a,f;for(n=0,e=0,o=0,l=0,a=(u=t.split("")).length;a>l;++l)f=u[l],null!=s[f]&&(f=s[f]),f in i?o=i[f]:r(f,p)?(n+=(e+o)*h[f],e=0,o=0):("十"===f&&0===o&&(o=1),e+=o*h[f],o=0);return n+e+o},x=function(t){var r,n,e,i,o,l;if("string"==typeof t){if(r=g(t),void 0===r)return t;t=r}for(n="",e=0,o=(i=p).length;o>e&&(l=i[e],n=t%1e4+n,t=Math.floor(t/1e4),t>0);++e)n=l+n;return n},d=function(t,r){var n,e,i,o,l,u,a,f,s;if("string"==typeof t){if(n=g(t),void 0===n)return t;t=n}if(null==r.base){if(e=t.toString(),i=Math.floor(e.length/4),1>i)return e;o=p[i-1]}else o=r.base;return l=null!=(u=r.smart)?u:!0,a=null!=(u=r.extra_decimal)?u:0,null!=r.extra_decimal&&(l=!1),t=x(t),f=t.indexOf(o),0>f?t:(s=t.substr(0,f),l&&s.length<2&&0===a&&(a=1),a>0&&(s+="."+t.substr(f+1,a)),s+o)},t.exports={parseZHNumber:v,annotate:x,approximate:d}}).call(this),r.zhutil=t.exports}({exports:{}},function(){return this}());
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

function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.transition()
            .duration(config.waveAnimateTime)
            .ease("linear")
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .each("end", function(){
                wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                animateWave(config.waveAnimateTime);
            });
    }
}

/*
 *  Query UI plugin for raindrops on water effect.
 *  https://github.com/d-harel/raindrops.git
 */
$.widget("water.raindrops", {
  options: {
    waveLength: 340, // Wave Length. A numeric value. The higher the number, the smaller the wave length.
    canvasWidth: 0, // Width of the  water. Default is 100% of the parent's width
    canvasHeight: 0, // Height of the water. Default is 50% of the parent's height 
    color: '#00aeef', // Water Color
    frequency: 3, // Raindrops frequency. Higher number means more frequent raindrops.
    waveHeight: 100, // Wave height. Higher number means higher waves created by raindrops.
    density: 0.02, // Water density. Higher number means shorter ripples.
    rippleSpeed: 0.1, // Speed of the ripple effect. Higher number means faster ripples.
    rightPadding: 20, // To cover unwanted gaps created by the animation.
    position: 'absolute',
    positionBottom: 0,
    positionLeft: 0
  },
  _create: function() {
    var canvas = window.document.createElement('canvas');
    if (!this.options.canvasHeight) {
      this.options.canvasHeight = this.element.height() / 2;
    }
    if (!this.options.canvasWidth) {
      this.options.canvasWidth = this.element.width();
    }
    this.options.realWidth = this.options.canvasWidth + this.options.rightPadding;
    canvas.height = this.options.canvasHeight;
    canvas.width = this.options.realWidth;

    this.ctx = canvas.getContext('2d');
    this.ctx.fillStyle = this.options.color;
    this.element.append(canvas);
    canvas.parentElement.style.overflow = 'hidden';
    canvas.parentElement.style.position = 'relative';
    canvas.style.position = this.options.position;
    canvas.style.bottom = this.options.positionBottom;
    canvas.style.left = this.options.positionLeft;

    this.springs = [];
    for (var i = 0; i < this.options.waveLength; i++) {
      this.springs[i] = new this.Spring();
    }

    raindropsAnimationTick(this);
  },
  Spring: function() {
    this.p = 0;
    this.v = 0;
    //this.update = function (damp, tens)
    this.update = function(density, rippleSpeed) {
      //this.v += (-tens * this.p - damp * this.v);
      this.v += (-rippleSpeed * this.p - density * this.v);
      this.p += this.v;
    };
  },
  updateSprings: function(spread) {
    var i;
    for (i = 0; i < this.options.waveLength; i++) {
      //this.springs[i].update(0.02, 0.1);
      this.springs[i].update(this.options.density, this.options.rippleSpeed);
    }

    var leftDeltas = [],
      rightDeltas = [];

    for (var t = 0; t < 8; t++) {

      for (i = 0; i < this.options.waveLength; i++) {
        if (i > 0) {
          leftDeltas[i] = spread * (this.springs[i].p - this.springs[i - 1].p);
          this.springs[i - 1].v += leftDeltas[i];
        }
        if (i < this.options.waveLength - 1) {
          rightDeltas[i] = spread * (this.springs[i].p - this.springs[i + 1].p);
          this.springs[i + 1].v += rightDeltas[i];
        }
      }

      for (i = 0; i < this.options.waveLength; i++) {
        if (i > 0)
          this.springs[i - 1].p += leftDeltas[i];
        if (i < this.options.waveLength - 1)
          this.springs[i + 1].p += rightDeltas[i];
      }

    }

  },
  renderWaves: function() {
    var i;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.options.canvasHeight);
    for (i = 0; i < this.options.waveLength; i++) {
      this.ctx.lineTo(i * (this.options.realWidth / this.options.waveLength), (this.options.canvasHeight / 2) + this.springs[i].p);
    }
    this.ctx.lineTo(this.options.realWidth, this.options.canvasHeight);
    this.ctx.fill();
  }
});

function raindropsAnimationTick(drop) {
  var fps = 60;

  if (!document.contains(drop.element[0])) return;

  if (isInView($('#' + drop.element[0].id))) {

    if ((Math.random() * 100) < drop.options.frequency)
      drop.springs[Math.floor(Math.random() * drop.options.waveLength)].p = drop.options.waveHeight;

    drop.ctx.clearRect(0, 0, drop.options.realWidth, drop.options.canvasHeight);
    drop.updateSprings(0.1);
    drop.renderWaves();
  }

  setTimeout(function() {
    requestAnimationFrame(function() {
      raindropsAnimationTick(drop);
    }, 2000 / fps);
  });
}

function isInView(el) {
  var win = $(window);
  var viewport = {
    top: win.scrollTop(),
    left: win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  var bounds = el.offset();
  bounds.right = bounds.left + el.outerWidth();
  bounds.bottom = bounds.top + el.outerHeight();

  return (!(viewport.right < bounds.left || viewport.left > bounds.right ||
    viewport.bottom < bounds.top || viewport.top > bounds.bottom));
}

/*!
 * rainyday.js v0.1.2 - https://github.com/maroslaw/rainyday.js
 * Copyright (c) 2015 Marek Brodziak
 * Licensed under the GPLv2 license
 */
function RainyDay(a,b){if(this===window)return new RainyDay(a,b);this.img=a.image;var c={opacity:1,blur:10,crop:[0,0,this.img.naturalWidth,this.img.naturalHeight],enableSizeChange:!0,parentElement:document.getElementsByTagName("body")[0],fps:30,fillStyle:"#8ED6FF",enableCollisions:!0,gravityThreshold:3,gravityAngle:Math.PI/2,gravityAngleVariance:0,reflectionScaledownFactor:5,reflectionDropMappingWidth:200,reflectionDropMappingHeight:200,width:this.img.clientWidth,height:this.img.clientHeight,position:"absolute",top:0,left:0};for(var d in c)"undefined"==typeof a[d]&&(a[d]=c[d]);this.options=a,this.drops=[],this.canvas=b||this.prepareCanvas(),this.prepareBackground(),this.prepareGlass(),this.reflection=this.REFLECTION_MINIATURE,this.trail=this.TRAIL_DROPS,this.gravity=this.GRAVITY_NON_LINEAR,this.collision=this.COLLISION_SIMPLE,this.setRequestAnimFrame()}function Drop(a,b,c,d,e){this.x=Math.floor(b),this.y=Math.floor(c),this.r=Math.random()*e+d,this.rainyday=a,this.context=a.context,this.reflection=a.reflected}function BlurStack(){this.r=0,this.g=0,this.b=0,this.next=null}function CollisionMatrix(a,b,c){this.resolution=c,this.xc=a,this.yc=b,this.matrix=new Array(a);for(var d=0;a+5>=d;d++){this.matrix[d]=new Array(b);for(var e=0;b+5>=e;++e)this.matrix[d][e]=new DropItem(null)}}function DropItem(a){this.drop=a,this.next=null}RainyDay.prototype.prepareCanvas=function(){var a=document.createElement("canvas");return a.style.position=this.options.position,a.style.top=this.options.top,a.style.left=this.options.left,a.width=this.options.width,a.height=this.options.height,this.options.parentElement.appendChild(a),this.options.enableSizeChange&&this.setResizeHandler(),a},RainyDay.prototype.setResizeHandler=function(){null!==window.onresize?window.setInterval(this.checkSize.bind(this),100):(window.onresize=this.checkSize.bind(this),window.onorientationchange=this.checkSize.bind(this))},RainyDay.prototype.checkSize=function(){var a=this.img.clientWidth,b=this.img.clientHeight,c=this.img.offsetLeft,d=this.img.offsetTop,e=this.canvas.width,f=this.canvas.height,g=this.canvas.offsetLeft,h=this.canvas.offsetTop;(e!==a||f!==b)&&(this.canvas.width=a,this.canvas.height=b,this.prepareBackground(),this.glass.width=this.canvas.width,this.glass.height=this.canvas.height,this.prepareReflections()),(g!==c||h!==d)&&(this.canvas.offsetLeft=c,this.canvas.offsetTop=d)},RainyDay.prototype.animateDrops=function(){if(document.contains(this.canvas)){this.addDropCallback&&this.addDropCallback();for(var a=this.drops.slice(),b=[],c=0;c<a.length;++c)a[c].animate()&&b.push(a[c]);this.drops=b,window.requestAnimFrame(this.animateDrops.bind(this))}},RainyDay.prototype.setRequestAnimFrame=function(){var a=this.options.fps;window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(b){window.setTimeout(b,1e3/a)}}()},RainyDay.prototype.prepareReflections=function(){this.reflected=document.createElement("canvas"),this.reflected.width=this.canvas.width/this.options.reflectionScaledownFactor,this.reflected.height=this.canvas.height/this.options.reflectionScaledownFactor;var a=this.reflected.getContext("2d");a.drawImage(this.img,this.options.crop[0],this.options.crop[1],this.options.crop[2],this.options.crop[3],0,0,this.reflected.width,this.reflected.height)},RainyDay.prototype.prepareGlass=function(){this.glass=document.createElement("canvas"),this.glass.width=this.canvas.width,this.glass.height=this.canvas.height,this.context=this.glass.getContext("2d")},RainyDay.prototype.rain=function(a,b){if(this.reflection!==this.REFLECTION_NONE&&this.prepareReflections(),this.animateDrops(),this.presets=a,this.PRIVATE_GRAVITY_FORCE_FACTOR_Y=.001*this.options.fps/25,this.PRIVATE_GRAVITY_FORCE_FACTOR_X=(Math.PI/2-this.options.gravityAngle)*(.001*this.options.fps)/50,this.options.enableCollisions){for(var c=0,d=0;d<a.length;d++)a[d][0]+a[d][1]>c&&(c=Math.floor(a[d][0]+a[d][1]));if(c>0){var e=Math.ceil(this.canvas.width/c),f=Math.ceil(this.canvas.height/c);this.matrix=new CollisionMatrix(e,f,c)}else this.options.enableCollisions=!1}for(var d=0;d<a.length;d++)a[d][3]||(a[d][3]=-1);var g=0;this.addDropCallback=function(){var c=(new Date).getTime();if(!(b>c-g)){g=c;var d=this.canvas.getContext("2d");d.clearRect(0,0,this.canvas.width,this.canvas.height),d.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);for(var e,f=0;f<a.length;f++)if(a[f][2]>1||-1===a[f][3]){if(0!==a[f][3]){a[f][3]--;for(var h=0;h<a[f][2];++h)this.putDrop(new Drop(this,Math.random()*this.canvas.width,Math.random()*this.canvas.height,a[f][0],a[f][1]))}}else if(Math.random()<a[f][2]){e=a[f];break}e&&this.putDrop(new Drop(this,Math.random()*this.canvas.width,Math.random()*this.canvas.height,e[0],e[1])),d.save(),d.globalAlpha=this.options.opacity,d.drawImage(this.glass,0,0,this.canvas.width,this.canvas.height),d.restore()}}.bind(this)},RainyDay.prototype.putDrop=function(a){a.draw(),this.gravity&&a.r>this.options.gravityThreshold&&(this.options.enableCollisions&&this.matrix.update(a),this.drops.push(a))},RainyDay.prototype.clearDrop=function(a,b){var c=a.clear(b);if(c){var d=this.drops.indexOf(a);d>=0&&this.drops.splice(d,1)}return c},Drop.prototype.draw=function(){this.context.save(),this.context.beginPath();var a=this.r;if(this.r=.95*this.r,this.r<3)this.context.arc(this.x,this.y,this.r,0,2*Math.PI,!0),this.context.closePath();else if(this.colliding||this.yspeed>2){if(this.colliding){var b=this.colliding;this.r=1.001*(this.r>b.r?this.r:b.r),this.x+=b.x-this.x,this.colliding=null}var c=1+.1*this.yspeed;this.context.moveTo(this.x-this.r/c,this.y),this.context.bezierCurveTo(this.x-this.r,this.y-2*this.r,this.x+this.r,this.y-2*this.r,this.x+this.r/c,this.y),this.context.bezierCurveTo(this.x+this.r,this.y+c*this.r,this.x-this.r,this.y+c*this.r,this.x-this.r/c,this.y)}else this.context.arc(this.x,this.y,.9*this.r,0,2*Math.PI,!0),this.context.closePath();this.context.clip(),this.r=a,this.rainyday.reflection&&this.rainyday.reflection(this),this.context.restore()},Drop.prototype.clear=function(a){return this.context.clearRect(this.x-this.r-1,this.y-this.r-2,2*this.r+2,2*this.r+2),a?(this.terminate=!0,!0):this.y-this.r>this.rainyday.canvas.height||this.x-this.r>this.rainyday.canvas.width||this.x+this.r<0?!0:!1},Drop.prototype.animate=function(){if(this.terminate)return!1;var a=this.rainyday.gravity(this);if(!a&&this.rainyday.trail&&this.rainyday.trail(this),this.rainyday.options.enableCollisions){var b=this.rainyday.matrix.update(this,a);b&&this.rainyday.collision(this,b)}return!a||this.terminate},RainyDay.prototype.TRAIL_NONE=function(){},RainyDay.prototype.TRAIL_DROPS=function(a){(!a.trailY||a.y-a.trailY>=100*Math.random()*a.r)&&(a.trailY=a.y,this.putDrop(new Drop(this,a.x+(2*Math.random()-1)*Math.random(),a.y-a.r-5,Math.ceil(a.r/5),0)))},RainyDay.prototype.TRAIL_SMUDGE=function(a){var b=a.y-a.r-3,c=a.x-a.r/2+2*Math.random();0>b||0>c||this.context.drawImage(this.clearbackground,c,b,a.r,2,c,b,a.r,2)},RainyDay.prototype.GRAVITY_NONE=function(){return!0},RainyDay.prototype.GRAVITY_LINEAR=function(a){return this.clearDrop(a)?!0:(a.yspeed?(a.yspeed+=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y*Math.floor(a.r),a.xspeed+=this.PRIVATE_GRAVITY_FORCE_FACTOR_X*Math.floor(a.r)):(a.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y,a.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X),a.y+=a.yspeed,a.draw(),!1)},RainyDay.prototype.GRAVITY_NON_LINEAR=function(a){return this.clearDrop(a)?!0:(a.collided?(a.collided=!1,a.seed=Math.floor(a.r*Math.random()*this.options.fps),a.skipping=!1,a.slowing=!1):(!a.seed||a.seed<0)&&(a.seed=Math.floor(a.r*Math.random()*this.options.fps),a.skipping=a.skipping===!1?!0:!1,a.slowing=!0),a.seed--,a.yspeed?a.slowing?(a.yspeed/=1.1,a.xspeed/=1.1,a.yspeed<this.PRIVATE_GRAVITY_FORCE_FACTOR_Y&&(a.slowing=!1)):a.skipping?(a.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y,a.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X):(a.yspeed+=1*this.PRIVATE_GRAVITY_FORCE_FACTOR_Y*Math.floor(a.r),a.xspeed+=1*this.PRIVATE_GRAVITY_FORCE_FACTOR_X*Math.floor(a.r)):(a.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y,a.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X),0!==this.options.gravityAngleVariance&&(a.xspeed+=(2*Math.random()-1)*a.yspeed*this.options.gravityAngleVariance),a.y+=a.yspeed,a.x+=a.xspeed,a.draw(),!1)},RainyDay.prototype.positiveMin=function(a,b){var c=0;return c=b>a?0>=a?b:a:0>=b?a:b,0>=c?1:c},RainyDay.prototype.REFLECTION_NONE=function(){this.context.fillStyle=this.options.fillStyle,this.context.fill()},RainyDay.prototype.REFLECTION_MINIATURE=function(a){var b=Math.max((a.x-this.options.reflectionDropMappingWidth)/this.options.reflectionScaledownFactor,0),c=Math.max((a.y-this.options.reflectionDropMappingHeight)/this.options.reflectionScaledownFactor,0),d=this.positiveMin(2*this.options.reflectionDropMappingWidth/this.options.reflectionScaledownFactor,this.reflected.width-b),e=this.positiveMin(2*this.options.reflectionDropMappingHeight/this.options.reflectionScaledownFactor,this.reflected.height-c),f=Math.max(a.x-1.1*a.r,0),g=Math.max(a.y-1.1*a.r,0);this.context.drawImage(this.reflected,b,c,d,e,f,g,2*a.r,2*a.r)},RainyDay.prototype.COLLISION_SIMPLE=function(a,b){for(var c,d=b;null!=d;){var e=d.drop;if(Math.sqrt(Math.pow(a.x-e.x,2)+Math.pow(a.y-e.y,2))<a.r+e.r){c=e;break}d=d.next}if(c){var f,g;a.y>c.y?(f=a,g=c):(f=c,g=a),this.clearDrop(g),this.clearDrop(f,!0),this.matrix.remove(f),g.draw(),g.colliding=f,g.collided=!0}},RainyDay.prototype.prepareBackground=function(){this.background=document.createElement("canvas"),this.background.width=this.canvas.width,this.background.height=this.canvas.height,this.clearbackground=document.createElement("canvas"),this.clearbackground.width=this.canvas.width,this.clearbackground.height=this.canvas.height;var a=this.background.getContext("2d");a.clearRect(0,0,this.canvas.width,this.canvas.height),a.drawImage(this.img,this.options.crop[0],this.options.crop[1],this.options.crop[2],this.options.crop[3],0,0,this.canvas.width,this.canvas.height),a=this.clearbackground.getContext("2d"),a.clearRect(0,0,this.canvas.width,this.canvas.height),a.drawImage(this.img,this.options.crop[0],this.options.crop[1],this.options.crop[2],this.options.crop[3],0,0,this.canvas.width,this.canvas.height),!isNaN(this.options.blur)&&this.options.blur>=1&&this.stackBlurCanvasRGB(this.canvas.width,this.canvas.height,this.options.blur)},RainyDay.prototype.stackBlurCanvasRGB=function(a,b,c){var d=[[0,9],[1,11],[2,12],[3,13],[5,14],[7,15],[11,16],[15,17],[22,18],[31,19],[45,20],[63,21],[90,22],[127,23],[181,24]],e=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];c|=0;var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z=this.background.getContext("2d"),A=z.getImageData(0,0,a,b),B=A.data,C=c+1,D=C*(C+1)/2,E=new BlurStack,F=new BlurStack,G=E;for(h=1;2*c+1>h;h++)G=G.next=new BlurStack,h===C&&(F=G);G.next=E;var H=null,I=null;l=k=0;for(var J,K=e[c],L=0;L<d.length;++L)if(c<=d[L][0]){J=d[L-1][1];break}for(g=0;b>g;g++){for(s=t=u=m=n=o=0,p=C*(v=B[k]),q=C*(w=B[k+1]),r=C*(x=B[k+2]),m+=D*v,n+=D*w,o+=D*x,G=E,h=0;C>h;h++)G.r=v,G.g=w,G.b=x,G=G.next;for(h=1;C>h;h++)i=k+((h>a-1?a-1:h)<<2),m+=(G.r=v=B[i])*(y=C-h),n+=(G.g=w=B[i+1])*y,o+=(G.b=x=B[i+2])*y,s+=v,t+=w,u+=x,G=G.next;for(H=E,I=F,f=0;a>f;f++)B[k]=m*K>>J,B[k+1]=n*K>>J,B[k+2]=o*K>>J,m-=p,n-=q,o-=r,p-=H.r,q-=H.g,r-=H.b,i=l+((i=f+c+1)<a-1?i:a-1)<<2,s+=H.r=B[i],t+=H.g=B[i+1],u+=H.b=B[i+2],m+=s,n+=t,o+=u,H=H.next,p+=v=I.r,q+=w=I.g,r+=x=I.b,s-=v,t-=w,u-=x,I=I.next,k+=4;l+=a}for(f=0;a>f;f++){for(t=u=s=n=o=m=0,k=f<<2,p=C*(v=B[k]),q=C*(w=B[k+1]),r=C*(x=B[k+2]),m+=D*v,n+=D*w,o+=D*x,G=E,h=0;C>h;h++)G.r=v,G.g=w,G.b=x,G=G.next;for(j=a,h=1;C>h;h++)k=j+f<<2,m+=(G.r=v=B[k])*(y=C-h),n+=(G.g=w=B[k+1])*y,o+=(G.b=x=B[k+2])*y,s+=v,t+=w,u+=x,G=G.next,b-1>h&&(j+=a);for(k=f,H=E,I=F,g=0;b>g;g++)i=k<<2,B[i]=m*K>>J,B[i+1]=n*K>>J,B[i+2]=o*K>>J,m-=p,n-=q,o-=r,p-=H.r,q-=H.g,r-=H.b,i=f+((i=g+C)<b-1?i:b-1)*a<<2,m+=s+=H.r=B[i],n+=t+=H.g=B[i+1],o+=u+=H.b=B[i+2],H=H.next,p+=v=I.r,q+=w=I.g,r+=x=I.b,s-=v,t-=w,u-=x,I=I.next,k+=a}z.putImageData(A,0,0)},CollisionMatrix.prototype.update=function(a,b){if(a.gid){if(!this.matrix[a.gmx]||!this.matrix[a.gmx][a.gmy])return null;if(this.matrix[a.gmx][a.gmy].remove(a),b)return null;if(a.gmx=Math.floor(a.x/this.resolution),a.gmy=Math.floor(a.y/this.resolution),!this.matrix[a.gmx]||!this.matrix[a.gmx][a.gmy])return null;this.matrix[a.gmx][a.gmy].add(a);var c=this.collisions(a);if(c&&null!=c.next)return c.next}else{if(a.gid=Math.random().toString(36).substr(2,9),a.gmx=Math.floor(a.x/this.resolution),a.gmy=Math.floor(a.y/this.resolution),!this.matrix[a.gmx]||!this.matrix[a.gmx][a.gmy])return null;this.matrix[a.gmx][a.gmy].add(a)}return null},CollisionMatrix.prototype.collisions=function(a){var b=new DropItem(null),c=b;return b=this.addAll(b,a.gmx-1,a.gmy+1),b=this.addAll(b,a.gmx,a.gmy+1),b=this.addAll(b,a.gmx+1,a.gmy+1),c},CollisionMatrix.prototype.addAll=function(a,b,c){if(b>0&&c>0&&b<this.xc&&c<this.yc)for(var d=this.matrix[b][c];null!=d.next;)d=d.next,a.next=new DropItem(d.drop),a=a.next;return a},CollisionMatrix.prototype.remove=function(a){this.matrix[a.gmx][a.gmy].remove(a)},DropItem.prototype.add=function(a){for(var b=this;null!=b.next;)b=b.next;b.next=new DropItem(a)},DropItem.prototype.remove=function(a){for(var b=this,c=null;null!=b.next;)c=b,b=b.next,b.drop.gid===a.gid&&(c.next=b.next)};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwicG0yXzUvaW5kZXguanMiLCJwb3dlci9nYXVnZS5qcyIsInBvd2VyL2luZGV4LmpzIiwicG93ZXIvemh1dGlsLm1pbi5qcyIsInJhaW4vaW5kZXguanMiLCJ3YXRlci9pbmRleC5qcyIsIndhdGVyL2xpcXVpZEZpbGxHYXVnZS5qcyIsInJhaW4vdmVuZG9yL3JhaW5kcm9wcy5qcyIsInJhaW4vdmVuZG9yL3JhaW55ZGF5Lm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWFnZS5pZCA9ICdiYWNrZ3JvdW5kJztcbiAgICBpbWFnZS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuICBpbWFnZS5zcmMgPSAnLi9pbWFnZXMvYmFja2dyb3VuZC5qcGcnO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICBkMy5qc29uKCcuL2Fpci5qc29uJywgZnVuY3Rpb24oZGF0YSkgeyBcbiAgICBkYXRhID0gZGF0YVswXTtcbiAgICAkKCcjcG0yXzUnKS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgZGF0YS5zaXRlX2lkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInNpdGVfbmFtZVwiPjxoND4nICsgZGF0YS5TaXRlTmFtZSArICc8L2g0Pjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN0YXR1c1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwic3RhdHVzX2ltZ1wiIHNyYz1cIi4uL1BNMi41L2ltYWdlcy9wbTIuNS13YWl0LnBuZ1wiPicgKyBcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJwbTI1XCI+PGg1PlBNMi4177yaPC9oNT48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG5cbiAgICBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gMTEpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgZ3JlZW4gdGFnIGxhYmVsIHN0YXR1cycpLnRleHQoJ+S9jicpO1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5zdGF0dXNfaW1nJykuYXR0cignc3JjJywgJ2ltYWdlcy9QTTIuNS0xLnBuZycpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwYXJzZUludChkYXRhLlBNMl81KSA8PSAyMykge1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5zdGF0dXMnKS5hdHRyKCdjbGFzcycsICd1aSBncmVlbiB0YWcgbGFiZWwgc3RhdHVzJykudGV4dCgn5L2OJyk7XG4gICAgICAkKCcjJyArIGRhdGEuc2l0ZV9pZCArICcgLnN0YXR1c19pbWcnKS5hdHRyKCdzcmMnLCAnaW1hZ2VzL1BNMi41LTIucG5nJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBhcnNlSW50KGRhdGEuUE0yXzUpIDw9IDM1KSB7XG4gICAgICAkKCcjJyArIGRhdGEuc2l0ZV9pZCArICcgLnN0YXR1cycpLmF0dHIoJ2NsYXNzJywgJ3VpIGdyZWVuIHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfkvY4nKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtMy5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNDEpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgeWVsbG93IHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfkuK0nKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtNC5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNDcpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgb3JhbmdlIHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfkuK0nKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtNS5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNTMpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgb3JhbmdlIHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfkuK0nKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtNi5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNTgpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgcmVkIHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfpq5gnKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtNy5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNjQpIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgcmVkIHRhZyBsYWJlbCBzdGF0dXMnKS50ZXh0KCfpq5gnKTtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzX2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvUE0yLjUtOC5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VJbnQoZGF0YS5QTTJfNSkgPD0gNzApIHtcbiAgICAgICQoJyMnICsgZGF0YS5zaXRlX2lkICsgJyAuc3RhdHVzJykuYXR0cignY2xhc3MnLCAndWkgYmxhY2sgdGFnIGxhYmVsIHN0YXR1cycpLnRleHQoJ+mrmCcpO1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5zdGF0dXNfaW1nJykuYXR0cignc3JjJywgJ2ltYWdlcy9QTTIuNS05LnBuZycpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwYXJzZUludChkYXRhLlBNMl81KSA+PSA3MSkge1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5zdGF0dXMnKS5hdHRyKCdjbGFzcycsICd1aSBwdXJwbGUgdGFnIGxhYmVsIHN0YXR1cycpLnRleHQoJ+mdnuW4uOmrmCcpO1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5zdGF0dXNfaW1nJykuYXR0cignc3JjJywgJ2ltYWdlcy9QTTIuNS0xMC5wbmcnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNOYU4ocGFyc2VJbnQoZGF0YS5QTTJfNSkpKSB7XG4gICAgICAkKCcjJyArIGRhdGEuc2l0ZV9pZCArICcgLnN0YXR1c19pbWcnKS5hdHRyKCdzcmMnLCAnaW1hZ2VzL1BNMi41LXdhaXQucG5nJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOKHBhcnNlSW50KGRhdGEuUE0yXzUpKSkge1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5wbTI1JykuY2hpbGRyZW4oJ2g1JylcbiAgICAgIC50ZXh0KFwiUE0yLjXvvJrlvoXmm7TmlrBcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJCgnIycgKyBkYXRhLnNpdGVfaWQgKyAnIC5wbTI1JykuY2hpbGRyZW4oJ2g1JylcbiAgICAgIC50ZXh0KFwiUE0yLjXvvJogXCIgKyBkYXRhLlBNMl81ICsgXCIgzrxnL21cIikuYXBwZW5kKCc8c3VwPjM8L3N1cD4nKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsImZ1bmN0aW9uIEdhdWdlKHBsYWNlaG9sZGVyTmFtZSwgY29uZmlndXJhdGlvbilcbntcbiAgdGhpcy5wbGFjZWhvbGRlck5hbWUgPSBwbGFjZWhvbGRlck5hbWU7XG4gIFxuICB2YXIgc2VsZiA9IHRoaXM7IC8vIGZvciBpbnRlcm5hbCBkMyBmdW5jdGlvbnNcbiAgXG4gIHRoaXMuY29uZmlndXJlID0gZnVuY3Rpb24oY29uZmlndXJhdGlvbilcbiAge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlndXJhdGlvbjtcbiAgICBcbiAgICB0aGlzLmNvbmZpZy5zaXplID0gdGhpcy5jb25maWcuc2l6ZSAqIDAuOTtcbiAgICBcbiAgICB0aGlzLmNvbmZpZy5yYWR1aXMgPSB0aGlzLmNvbmZpZy5zaXplICogMC45NyAvIDI7XG4gICAgdGhpcy5jb25maWcuY3ggPSB0aGlzLmNvbmZpZy5zaXplIC8gMjtcbiAgICB0aGlzLmNvbmZpZy5jeSA9IHRoaXMuY29uZmlnLnNpemUgLyAyO1xuICAgIFxuICAgIHRoaXMuY29uZmlnLm1pbiA9IHVuZGVmaW5lZCAhPSBjb25maWd1cmF0aW9uLm1pbiA/IGNvbmZpZ3VyYXRpb24ubWluIDogMDsgXG4gICAgdGhpcy5jb25maWcubWF4ID0gdW5kZWZpbmVkICE9IGNvbmZpZ3VyYXRpb24ubWF4ID8gY29uZmlndXJhdGlvbi5tYXggOiAxMDA7IFxuICAgIHRoaXMuY29uZmlnLnJhbmdlID0gdGhpcy5jb25maWcubWF4IC0gdGhpcy5jb25maWcubWluO1xuICAgIFxuICAgIHRoaXMuY29uZmlnLm1ham9yVGlja3MgPSBjb25maWd1cmF0aW9uLm1ham9yVGlja3MgfHwgNTtcbiAgICB0aGlzLmNvbmZpZy5taW5vclRpY2tzID0gY29uZmlndXJhdGlvbi5taW5vclRpY2tzIHx8IDI7XG4gICAgXG4gICAgdGhpcy5jb25maWcuZ3JlZW5Db2xvciAgPSBjb25maWd1cmF0aW9uLmdyZWVuQ29sb3IgfHwgXCIjMTA5NjE4XCI7XG4gICAgdGhpcy5jb25maWcueWVsbG93Q29sb3IgPSBjb25maWd1cmF0aW9uLnllbGxvd0NvbG9yIHx8IFwiI0ZGOTkwMFwiO1xuICAgIHRoaXMuY29uZmlnLnJlZENvbG9yICA9IGNvbmZpZ3VyYXRpb24ucmVkQ29sb3IgfHwgXCIjREMzOTEyXCI7XG4gICAgXG4gICAgdGhpcy5jb25maWcudHJhbnNpdGlvbkR1cmF0aW9uID0gY29uZmlndXJhdGlvbi50cmFuc2l0aW9uRHVyYXRpb24gfHwgNTAwO1xuICB9XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpXG4gIHtcbiAgICB0aGlzLmJvZHkgPSBkMy5zZWxlY3QoXCIjXCIgKyB0aGlzLnBsYWNlaG9sZGVyTmFtZSlcbiAgICAgICAgICAgICAgLmFwcGVuZChcInN2ZzpzdmdcIilcbiAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdhdWdlXCIpXG4gICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy5jb25maWcuc2l6ZSlcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5jb25maWcuc2l6ZSk7XG4gICAgXG4gICAgdGhpcy5ib2R5LmFwcGVuZChcInN2ZzpjaXJjbGVcIilcbiAgICAgICAgICAuYXR0cihcImN4XCIsIHRoaXMuY29uZmlnLmN4KVxuICAgICAgICAgIC5hdHRyKFwiY3lcIiwgdGhpcy5jb25maWcuY3kpXG4gICAgICAgICAgLmF0dHIoXCJyXCIsIHRoaXMuY29uZmlnLnJhZHVpcylcbiAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2NjY1wiKVxuICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiMwMDBcIilcbiAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgXCIwLjVweFwiKTtcbiAgICAgICAgICBcbiAgICB0aGlzLmJvZHkuYXBwZW5kKFwic3ZnOmNpcmNsZVwiKVxuICAgICAgICAgIC5hdHRyKFwiY3hcIiwgdGhpcy5jb25maWcuY3gpXG4gICAgICAgICAgLmF0dHIoXCJjeVwiLCB0aGlzLmNvbmZpZy5jeSlcbiAgICAgICAgICAuYXR0cihcInJcIiwgMC45ICogdGhpcy5jb25maWcucmFkdWlzKVxuICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2UwZTBlMFwiKVxuICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjJweFwiKTtcbiAgICAgICAgICBcbiAgICBmb3IgKHZhciBpbmRleCBpbiB0aGlzLmNvbmZpZy5ncmVlblpvbmVzKVxuICAgIHtcbiAgICAgIHRoaXMuZHJhd0JhbmQodGhpcy5jb25maWcuZ3JlZW5ab25lc1tpbmRleF0uZnJvbSwgdGhpcy5jb25maWcuZ3JlZW5ab25lc1tpbmRleF0udG8sIHNlbGYuY29uZmlnLmdyZWVuQ29sb3IpO1xuICAgIH1cbiAgICBcbiAgICBmb3IgKHZhciBpbmRleCBpbiB0aGlzLmNvbmZpZy55ZWxsb3dab25lcylcbiAgICB7XG4gICAgICB0aGlzLmRyYXdCYW5kKHRoaXMuY29uZmlnLnllbGxvd1pvbmVzW2luZGV4XS5mcm9tLCB0aGlzLmNvbmZpZy55ZWxsb3dab25lc1tpbmRleF0udG8sIHNlbGYuY29uZmlnLnllbGxvd0NvbG9yKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICh2YXIgaW5kZXggaW4gdGhpcy5jb25maWcucmVkWm9uZXMpXG4gICAge1xuICAgICAgdGhpcy5kcmF3QmFuZCh0aGlzLmNvbmZpZy5yZWRab25lc1tpbmRleF0uZnJvbSwgdGhpcy5jb25maWcucmVkWm9uZXNbaW5kZXhdLnRvLCBzZWxmLmNvbmZpZy5yZWRDb2xvcik7XG4gICAgfVxuICAgIFxuICAgIGlmICh1bmRlZmluZWQgIT0gdGhpcy5jb25maWcubGFiZWwpXG4gICAge1xuICAgICAgdmFyIGZvbnRTaXplID0gTWF0aC5yb3VuZCh0aGlzLmNvbmZpZy5zaXplIC8gOSk7XG4gICAgICB0aGlzLmJvZHkuYXBwZW5kKFwic3ZnOnRleHRcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCB0aGlzLmNvbmZpZy5jeClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCB0aGlzLmNvbmZpZy5jeSAvIDIgKyBmb250U2l6ZSAvIDIpXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIGZvbnRTaXplIC8gMilcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIC50ZXh0KHRoaXMuY29uZmlnLmxhYmVsKVxuICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIDE4ICsgXCJweFwiKSAvLyBsYWJlbCBmb250LXNpemUgXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiIzMzM1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMHB4XCIpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgZm9udFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY29uZmlnLnNpemUgLyAxNik7XG4gICAgdmFyIG1ham9yRGVsdGEgPSB0aGlzLmNvbmZpZy5yYW5nZSAvICh0aGlzLmNvbmZpZy5tYWpvclRpY2tzIC0gMSk7XG4gICAgZm9yICh2YXIgbWFqb3IgPSB0aGlzLmNvbmZpZy5taW47IG1ham9yIDw9IHRoaXMuY29uZmlnLm1heDsgbWFqb3IgKz0gbWFqb3JEZWx0YSlcbiAgICB7XG4gICAgICB2YXIgbWlub3JEZWx0YSA9IG1ham9yRGVsdGEgLyB0aGlzLmNvbmZpZy5taW5vclRpY2tzO1xuICAgICAgZm9yICh2YXIgbWlub3IgPSBtYWpvciArIG1pbm9yRGVsdGE7IG1pbm9yIDwgTWF0aC5taW4obWFqb3IgKyBtYWpvckRlbHRhLCB0aGlzLmNvbmZpZy5tYXgpOyBtaW5vciArPSBtaW5vckRlbHRhKVxuICAgICAge1xuICAgICAgICB2YXIgcG9pbnQxID0gdGhpcy52YWx1ZVRvUG9pbnQobWlub3IsIDAuNzUpO1xuICAgICAgICB2YXIgcG9pbnQyID0gdGhpcy52YWx1ZVRvUG9pbnQobWlub3IsIDAuODUpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZChcInN2ZzpsaW5lXCIpXG4gICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgcG9pbnQxLngpXG4gICAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgcG9pbnQxLnkpXG4gICAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgcG9pbnQyLngpXG4gICAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgcG9pbnQyLnkpXG4gICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM2NjZcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMXB4XCIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgcG9pbnQxID0gdGhpcy52YWx1ZVRvUG9pbnQobWFqb3IsIDAuNyk7XG4gICAgICB2YXIgcG9pbnQyID0gdGhpcy52YWx1ZVRvUG9pbnQobWFqb3IsIDAuODUpOyAgXG4gICAgICBcbiAgICAgIHRoaXMuYm9keS5hcHBlbmQoXCJzdmc6bGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCBwb2ludDEueClcbiAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgcG9pbnQxLnkpXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHBvaW50Mi54KVxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCBwb2ludDIueSlcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiMzMzNcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjJweFwiKTtcbiAgICAgIFxuICAgICAgaWYgKG1ham9yID09IHRoaXMuY29uZmlnLm1pbiB8fCBtYWpvciA9PSB0aGlzLmNvbmZpZy5tYXgpXG4gICAgICB7XG4gICAgICAgIHZhciBwb2ludCA9IHRoaXMudmFsdWVUb1BvaW50KG1ham9yLCAwLjYzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoXCJzdmc6dGV4dFwiKVxuICAgICAgICAgICAgICAuYXR0cihcInhcIiwgcG9pbnQueClcbiAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBvaW50LnkpXG4gICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgZm9udFNpemUgLyAzKVxuICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIG1ham9yID09IHRoaXMuY29uZmlnLm1pbiA/IFwic3RhcnRcIiA6IFwiZW5kXCIpXG4gICAgICAgICAgICAgIC50ZXh0KG1ham9yKVxuICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgZm9udFNpemUgKyBcInB4XCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjMzMzXCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjBweFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdmFyIHBvaW50ZXJDb250YWluZXIgPSB0aGlzLmJvZHkuYXBwZW5kKFwic3ZnOmdcIikuYXR0cihcImNsYXNzXCIsIFwicG9pbnRlckNvbnRhaW5lclwiKTtcbiAgICBcbiAgICB2YXIgbWlkVmFsdWUgPSAodGhpcy5jb25maWcubWluICsgdGhpcy5jb25maWcubWF4KSAvIDI7XG4gICAgXG4gICAgdmFyIHBvaW50ZXJQYXRoID0gdGhpcy5idWlsZFBvaW50ZXJQYXRoKG1pZFZhbHVlKTtcbiAgICBcbiAgICB2YXIgcG9pbnRlckxpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiBkLnggfSlcbiAgICAgICAgICAgICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQueSB9KVxuICAgICAgICAgICAgICAgICAgLmludGVycG9sYXRlKFwiYmFzaXNcIik7XG4gICAgXG4gICAgcG9pbnRlckNvbnRhaW5lci5zZWxlY3RBbGwoXCJwYXRoXCIpXG4gICAgICAgICAgICAgIC5kYXRhKFtwb2ludGVyUGF0aF0pXG4gICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInN2ZzpwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgcG9pbnRlckxpbmUpXG4gICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2RjMzkxMlwiKVxuICAgICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2M2MzMxMFwiKVxuICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDAuNylcbiAgICAgICAgICBcbiAgICBwb2ludGVyQ29udGFpbmVyLmFwcGVuZChcInN2ZzpjaXJjbGVcIilcbiAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCB0aGlzLmNvbmZpZy5jeClcbiAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCB0aGlzLmNvbmZpZy5jeSlcbiAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDAuMTIgKiB0aGlzLmNvbmZpZy5yYWR1aXMpXG4gICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjNDY4NEVFXCIpXG4gICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiM2NjZcIilcbiAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcbiAgICBcbiAgICB2YXIgZm9udFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY29uZmlnLnNpemUgLyAxMCk7XG4gICAgcG9pbnRlckNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgIC5kYXRhKFttaWRWYWx1ZV0pXG4gICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInN2Zzp0ZXh0XCIpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgdGhpcy5jb25maWcuY3gpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgdGhpcy5jb25maWcuc2l6ZSAtIHRoaXMuY29uZmlnLmN5IC8gNCAtIGZvbnRTaXplICsgNSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgZm9udFNpemUgLyAyKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIDE2ICsgXCJweFwiKSAvLyBWYWx1ZVRleHRcbiAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJyZ2IoMjQ0LCAwLCAwKVwiKVxuICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC13ZWlnaHRcIiwgXCI3MDBcIilcbiAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjBweFwiKTtcbiAgICBcbiAgICB0aGlzLnJlZHJhdyh0aGlzLmNvbmZpZy5taW4sIDApO1xuICB9XG4gIFxuICB0aGlzLmJ1aWxkUG9pbnRlclBhdGggPSBmdW5jdGlvbih2YWx1ZSlcbiAge1xuICAgIHZhciBkZWx0YSA9IHRoaXMuY29uZmlnLnJhbmdlIC8gMTM7XG4gICAgXG4gICAgdmFyIGhlYWQgPSB2YWx1ZVRvUG9pbnQodmFsdWUsIDAuODUpO1xuICAgIHZhciBoZWFkMSA9IHZhbHVlVG9Qb2ludCh2YWx1ZSAtIGRlbHRhLCAwLjEyKTtcbiAgICB2YXIgaGVhZDIgPSB2YWx1ZVRvUG9pbnQodmFsdWUgKyBkZWx0YSwgMC4xMik7XG4gICAgXG4gICAgdmFyIHRhaWxWYWx1ZSA9IHZhbHVlIC0gKHRoaXMuY29uZmlnLnJhbmdlICogKDEvKDI3MC8zNjApKSAvIDIpO1xuICAgIHZhciB0YWlsID0gdmFsdWVUb1BvaW50KHRhaWxWYWx1ZSwgMC4yOCk7XG4gICAgdmFyIHRhaWwxID0gdmFsdWVUb1BvaW50KHRhaWxWYWx1ZSAtIGRlbHRhLCAwLjEyKTtcbiAgICB2YXIgdGFpbDIgPSB2YWx1ZVRvUG9pbnQodGFpbFZhbHVlICsgZGVsdGEsIDAuMTIpO1xuICAgIFxuICAgIHJldHVybiBbaGVhZCwgaGVhZDEsIHRhaWwyLCB0YWlsLCB0YWlsMSwgaGVhZDIsIGhlYWRdO1xuICAgIFxuICAgIGZ1bmN0aW9uIHZhbHVlVG9Qb2ludCh2YWx1ZSwgZmFjdG9yKVxuICAgIHtcbiAgICAgIHZhciBwb2ludCA9IHNlbGYudmFsdWVUb1BvaW50KHZhbHVlLCBmYWN0b3IpO1xuICAgICAgcG9pbnQueCAtPSBzZWxmLmNvbmZpZy5jeDtcbiAgICAgIHBvaW50LnkgLT0gc2VsZi5jb25maWcuY3k7XG4gICAgICByZXR1cm4gcG9pbnQ7XG4gICAgfVxuICB9XG4gIFxuICB0aGlzLmRyYXdCYW5kID0gZnVuY3Rpb24oc3RhcnQsIGVuZCwgY29sb3IpXG4gIHtcbiAgICBpZiAoMCA+PSBlbmQgLSBzdGFydCkgcmV0dXJuO1xuICAgIFxuICAgIHRoaXMuYm9keS5hcHBlbmQoXCJzdmc6cGF0aFwiKVxuICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgY29sb3IpXG4gICAgICAgICAgLmF0dHIoXCJkXCIsIGQzLnN2Zy5hcmMoKVxuICAgICAgICAgICAgLnN0YXJ0QW5nbGUodGhpcy52YWx1ZVRvUmFkaWFucyhzdGFydCkpXG4gICAgICAgICAgICAuZW5kQW5nbGUodGhpcy52YWx1ZVRvUmFkaWFucyhlbmQpKVxuICAgICAgICAgICAgLmlubmVyUmFkaXVzKDAuNjUgKiB0aGlzLmNvbmZpZy5yYWR1aXMpXG4gICAgICAgICAgICAub3V0ZXJSYWRpdXMoMC44NSAqIHRoaXMuY29uZmlnLnJhZHVpcykpXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHNlbGYuY29uZmlnLmN4ICsgXCIsIFwiICsgc2VsZi5jb25maWcuY3kgKyBcIikgcm90YXRlKDI3MClcIiB9KTtcbiAgfVxuICBcbiAgdGhpcy5yZWRyYXcgPSBmdW5jdGlvbih2YWx1ZSwgdHJhbnNpdGlvbkR1cmF0aW9uKVxuICB7XG4gICAgdmFyIHBvaW50ZXJDb250YWluZXIgPSB0aGlzLmJvZHkuc2VsZWN0KFwiLnBvaW50ZXJDb250YWluZXJcIik7XG4gICAgXG4gICAgcG9pbnRlckNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpLnRleHQoTWF0aC5yb3VuZCh2YWx1ZSkgKyAn6JCs55OpJyk7IC8vIHNldFZhbHVlVGV4dFxuICAgIFxuICAgIHZhciBwb2ludGVyID0gcG9pbnRlckNvbnRhaW5lci5zZWxlY3RBbGwoXCJwYXRoXCIpO1xuICAgIHBvaW50ZXIudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHVuZGVmaW5lZCAhPSB0cmFuc2l0aW9uRHVyYXRpb24gPyB0cmFuc2l0aW9uRHVyYXRpb24gOiB0aGlzLmNvbmZpZy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLy8uZGVsYXkoMClcbiAgICAgICAgICAvLy5lYXNlKFwibGluZWFyXCIpXG4gICAgICAgICAgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSBcbiAgICAgICAgICAuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKClcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcG9pbnRlclZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAodmFsdWUgPiBzZWxmLmNvbmZpZy5tYXgpIHBvaW50ZXJWYWx1ZSA9IHNlbGYuY29uZmlnLm1heCArIDAuMDIqc2VsZi5jb25maWcucmFuZ2U7XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA8IHNlbGYuY29uZmlnLm1pbikgcG9pbnRlclZhbHVlID0gc2VsZi5jb25maWcubWluIC0gMC4wMipzZWxmLmNvbmZpZy5yYW5nZTtcbiAgICAgICAgICAgIHZhciB0YXJnZXRSb3RhdGlvbiA9IChzZWxmLnZhbHVlVG9EZWdyZWVzKHBvaW50ZXJWYWx1ZSkgLSA5MCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudFJvdGF0aW9uID0gc2VsZi5fY3VycmVudFJvdGF0aW9uIHx8IHRhcmdldFJvdGF0aW9uO1xuICAgICAgICAgICAgc2VsZi5fY3VycmVudFJvdGF0aW9uID0gdGFyZ2V0Um90YXRpb247XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzdGVwKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFyIHJvdGF0aW9uID0gY3VycmVudFJvdGF0aW9uICsgKHRhcmdldFJvdGF0aW9uLWN1cnJlbnRSb3RhdGlvbikqc3RlcDtcbiAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgc2VsZi5jb25maWcuY3ggKyBcIiwgXCIgKyBzZWxmLmNvbmZpZy5jeSArIFwiKSByb3RhdGUoXCIgKyByb3RhdGlvbiArIFwiKVwiOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgfVxuICBcbiAgdGhpcy52YWx1ZVRvRGVncmVlcyA9IGZ1bmN0aW9uKHZhbHVlKVxuICB7XG4gICAgLy8gdGhhbmtzIEBjbG9zZWFsZXJ0XG4gICAgLy9yZXR1cm4gdmFsdWUgLyB0aGlzLmNvbmZpZy5yYW5nZSAqIDI3MCAtIDQ1O1xuICAgIHJldHVybiB2YWx1ZSAvIHRoaXMuY29uZmlnLnJhbmdlICogMjcwIC0gKHRoaXMuY29uZmlnLm1pbiAvIHRoaXMuY29uZmlnLnJhbmdlICogMjcwICsgNDUpO1xuICB9XG4gIFxuICB0aGlzLnZhbHVlVG9SYWRpYW5zID0gZnVuY3Rpb24odmFsdWUpXG4gIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZVRvRGVncmVlcyh2YWx1ZSkgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG4gIFxuICB0aGlzLnZhbHVlVG9Qb2ludCA9IGZ1bmN0aW9uKHZhbHVlLCBmYWN0b3IpXG4gIHtcbiAgICByZXR1cm4geyAgeDogdGhpcy5jb25maWcuY3ggLSB0aGlzLmNvbmZpZy5yYWR1aXMgKiBmYWN0b3IgKiBNYXRoLmNvcyh0aGlzLnZhbHVlVG9SYWRpYW5zKHZhbHVlKSksXG4gICAgICAgICAgeTogdGhpcy5jb25maWcuY3kgLSB0aGlzLmNvbmZpZy5yYWR1aXMgKiBmYWN0b3IgKiBNYXRoLnNpbih0aGlzLnZhbHVlVG9SYWRpYW5zKHZhbHVlKSkgICAgfTtcbiAgfVxuICBcbiAgLy8gaW5pdGlhbGl6YXRpb25cbiAgdGhpcy5jb25maWd1cmUoY29uZmlndXJhdGlvbik7ICBcbn1cbiIsIihmdW5jdGlvbigpIHtcblxuXHR2YXIgZ2F1Z2VzID0gW107XG4gIHZhciBwb3dlckxvYWREYXRhO1xuICB2YXIgcmVzZXJ2ZVN1cHBseTtcbiAgdmFyIHJlc2VydmVMb2FkUmF0ZTtcbiAgdmFyIGFyZWFNYXhTdXBwbHkgPSBbXTtcbiAgdmFyIGFyZWFNaW5TdXBwbHkgPSBbXTtcbiAgdmFyIGlkcyA9IFtcIk5vcnRoR2F1Z2VDb250YWluZXJcIiwgJ0NlbnRlckdhdWdlQ29udGFpbmVyJyxcbiAgICAgICdTb3V0aEdhdWdlQ29udGFpbmVyJywgJ0Vhc3RHYXVnZUNvbnRhaW5lciddO1xuICB2YXIgY29sb3JzID0gW1wiIzdCRjAyQVwiLCBcIiNGRENBMDBcIiwgXCIjRUQyRjAzXCJdOyAvLyBHcmVlbiwgWWVsbG93LCBSZWQ7XG4gIHZhciBwZW9wbGVfYW1vdW50ID0gWzEwNTQwMjg4LCA1Nzk5NDczLCA2MzA1NzUwLCA1NTcxNjIsIDIzMjAyNjczXTsgLy8g5YyX6YOo44CB5Lit6YOo44CB5Y2X6YOo44CB5p2x6YOo44CB5YWo5Y+wXG4gIHZhciB0b3RhbFN1cHBseSA9IDA7XG4gIHZhciB0b3RhbFVzYWdlID0gMDtcbiAgdmFyIHJlZ2lvbnMgPSBbJ+WMl+mDqCcsICfkuK3pg6gnLCAn5Y2X6YOoJywgJ+adsemDqCddO1xuICB2YXIgYXJlYVN1cHBseVJhdGUgPSBbMC4zNSwgMC4zMywgMC4zMiwgMC4wMjJdO1xuICB2YXIgcGVvcGxlID0gW107XG5cbiAgJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcblxuICAgIGQzLmpzb24oJy4vcG93ZXIuanNvbicsIGZ1bmN0aW9uKF9kYXRhKSB7XG4gICAgICB2YXIgcmVnaW9uRGF0YSA9IF9kYXRhLnJlZ2lvbkRhdGE7XG4gICAgICAkKCcjcG93ZXInKS5hcHBlbmQoJzxzdmcgaWQ9XCJiYXR0ZXJ5XCI+PC9zdmc+PGRpdj7lgpnovYnlrrnph4/njofvvJo8c3BhbiBjbGFzcz1cImxvYWQtcmF0ZVwiPjwvc3Bhbj48L2Rpdj4nKTtcbiAgICAgIGxvYWRSZXNlcnZlRGF0YShfZGF0YSwgX2RhdGEucmVzZXJ2ZURhdGEpO1xuICAgIH0pO1xuICB9KTtcblxuICBmdW5jdGlvbiBsb2FkUmVzZXJ2ZURhdGEgKGRhdGEsIGxvYWRSZXNlcnZlKSB7XG4gICAgICBwb3dlckxvYWREYXRhID0gW2xvYWRSZXNlcnZlLnJlc2VydmVMb2FkLCBsb2FkUmVzZXJ2ZS5yZXNlcnZlU3VwcGx5LCBcbiAgICAgICAgbG9hZFJlc2VydmUudXBkYXRlVGltZV07XG4gICAgICByZXNlcnZlU3VwcGx5ID0gcG93ZXJMb2FkRGF0YVsxXTtcbiAgICAgIHJlc2VydmVMb2FkID0gcG93ZXJMb2FkRGF0YVswXTtcbiAgICAgIHJlc2VydmVMb2FkUmF0ZSA9ICgocmVzZXJ2ZVN1cHBseS1yZXNlcnZlTG9hZCkvcmVzZXJ2ZUxvYWQpKjEwMDtcbiAgICAgIHJlc2VydmVMb2FkUmF0ZSA9IHJlc2VydmVMb2FkUmF0ZS50b0ZpeGVkKDIpO1xuICAgICAgJCgnLmxvYWQtcmF0ZScpLnRleHQocmVzZXJ2ZUxvYWRSYXRlICsgJ++8hScpO1xuICAgICAgdmFyIHBlcmNlbnRhZ2UgPSAocmVzZXJ2ZUxvYWRSYXRlLzE1KS50b0ZpeGVkKDIpO1xuXG4gICAgICBpZiAocmVzZXJ2ZUxvYWRSYXRlID49IDEwKSB7XG4gICAgICAgICQoJy5zdGF0ZS1ub3RlJykudGV4dCgn5L6b6Zu754uA5rOB77ya5L6b6Zu75YWF6KOV77yM57O757Wx5L6b6Zu76aSY6KOV5YWF6Laz44CCJyk7XG4gICAgICAgIHZpc3VhbEJhdHRlcnkoJyNiYXR0ZXJ5JywgcGVyY2VudGFnZSwgY29sb3JzWzBdKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc2VydmVMb2FkUmF0ZSA+IDYgJiYgcmVzZXJ2ZUxvYWRSYXRlIDwgMTApIHtcbiAgICAgICAgJCgnLnN0YXRlLW5vdGUnKS50ZXh0KCfkvpvpm7vni4Dms4HvvJrkvpvpm7vlkIPnt4rvvIzns7vntbHkvpvpm7vppJjoo5Xnt4rmvoAnKTtcbiAgICAgICAgdmlzdWFsQmF0dGVyeSgnI2JhdHRlcnknLCBwZXJjZW50YWdlLCBjb2xvcnNbMV0pO1xuICAgICAgICAkKCcuc3RhdGUtbm90ZScpLmFkZENsYXNzKCdyZWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc2VydmVMb2FkUmF0ZSA8PSA2KSB7XG4gICAgICAgICQoJy5zdGF0ZS1ub3RlJykudGV4dCgn5L6b6Zu754uA5rOB77ya5L6b6Zu76K2m5oiS77yM57O757Wx6ZmQ6Zu75qmf546H5aKe5Yqg44CCJyk7XG4gICAgICAgICQoJy5zdGF0ZS1ub3RlJykuYWRkQ2xhc3MoJ3JlZCcpO1xuICAgICAgICB2aXN1YWxCYXR0ZXJ5KCcjYmF0dGVyeScsIHBlcmNlbnRhZ2UsIGNvbG9yc1syXSk7XG4gICAgICB9XG4gIH1cblxuXG4gIFxuICBmdW5jdGlvbiB2aXN1YWxCYXR0ZXJ5IChpZCwgcGVyY2VudGFnZSwgY29sb3IpIHtcbiAgICBcbiAgICAvLyBjb250YWluZXJcbiAgICBkMy5zZWxlY3QoaWQpXG4gICAgICAgIC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTEwKVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCA2MClcbiAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJyZ2IoMTk4LCAyMDIsIDIwMylcIilcbiAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgXCI1cHhcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDUpXG4gICAgICAgIC5hdHRyKFwieVwiLCA1KVxuICAgICAgICAuYXR0cihcInJ4XCIsIDUpXG4gICAgICAgIC5hdHRyKFwicnlcIiwgNSlcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xuXG4gICAgIC8vIGNvbnRlbnRcbiAgICAgZDMuc2VsZWN0KGlkKVxuICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcIndpZHRoXCIsIDEwMCpwZXJjZW50YWdlKVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCA0NSlcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDEwKVxuICAgICAgICAuYXR0cihcInlcIiwgMTIpXG4gICAgICAgIC5hdHRyKFwicnhcIiwgMylcbiAgICAgICAgLmF0dHIoXCJyeVwiLCAyKVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgXG4gICAgIGQzLnNlbGVjdChpZClcbiAgICAgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA4KVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAyMClcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDExNylcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDIwKVxuICAgICAgICAuYXR0cihcInJ4XCIsIDIpXG4gICAgICAgIC5hdHRyKFwicnlcIiwgMSlcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCAncmdiKDE5OCwgMjAyLCAyMDMpJyk7XG4gXG5cbiAgICAgZDMuc2VsZWN0KGlkKVxuICAgICAgICAuYXBwZW5kKFwic3ZnOnRleHRcIilcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA4KVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAyMClcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDUwKVxuICAgICAgICAuYXR0cihcInlcIiwgNDApXG4gICAgICAgIC5hdHRyKFwicnhcIiwgMilcbiAgICAgICAgLmF0dHIoXCJyeVwiLCAxKVxuICAgICAgICAudGV4dChNYXRoLnJvdW5kKHBlcmNlbnRhZ2UqMTAwKSArICclJylcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCAncmdiKDI1NSwgMjU1LCAyNTUpJyk7XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIhZnVuY3Rpb24odCxyKXt0LmV4cG9ydHM7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcih0LHIpe2Zvcih2YXIgbj0tMSxlPXIubGVuZ3RoPj4+MDsrK248ZTspaWYodD09PXJbbl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIG4sZSxpLG8sbCx1LGEsZixzLGMsaCxwLGcsdix4LGQsYj1cIlwiLnJlcGxhY2U7Zm9yKG49W1wi4peLXCIsXCLkuIBcIixcIuS6jFwiLFwi5LiJXCIsXCLlm5tcIixcIuS6lFwiLFwi5YWtXCIsXCLkuINcIixcIuWFq1wiLFwi5LmdXCJdLGU9W1wi6Zu2XCIsXCLlo7lcIixcIuiys1wiLFwi5Y+DXCIsXCLogoZcIixcIuS8jVwiLFwi6Zm4XCIsXCLmn5JcIixcIuaNjFwiLFwi546WXCJdLG89e30sbD0wLHU9bi5sZW5ndGg7dT5sOysrbClhPWwsZj1uW2xdLG9bZl09YTtpPW8sYz1mdW5jdGlvbigpe3ZhciB0LHIsaSxvPXt9O2Zvcih0PTAsaT0ocj1uKS5sZW5ndGg7aT50OysrdClhPXQsZj1yW3RdLG9bZVthXV09ZjtyZXR1cm4gb30oKSxjW1wi77yQXCJdPVwi4peLXCIsY1tcIuWFqVwiXT1cIuS6jFwiLGNbXCLmi75cIl09XCLljYFcIixjW1wi5L2wXCJdPVwi55m+XCIsY1tcIuS7n1wiXT1cIuWNg1wiLHM9YyxoPXtcIuWNgVwiOjEwLFwi55m+XCI6MTAwLFwi5Y2DXCI6MWUzLFwi6JCsXCI6MWU0LFwi5YSEXCI6TWF0aC5wb3coMTAsOCksXCLlhYZcIjpNYXRoLnBvdygxMCwxMil9LHA9W1wi6JCsXCIsXCLlhIRcIixcIuWFhlwiXSxnPWZ1bmN0aW9uKHQpe3ZhciByO3JldHVybiByPXBhcnNlSW50KGIuY2FsbCh0LFwiLFwiLFwiXCIpKSxpc05hTihyKT92b2lkIDA6cn0sdj1mdW5jdGlvbih0KXt2YXIgbixlLG8sbCx1LGEsZjtmb3Iobj0wLGU9MCxvPTAsbD0wLGE9KHU9dC5zcGxpdChcIlwiKSkubGVuZ3RoO2E+bDsrK2wpZj11W2xdLG51bGwhPXNbZl0mJihmPXNbZl0pLGYgaW4gaT9vPWlbZl06cihmLHApPyhuKz0oZStvKSpoW2ZdLGU9MCxvPTApOihcIuWNgVwiPT09ZiYmMD09PW8mJihvPTEpLGUrPW8qaFtmXSxvPTApO3JldHVybiBuK2Urb30seD1mdW5jdGlvbih0KXt2YXIgcixuLGUsaSxvLGw7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpe2lmKHI9Zyh0KSx2b2lkIDA9PT1yKXJldHVybiB0O3Q9cn1mb3Iobj1cIlwiLGU9MCxvPShpPXApLmxlbmd0aDtvPmUmJihsPWlbZV0sbj10JTFlNCtuLHQ9TWF0aC5mbG9vcih0LzFlNCksdD4wKTsrK2Upbj1sK247cmV0dXJuIG59LGQ9ZnVuY3Rpb24odCxyKXt2YXIgbixlLGksbyxsLHUsYSxmLHM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpe2lmKG49Zyh0KSx2b2lkIDA9PT1uKXJldHVybiB0O3Q9bn1pZihudWxsPT1yLmJhc2Upe2lmKGU9dC50b1N0cmluZygpLGk9TWF0aC5mbG9vcihlLmxlbmd0aC80KSwxPmkpcmV0dXJuIGU7bz1wW2ktMV19ZWxzZSBvPXIuYmFzZTtyZXR1cm4gbD1udWxsIT0odT1yLnNtYXJ0KT91OiEwLGE9bnVsbCE9KHU9ci5leHRyYV9kZWNpbWFsKT91OjAsbnVsbCE9ci5leHRyYV9kZWNpbWFsJiYobD0hMSksdD14KHQpLGY9dC5pbmRleE9mKG8pLDA+Zj90OihzPXQuc3Vic3RyKDAsZiksbCYmcy5sZW5ndGg8MiYmMD09PWEmJihhPTEpLGE+MCYmKHMrPVwiLlwiK3Quc3Vic3RyKGYrMSxhKSkscytvKX0sdC5leHBvcnRzPXtwYXJzZVpITnVtYmVyOnYsYW5ub3RhdGU6eCxhcHByb3hpbWF0ZTpkfX0pLmNhbGwodGhpcyksci56aHV0aWw9dC5leHBvcnRzfSh7ZXhwb3J0czp7fX0sZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSk7IiwiKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gIHZhciBjb3VudHJ5RGF0YSA9IHt9O1xuXG4gIGQzLmpzb24oJy4vcmFpbi5qc29uJywgZnVuY3Rpb24oX2RhdGEpIHtcbiAgICBkcmF3KFtfZGF0YVswXV0pO1xuICB9KTtcblxuXG4gIGZ1bmN0aW9uIGRyYXcoZGF0YSkge1xuICAgIHZhciBudW1iZXJPZlJhaW4gPSAwO1xuICAgIHZhciBtYXhSYWluVmFsdWUgPSAwO1xuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHNpdGUpIHtcbiAgICAgIHZhciBuYW1lID0gc2l0ZS5TaXRlTmFtZS5yZXBsYWNlKC9bKCldL2csICctJyk7XG4gICAgICAkKCcjcmFpbicpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInJhaW5kcm9wXCIgaWQ9XCJBJysgc2l0ZS5TaXRlSWQgKyAnXCI+JyArXG4gICAgICAgICc8aDMgY2xhc3M9XCJzaXRlbmFtZVwiPicgKyBuYW1lICsgJ++8iCcgKyBzaXRlLlRvd25zaGlwICsgJ++8iTwvaDM+JyArXG4gICAgICAgICc8aDU+MTDliIbpkJjntK/nqY3pm6jph488YnIvPicgKyBjb2xvcmxpemUoc2l0ZS5SYWluZmFsbDEwbWluKSArICc8L2g1PicgK1xuICAgICAgICAnPGg1PjHlsI/mmYLntK/nqY3pm6jph488YnIvPicgKyBjb2xvcmxpemUoc2l0ZS5SYWluZmFsbDFocikgKyAnPC9oNT4nICtcbiAgICAgICAgJzxoNT7ml6XntK/nqY3pm6jph488YnIvPicgKyBjb2xvcmxpemUoc2l0ZS5SYWluZmFsbDI0aHIpICsgJzwvaDU+PC9kaXY+J1xuICAgICAgKTtcbiAgICAgIGlmIChNYXRoLnJvdW5kKDEwKnNpdGUuUmFpbmZhbGwyNGhyKSAhPT0gMCkge1xuICAgICAgICBjcmVhdGVSYWluRHJvcCgnI0EnK3NpdGUuU2l0ZUlkLCBnZXRPcHRpb25zKHNpdGUuUmFpbmZhbGwxMG1pbiwgc2l0ZS5SYWluZmFsbDI0aHIpKTtcbiAgICAgICAgbnVtYmVyT2ZSYWluICs9IDE7XG4gICAgICAgIGlmIChzaXRlLlJhaW5mYWxsMTBtaW4gPiBtYXhSYWluVmFsdWUpIHtcbiAgICAgICAgICBtYXhSYWluVmFsdWUgPSBzaXRlLlJhaW5mYWxsMTBtaW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZFRpY2soJyNBJytzaXRlLlNpdGVJZCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGFkZFRpY2soaWQpIHtcbiAgICB2YXIgd2lkdGggPSAkKGlkKS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSAkKGlkKS5oZWlnaHQoKTtcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KGlkKVxuICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKFwicG9zaXRpb25cIiwgJ2Fic29sdXRlJyk7XG5cbiAgICB2YXIgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgICAgICAgICAgICAucmFuZ2UoW2hlaWdodCwgMF0pXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgNTAwXSk7XG4gICAgICAvL0RlZmluZSBZIGF4aXNcbiAgICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgICAgICAgICAgICAgICAgLnNjYWxlKHlTY2FsZSlcbiAgICAgICAgICAgICAgICAgICAgICAub3JpZW50KFwibGVmdFwiKVxuICAgICAgICAgICAgICAgICAgICAgIC50aWNrUGFkZGluZygwKVxuICAgICAgICAgICAgICAgICAgICAgIC50aWNrcyg1KTtcbiAgICAvL0NyZWF0ZSBZIGF4aXNcbiAgICBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiYXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgzMCwwKVwiKVxuICAgICAgICAuY2FsbCh5QXhpcyk7IFxuICB9XG5cbiAgZnVuY3Rpb24gY29sb3JsaXplKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID4gMCkgXG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwicmVkXCI+JyArIHZhbHVlICsgJzwvc3Bhbj4nO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJhaW5Ecm9wKGlkLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIHJhaW5kcm9wID0gJChpZCkucmFpbmRyb3BzKG9wdGlvbnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0T3B0aW9ucyhyYWluVmFsdWUxMG1pbiwgcmFpblZhbHVlMjRocikge1xuICAgIHZhciBjYW52YXNIZWlnaHQgPSByYWluVmFsdWUyNGhyKjEuMjU7XG4gICAgdmFyIGRlbnNpdHkgPSAwLjAxO1xuICAgIHZhciByaXBwbGVTcGVlZCA9IDAuMDE7XG4gICAgdmFyIGZyZXF1ZW5jeTtcbiAgICB2YXIgY29sb3IgPSAncmdiKDIzLCAxMzksIDIwMiknO1xuICAgIHZhciB3YXZlSGVpZ2h0ID0gNDA7XG4gICAgdmFyIHdhdmVMZW5ndGggPSA0MDA7XG5cbiAgICBpZiAocmFpblZhbHVlMTBtaW4gPCAxKSB7XG4gICAgICBmcmVxdWVuY3kgPSA1ICogcmFpblZhbHVlMTBtaW47XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhaW5WYWx1ZTEwbWluIDwgNSkge1xuICAgICAgY29sb3IgPSAncmdiKDIzLCAxMzksIDIwMiknO1xuICAgICAgZnJlcXVlbmN5ID0gMTAgKiByYWluVmFsdWUxMG1pbi81OyBcbiAgICB9XG4gICAgZWxzZSBpZiAocmFpblZhbHVlMTBtaW4gPCAxMCkge1xuICAgICAgY29sb3IgPSAncmdiKDIzLCAxMzksIDIwMiknO1xuICAgICAgd2F2ZUxlbmd0aCA9IDIwMDtcbiAgICAgIGZyZXF1ZW5jeSA9IDE1KnJhaW5WYWx1ZTEwbWluLzEwO1xuICAgICAgd2F2ZUhlaWdodCA9IDgwO1xuICAgIH1cbiAgICBlbHNlIGlmIChyYWluVmFsdWUxMG1pbiA8IDE1KSB7XG4gICAgICBjb2xvciA9ICcjZjI3MTFjJztcbiAgICAgIHdhdmVMZW5ndGggPSAyMDA7XG4gICAgICBmcmVxdWVuY3kgPSAyMCpyYWluVmFsdWUxMG1pbi8xNTtcbiAgICAgIHdhdmVIZWlnaHQgPSA5MDtcbiAgICB9XG4gICAgZWxzZSBpZiAocmFpblZhbHVlMTBtaW4gPCAyMCkge1xuICAgICAgY29sb3IgPSAnI2YyNzExYyc7XG4gICAgICB3YXZlTGVuZ3RoID0gMjAwO1xuICAgICAgd2F2ZUhlaWdodCA9IDkwO1xuICAgICAgZnJlcXVlbmN5ID0gMjUqcmFpblZhbHVlMTBtaW4vMjA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29sb3IgPSAnI0RCMjgyOCc7XG4gICAgICBmcmVxdWVuY3kgPSAzMDtcbiAgICAgIHdhdmVMZW5ndGggPSAxODA7XG4gICAgICB3YXZlSGVpZ2h0ID0gMTAwO1xuICAgICAgJCgnc3BhbicpLnJlbW92ZUNsYXNzKCdyZWQnKTtcbiAgICB9XG4gICAgaWYgKGNhbnZhc0hlaWdodCA+IDUwMCkge1xuICAgICAgY2FudmFzSGVpZ2h0ID0gNTAwO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3YXZlTGVuZ3RoOiB3YXZlTGVuZ3RoLFxuICAgICAgZnJlcXVlbmN5OiBmcmVxdWVuY3ksXG4gICAgICB3YXZlSGVpZ2h0OiB3YXZlSGVpZ2h0LFxuICAgICAgZGVuc2l0eTogMC4wNCwgXG4gICAgICBjYW52YXNIZWlnaHQ6IGNhbnZhc0hlaWdodFxuICAgIH07XG5cbiAgfVxuXG5cblxufSkod2luZG93KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgZDMuanNvbignLi9kYXRhLmpzb24nLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgdmlzdWFsaXplKGRhdGEpO1xuICB9KTtcblxuICBmdW5jdGlvbiB2aXN1YWxpemUgKGRhdGEpIHtcbiAgICB2YXIgY29uZmlncyA9IHt9O1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihyZXNlcnZvaXIpIHtcbiAgICAgICB2YXIgcmVzZXJ2b2lyTmFtZSA9IHJlc2Vydm9pci5uYW1lO1xuICAgICAgIHZhciBwZXJjZW50YWdlID0gcGFyc2VGbG9hdChyZXNlcnZvaXIucGVyY2VudGFnZSkudG9GaXhlZCgxKTtcbiAgICAgICB2YXIgdXBkYXRlQXQgPSByZXNlcnZvaXIudXBkYXRlQXQ7XG4gICAgICAgdmFyIHZvbHVtbiA9IHJlc2Vydm9pci52b2x1bW47XG4gICAgICAgdmFyIGlkID0gcmVzZXJ2b2lyLmlkO1xuICAgICAgIHZhciBuZXRGbG93ID0gLXBhcnNlRmxvYXQocmVzZXJ2b2lyLmRhbGl5TmV0ZmxvdykudG9GaXhlZCgxKTtcbiAgICAgICB2YXIgbmV0UGVyY2VudGFnZVZhcjtcbiAgICAgICB2YXIgc3RhdGU7XG5cbiAgICAgICBpZiAoaXNOYU4ocGVyY2VudGFnZSkpIHtcbiAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICBjb25maWdzW3Jlc2Vydm9pck5hbWVdID0gbGlxdWlkRmlsbEdhdWdlRGVmYXVsdFNldHRpbmdzKCk7XG4gICAgICAgY29uZmlnc1tyZXNlcnZvaXJOYW1lXS53YXZlQW5pbWF0ZSA9IHRydWU7XG4gICAgICAgY29uZmlnc1tyZXNlcnZvaXJOYW1lXS53YXZlQW5pbWF0ZVRpbWUgPSBzZXRBbmltYXRlVGltZShwZXJjZW50YWdlKTtcbiAgICAgICBjb25maWdzW3Jlc2Vydm9pck5hbWVdLndhdmVPZmZzZXQgPSAwLjM7XG4gICAgICAgY29uZmlnc1tyZXNlcnZvaXJOYW1lXS53YXZlSGVpZ2h0ID0gMC4wNTtcbiAgICAgICBjb25maWdzW3Jlc2Vydm9pck5hbWVdLndhdmVDb3VudCA9IHNldFdhdmFDb3VudChwZXJjZW50YWdlKTtcbiAgICAgICBzZXRDb2xvcihjb25maWdzW3Jlc2Vydm9pck5hbWVdLCBwZXJjZW50YWdlKTtcbiAgICAgIFxuICAgICAgIC8vIGNyZWF0ZSBzdmdcbiAgICAgICAkKCcjd2F0ZXInKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJyZXNlcnZvaXJcIj4nICsgJzxoND4nICsgcmVzZXJ2b2lyTmFtZSArICc8L2g0PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPHN2ZyBpZD1cIicgKyBpZCArICdcIj4nICsgJzwvc3ZnPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bW5cIj48aDU+PC9oNT48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInN0YXRlXCI+PGg1PjwvaDU+PC9zcGFuPjwvZGl2PicpO1xuICAgICAgIC8vIGRyYXdcbiAgICAgICBsb2FkTGlxdWlkRmlsbEdhdWdlKGlkLCBwZXJjZW50YWdlLCBjb25maWdzW3Jlc2Vydm9pck5hbWVdKTtcblxuICAgICAgIC8vIHNldCB0ZXh0XG4gICAgICAgbmV0UGVyY2VudGFnZVZhciA9ICgobmV0RmxvdykgLyBwYXJzZUZsb2F0KHJlc2Vydm9pci5iYXNlQXZhaWxhYmxlKSoxMDApLnRvRml4ZWQoMik7XG4gICAgICAgaWYgKGlzTmFOKG5ldEZsb3cpKSB7XG4gICAgICAgICAgJCgnIycraWQpLnNpYmxpbmdzKCcuc3RhdGUnKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignaDUnKVxuICAgICAgICAgICAgICAgIC50ZXh0KCfmmKjml6XmsLTph4/ni4DmhYvvvJrlvoXmm7TmlrAnKTtcbiAgICAgICB9XG4gICAgICAgZWxzZSBpZiAobmV0RmxvdyA8IDApIHtcbiAgICAgICAgICQoJyMnK2lkKS5zaWJsaW5ncygnLnN0YXRlJylcbiAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbignaDUnKVxuICAgICAgICAgICAgICAgICAgLnRleHQoJ+aYqOaXpeawtOmHj+S4i+mZje+8micrIG5ldFBlcmNlbnRhZ2VWYXIgKyAnJScpO1xuICAgICAgICAgJCgnIycraWQpLnNpYmxpbmdzKCcuc3RhdGUnKS5hZGRDbGFzcygncmVkJyk7XG4gICAgICAgfVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgJCgnIycraWQpLnNpYmxpbmdzKCcuc3RhdGUnKVxuICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdoNScpXG4gICAgICAgICAgICAgICAgICAudGV4dCgn5pio5pel5rC06YeP5LiK5Y2H77yaJysgbmV0UGVyY2VudGFnZVZhciArICclJyk7XG4gICAgICAgICAkKCcjJytpZCkuc2libGluZ3MoJy5zdGF0ZScpLmFkZENsYXNzKCdibHVlJyk7XG4gICAgICAgfVxuICAgXG4gICAgICAgJCgnIycraWQpLnNpYmxpbmdzKCcudm9sdW1uJykuY2hpbGRyZW4oJ2g1JykudGV4dCgn5pyJ5pWI6JOE5rC06YeP77yaJyt2b2x1bW4rJ+iQrOeri+aWueWFrOWwuicpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29sb3IoY29uZmlnLCBwZXJjZW50YWdlKSB7XG4gICAgaWYgKHBlcmNlbnRhZ2UgPCAyNSkge1xuICAgICAgY29uZmlnLmNpcmNsZUNvbG9yID0gXCIjRkY3Nzc3XCI7XG4gICAgICBjb25maWcudGV4dENvbG9yID0gXCIjRkY0NDQ0XCI7XG4gICAgICBjb25maWcud2F2ZVRleHRDb2xvciA9IFwiI0ZGQUFBQVwiO1xuICAgICAgY29uZmlnLndhdmVDb2xvciA9IFwiI0ZGRERERFwiO1xuICAgIH1cbiAgICBlbHNlIGlmIChwZXJjZW50YWdlIDwgNTApIHtcbiAgICAgIGNvbmZpZy5jaXJjbGVDb2xvciA9IFwicmdiKDI1NSwgMTYwLCAxMTkpXCI7XG4gICAgICBjb25maWcudGV4dENvbG9yID0gXCJyZ2IoMjU1LCAxNjAsIDExOSlcIjtcbiAgICAgIGNvbmZpZy53YXZlVGV4dENvbG9yID0gXCJyZ2IoMjU1LCAxNjAsIDExOSlcIjtcbiAgICAgIGNvbmZpZy53YXZlQ29sb3IgPSBcInJnYmEoMjQ1LCAxNTEsIDExMSwgMC40OClcIjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRXYXZhQ291bnQocGVyY2VudGFnZSkge1xuICAgIGlmIChwZXJjZW50YWdlID4gNzUpIHtcbiAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgICBlbHNlIGlmIChwZXJjZW50YWdlID4gNTApIHtcbiAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEFuaW1hdGVUaW1lKHBlcmNlbnRhZ2UpIHtcbiAgICBpZiAocGVyY2VudGFnZSA+IDc1KSB7XG4gICAgICByZXR1cm4gMjAwMDtcbiAgICB9XG4gICAgZWxzZSBpZiAocGVyY2VudGFnZSA+IDUwKSB7XG4gICAgICByZXR1cm4gMzAwMDtcbiAgICB9XG4gICAgZWxzZSBpZiAocGVyY2VudGFnZSA+IDI1KSB7XG4gICAgICByZXR1cm4gNDAwMDtcbiAgICB9XG4gICAgcmV0dXJuIDUwMDA7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRaZXJvKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICBpID0gXCIwXCIgKyBpO1xuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfVxuXG59KSgpO1xuIiwiZnVuY3Rpb24gbGlxdWlkRmlsbEdhdWdlRGVmYXVsdFNldHRpbmdzKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWluVmFsdWU6IDAsIC8vIFRoZSBnYXVnZSBtaW5pbXVtIHZhbHVlLlxuICAgICAgICBtYXhWYWx1ZTogMTAwLCAvLyBUaGUgZ2F1Z2UgbWF4aW11bSB2YWx1ZS5cbiAgICAgICAgY2lyY2xlVGhpY2tuZXNzOiAwLjA1LCAvLyBUaGUgb3V0ZXIgY2lyY2xlIHRoaWNrbmVzcyBhcyBhIHBlcmNlbnRhZ2Ugb2YgaXQncyByYWRpdXMuXG4gICAgICAgIGNpcmNsZUZpbGxHYXA6IDAuMDUsIC8vIFRoZSBzaXplIG9mIHRoZSBnYXAgYmV0d2VlbiB0aGUgb3V0ZXIgY2lyY2xlIGFuZCB3YXZlIGNpcmNsZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIG91dGVyIGNpcmNsZXMgcmFkaXVzLlxuICAgICAgICBjaXJjbGVDb2xvcjogXCIjMTc4QkNBXCIsIC8vIFRoZSBjb2xvciBvZiB0aGUgb3V0ZXIgY2lyY2xlLlxuICAgICAgICB3YXZlSGVpZ2h0OiAwLjA1LCAvLyBUaGUgd2F2ZSBoZWlnaHQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSByYWRpdXMgb2YgdGhlIHdhdmUgY2lyY2xlLlxuICAgICAgICB3YXZlQ291bnQ6IDEsIC8vIFRoZSBudW1iZXIgb2YgZnVsbCB3YXZlcyBwZXIgd2lkdGggb2YgdGhlIHdhdmUgY2lyY2xlLlxuICAgICAgICB3YXZlUmlzZVRpbWU6IDEwMDAsIC8vIFRoZSBhbW91bnQgb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB3YXZlIHRvIHJpc2UgZnJvbSAwIHRvIGl0J3MgZmluYWwgaGVpZ2h0LlxuICAgICAgICB3YXZlQW5pbWF0ZVRpbWU6IDE4MDAwLCAvLyBUaGUgYW1vdW50IG9mIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGZvciBhIGZ1bGwgd2F2ZSB0byBlbnRlciB0aGUgd2F2ZSBjaXJjbGUuXG4gICAgICAgIHdhdmVSaXNlOiB0cnVlLCAvLyBDb250cm9sIGlmIHRoZSB3YXZlIHNob3VsZCByaXNlIGZyb20gMCB0byBpdCdzIGZ1bGwgaGVpZ2h0LCBvciBzdGFydCBhdCBpdCdzIGZ1bGwgaGVpZ2h0LlxuICAgICAgICB3YXZlSGVpZ2h0U2NhbGluZzogdHJ1ZSwgLy8gQ29udHJvbHMgd2F2ZSBzaXplIHNjYWxpbmcgYXQgbG93IGFuZCBoaWdoIGZpbGwgcGVyY2VudGFnZXMuIFdoZW4gdHJ1ZSwgd2F2ZSBoZWlnaHQgcmVhY2hlcyBpdCdzIG1heGltdW0gYXQgNTAlIGZpbGwsIGFuZCBtaW5pbXVtIGF0IDAlIGFuZCAxMDAlIGZpbGwuIFRoaXMgaGVscHMgdG8gcHJldmVudCB0aGUgd2F2ZSBmcm9tIG1ha2luZyB0aGUgd2F2ZSBjaXJjbGUgZnJvbSBhcHBlYXIgdG90YWxseSBmdWxsIG9yIGVtcHR5IHdoZW4gbmVhciBpdCdzIG1pbmltdW0gb3IgbWF4aW11bSBmaWxsLlxuICAgICAgICB3YXZlQW5pbWF0ZTogdHJ1ZSwgLy8gQ29udHJvbHMgaWYgdGhlIHdhdmUgc2Nyb2xscyBvciBpcyBzdGF0aWMuXG4gICAgICAgIHdhdmVDb2xvcjogXCIjMTc4QkNBXCIsIC8vIFRoZSBjb2xvciBvZiB0aGUgZmlsbCB3YXZlLlxuICAgICAgICB3YXZlT2Zmc2V0OiAwLCAvLyBUaGUgYW1vdW50IHRvIGluaXRpYWxseSBvZmZzZXQgdGhlIHdhdmUuIDAgPSBubyBvZmZzZXQuIDEgPSBvZmZzZXQgb2Ygb25lIGZ1bGwgd2F2ZS5cbiAgICAgICAgdGV4dFZlcnRQb3NpdGlvbjogLjUsIC8vIFRoZSBoZWlnaHQgYXQgd2hpY2ggdG8gZGlzcGxheSB0aGUgcGVyY2VudGFnZSB0ZXh0IHdpdGhpbmcgdGhlIHdhdmUgY2lyY2xlLiAwID0gYm90dG9tLCAxID0gdG9wLlxuICAgICAgICB0ZXh0U2l6ZTogMSwgLy8gVGhlIHJlbGF0aXZlIGhlaWdodCBvZiB0aGUgdGV4dCB0byBkaXNwbGF5IGluIHRoZSB3YXZlIGNpcmNsZS4gMSA9IDUwJVxuICAgICAgICB2YWx1ZUNvdW50VXA6IHRydWUsIC8vIElmIHRydWUsIHRoZSBkaXNwbGF5ZWQgdmFsdWUgY291bnRzIHVwIGZyb20gMCB0byBpdCdzIGZpbmFsIHZhbHVlIHVwb24gbG9hZGluZy4gSWYgZmFsc2UsIHRoZSBmaW5hbCB2YWx1ZSBpcyBkaXNwbGF5ZWQuXG4gICAgICAgIGRpc3BsYXlQZXJjZW50OiB0cnVlLCAvLyBJZiB0cnVlLCBhICUgc3ltYm9sIGlzIGRpc3BsYXllZCBhZnRlciB0aGUgdmFsdWUuXG4gICAgICAgIHRleHRDb2xvcjogXCIjMDQ1NjgxXCIsIC8vIFRoZSBjb2xvciBvZiB0aGUgdmFsdWUgdGV4dCB3aGVuIHRoZSB3YXZlIGRvZXMgbm90IG92ZXJsYXAgaXQuXG4gICAgICAgIHdhdmVUZXh0Q29sb3I6IFwiI0E0REJmOFwiIC8vIFRoZSBjb2xvciBvZiB0aGUgdmFsdWUgdGV4dCB3aGVuIHRoZSB3YXZlIG92ZXJsYXBzIGl0LlxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGxvYWRMaXF1aWRGaWxsR2F1Z2UoZWxlbWVudElkLCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgaWYoY29uZmlnID09IG51bGwpIGNvbmZpZyA9IGxpcXVpZEZpbGxHYXVnZURlZmF1bHRTZXR0aW5ncygpO1xuXG4gICAgdmFyIGdhdWdlID0gZDMuc2VsZWN0KFwiI1wiICsgZWxlbWVudElkKTtcbiAgICB2YXIgcmFkaXVzID0gTWF0aC5taW4ocGFyc2VJbnQoZ2F1Z2Uuc3R5bGUoXCJ3aWR0aFwiKSksIHBhcnNlSW50KGdhdWdlLnN0eWxlKFwiaGVpZ2h0XCIpKSkvMjtcbiAgICB2YXIgbG9jYXRpb25YID0gcGFyc2VJbnQoZ2F1Z2Uuc3R5bGUoXCJ3aWR0aFwiKSkvMiAtIHJhZGl1cztcbiAgICB2YXIgbG9jYXRpb25ZID0gcGFyc2VJbnQoZ2F1Z2Uuc3R5bGUoXCJoZWlnaHRcIikpLzIgLSByYWRpdXM7XG4gICAgdmFyIGZpbGxQZXJjZW50ID0gTWF0aC5tYXgoY29uZmlnLm1pblZhbHVlLCBNYXRoLm1pbihjb25maWcubWF4VmFsdWUsIHZhbHVlKSkvY29uZmlnLm1heFZhbHVlO1xuXG4gICAgdmFyIHdhdmVIZWlnaHRTY2FsZTtcbiAgICBpZihjb25maWcud2F2ZUhlaWdodFNjYWxpbmcpe1xuICAgICAgICB3YXZlSGVpZ2h0U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLnJhbmdlKFswLGNvbmZpZy53YXZlSGVpZ2h0LDBdKVxuICAgICAgICAgICAgLmRvbWFpbihbMCw1MCwxMDBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXZlSGVpZ2h0U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLnJhbmdlKFtjb25maWcud2F2ZUhlaWdodCxjb25maWcud2F2ZUhlaWdodF0pXG4gICAgICAgICAgICAuZG9tYWluKFswLDEwMF0pO1xuICAgIH1cblxuICAgIHZhciB0ZXh0UGl4ZWxzID0gKGNvbmZpZy50ZXh0U2l6ZSpyYWRpdXMvMik7XG4gICAgdmFyIHRleHRGaW5hbFZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSkudG9GaXhlZCgyKTtcbiAgICB2YXIgdGV4dFN0YXJ0VmFsdWUgPSBjb25maWcudmFsdWVDb3VudFVwP2NvbmZpZy5taW5WYWx1ZTp0ZXh0RmluYWxWYWx1ZTtcbiAgICB2YXIgcGVyY2VudFRleHQgPSBjb25maWcuZGlzcGxheVBlcmNlbnQ/XCIlXCI6XCJcIjtcbiAgICB2YXIgY2lyY2xlVGhpY2tuZXNzID0gY29uZmlnLmNpcmNsZVRoaWNrbmVzcyAqIHJhZGl1cztcbiAgICB2YXIgY2lyY2xlRmlsbEdhcCA9IGNvbmZpZy5jaXJjbGVGaWxsR2FwICogcmFkaXVzO1xuICAgIHZhciBmaWxsQ2lyY2xlTWFyZ2luID0gY2lyY2xlVGhpY2tuZXNzICsgY2lyY2xlRmlsbEdhcDtcbiAgICB2YXIgZmlsbENpcmNsZVJhZGl1cyA9IHJhZGl1cyAtIGZpbGxDaXJjbGVNYXJnaW47XG4gICAgdmFyIHdhdmVIZWlnaHQgPSBmaWxsQ2lyY2xlUmFkaXVzKndhdmVIZWlnaHRTY2FsZShmaWxsUGVyY2VudCoxMDApO1xuXG4gICAgdmFyIHdhdmVMZW5ndGggPSBmaWxsQ2lyY2xlUmFkaXVzKjIvY29uZmlnLndhdmVDb3VudDtcbiAgICB2YXIgd2F2ZUNsaXBDb3VudCA9IDErY29uZmlnLndhdmVDb3VudDtcbiAgICB2YXIgd2F2ZUNsaXBXaWR0aCA9IHdhdmVMZW5ndGgqd2F2ZUNsaXBDb3VudDtcblxuICAgIC8vIFJvdW5kaW5nIGZ1bmN0aW9ucyBzbyB0aGF0IHRoZSBjb3JyZWN0IG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyBpcyBhbHdheXMgZGlzcGxheWVkIGFzIHRoZSB2YWx1ZSBjb3VudHMgdXAuXG4gICAgdmFyIHRleHRSb3VuZGVyID0gZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSk7IH07XG4gICAgaWYocGFyc2VGbG9hdCh0ZXh0RmluYWxWYWx1ZSkgIT0gcGFyc2VGbG9hdCh0ZXh0Um91bmRlcih0ZXh0RmluYWxWYWx1ZSkpKXtcbiAgICAgICAgdGV4dFJvdW5kZXIgPSBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKS50b0ZpeGVkKDEpOyB9O1xuICAgIH1cbiAgICBpZihwYXJzZUZsb2F0KHRleHRGaW5hbFZhbHVlKSAhPSBwYXJzZUZsb2F0KHRleHRSb3VuZGVyKHRleHRGaW5hbFZhbHVlKSkpe1xuICAgICAgICB0ZXh0Um91bmRlciA9IGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpLnRvRml4ZWQoMik7IH07XG4gICAgfVxuXG4gICAgLy8gRGF0YSBmb3IgYnVpbGRpbmcgdGhlIGNsaXAgd2F2ZSBhcmVhLlxuICAgIHZhciBkYXRhID0gW107XG4gICAgZm9yKHZhciBpID0gMDsgaSA8PSA0MCp3YXZlQ2xpcENvdW50OyBpKyspe1xuICAgICAgICBkYXRhLnB1c2goe3g6IGkvKDQwKndhdmVDbGlwQ291bnQpLCB5OiAoaS8oNDApKX0pO1xuICAgIH1cblxuICAgIC8vIFNjYWxlcyBmb3IgZHJhd2luZyB0aGUgb3V0ZXIgY2lyY2xlLlxuICAgIHZhciBnYXVnZUNpcmNsZVggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCwyKk1hdGguUEldKS5kb21haW4oWzAsMV0pO1xuICAgIHZhciBnYXVnZUNpcmNsZVkgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCxyYWRpdXNdKS5kb21haW4oWzAscmFkaXVzXSk7XG5cbiAgICAvLyBTY2FsZXMgZm9yIGNvbnRyb2xsaW5nIHRoZSBzaXplIG9mIHRoZSBjbGlwcGluZyBwYXRoLlxuICAgIHZhciB3YXZlU2NhbGVYID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzAsd2F2ZUNsaXBXaWR0aF0pLmRvbWFpbihbMCwxXSk7XG4gICAgdmFyIHdhdmVTY2FsZVkgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCx3YXZlSGVpZ2h0XSkuZG9tYWluKFswLDFdKTtcblxuICAgIC8vIFNjYWxlcyBmb3IgY29udHJvbGxpbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBjbGlwcGluZyBwYXRoLlxuICAgIHZhciB3YXZlUmlzZVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgICAgLy8gVGhlIGNsaXBwaW5nIGFyZWEgc2l6ZSBpcyB0aGUgaGVpZ2h0IG9mIHRoZSBmaWxsIGNpcmNsZSArIHRoZSB3YXZlIGhlaWdodCwgc28gd2UgcG9zaXRpb24gdGhlIGNsaXAgd2F2ZVxuICAgICAgICAvLyBzdWNoIHRoYXQgdGhlIGl0IHdpbGwgd29uJ3Qgb3ZlcmxhcCB0aGUgZmlsbCBjaXJjbGUgYXQgYWxsIHdoZW4gYXQgMCUsIGFuZCB3aWxsIHRvdGFsbHkgY292ZXIgdGhlIGZpbGxcbiAgICAgICAgLy8gY2lyY2xlIGF0IDEwMCUuXG4gICAgICAgIC5yYW5nZShbKGZpbGxDaXJjbGVNYXJnaW4rZmlsbENpcmNsZVJhZGl1cyoyK3dhdmVIZWlnaHQpLChmaWxsQ2lyY2xlTWFyZ2luLXdhdmVIZWlnaHQpXSlcbiAgICAgICAgLmRvbWFpbihbMCwxXSk7XG4gICAgdmFyIHdhdmVBbmltYXRlU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAucmFuZ2UoWzAsIHdhdmVDbGlwV2lkdGgtZmlsbENpcmNsZVJhZGl1cyoyXSkgLy8gUHVzaCB0aGUgY2xpcCBhcmVhIG9uZSBmdWxsIHdhdmUgdGhlbiBzbmFwIGJhY2suXG4gICAgICAgIC5kb21haW4oWzAsMV0pO1xuXG4gICAgLy8gU2NhbGUgZm9yIGNvbnRyb2xsaW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgdGV4dCB3aXRoaW4gdGhlIGdhdWdlLlxuICAgIHZhciB0ZXh0UmlzZVNjYWxlWSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgIC5yYW5nZShbZmlsbENpcmNsZU1hcmdpbitmaWxsQ2lyY2xlUmFkaXVzKjIsKGZpbGxDaXJjbGVNYXJnaW4rdGV4dFBpeGVscyowLjcpXSlcbiAgICAgICAgLmRvbWFpbihbMCwxXSk7XG5cbiAgICAvLyBDZW50ZXIgdGhlIGdhdWdlIHdpdGhpbiB0aGUgcGFyZW50IFNWRy5cbiAgICB2YXIgZ2F1Z2VHcm91cCA9IGdhdWdlLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZSgnK2xvY2F0aW9uWCsnLCcrbG9jYXRpb25ZKycpJyk7XG5cbiAgICAvLyBEcmF3IHRoZSBvdXRlciBjaXJjbGUuXG4gICAgdmFyIGdhdWdlQ2lyY2xlQXJjID0gZDMuc3ZnLmFyYygpXG4gICAgICAgIC5zdGFydEFuZ2xlKGdhdWdlQ2lyY2xlWCgwKSlcbiAgICAgICAgLmVuZEFuZ2xlKGdhdWdlQ2lyY2xlWCgxKSlcbiAgICAgICAgLm91dGVyUmFkaXVzKGdhdWdlQ2lyY2xlWShyYWRpdXMpKVxuICAgICAgICAuaW5uZXJSYWRpdXMoZ2F1Z2VDaXJjbGVZKHJhZGl1cy1jaXJjbGVUaGlja25lc3MpKTtcbiAgICBnYXVnZUdyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmF0dHIoXCJkXCIsIGdhdWdlQ2lyY2xlQXJjKVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGNvbmZpZy5jaXJjbGVDb2xvcilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZSgnK3JhZGl1cysnLCcrcmFkaXVzKycpJyk7XG5cbiAgICAvLyBUZXh0IHdoZXJlIHRoZSB3YXZlIGRvZXMgbm90IG92ZXJsYXAuXG4gICAgdmFyIHRleHQxID0gZ2F1Z2VHcm91cC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC50ZXh0KHRleHRSb3VuZGVyKHRleHRTdGFydFZhbHVlKSArIHBlcmNlbnRUZXh0KVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlxdWlkRmlsbEdhdWdlVGV4dFwiKVxuICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIHRleHRQaXhlbHMgKyBcInB4XCIpXG4gICAgICAgIC5zdHlsZShcImZpbGxcIiwgY29uZmlnLnRleHRDb2xvcilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZSgnK3JhZGl1cysnLCcrdGV4dFJpc2VTY2FsZVkoY29uZmlnLnRleHRWZXJ0UG9zaXRpb24pKycpJyk7XG5cbiAgICAvLyBUaGUgY2xpcHBpbmcgd2F2ZSBhcmVhLlxuICAgIHZhciBjbGlwQXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4gd2F2ZVNjYWxlWChkLngpOyB9IClcbiAgICAgICAgLnkwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHdhdmVTY2FsZVkoTWF0aC5zaW4oTWF0aC5QSSoyKmNvbmZpZy53YXZlT2Zmc2V0Ki0xICsgTWF0aC5QSSoyKigxLWNvbmZpZy53YXZlQ291bnQpICsgZC55KjIqTWF0aC5QSSkpO30gKVxuICAgICAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4gKGZpbGxDaXJjbGVSYWRpdXMqMiArIHdhdmVIZWlnaHQpOyB9ICk7XG4gICAgdmFyIHdhdmVHcm91cCA9IGdhdWdlR3JvdXAuYXBwZW5kKFwiZGVmc1wiKVxuICAgICAgICAuYXBwZW5kKFwiY2xpcFBhdGhcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImNsaXBXYXZlXCIgKyBlbGVtZW50SWQpO1xuICAgIHZhciB3YXZlID0gd2F2ZUdyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKGRhdGEpXG4gICAgICAgIC5hdHRyKFwiZFwiLCBjbGlwQXJlYSk7XG5cbiAgICAvLyBUaGUgaW5uZXIgY2lyY2xlIHdpdGggdGhlIGNsaXBwaW5nIHdhdmUgYXR0YWNoZWQuXG4gICAgdmFyIGZpbGxDaXJjbGVHcm91cCA9IGdhdWdlR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsaXAtcGF0aFwiLCBcInVybCgjY2xpcFdhdmVcIiArIGVsZW1lbnRJZCArIFwiKVwiKTtcbiAgICBmaWxsQ2lyY2xlR3JvdXAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRyKFwiY3hcIiwgcmFkaXVzKVxuICAgICAgICAuYXR0cihcImN5XCIsIHJhZGl1cylcbiAgICAgICAgLmF0dHIoXCJyXCIsIGZpbGxDaXJjbGVSYWRpdXMpXG4gICAgICAgIC5zdHlsZShcImZpbGxcIiwgY29uZmlnLndhdmVDb2xvcik7XG5cbiAgICAvLyBUZXh0IHdoZXJlIHRoZSB3YXZlIGRvZXMgb3ZlcmxhcC5cbiAgICB2YXIgdGV4dDIgPSBmaWxsQ2lyY2xlR3JvdXAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAudGV4dCh0ZXh0Um91bmRlcih0ZXh0U3RhcnRWYWx1ZSkgKyBwZXJjZW50VGV4dClcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpcXVpZEZpbGxHYXVnZVRleHRcIilcbiAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCB0ZXh0UGl4ZWxzICsgXCJweFwiKVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGNvbmZpZy53YXZlVGV4dENvbG9yKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywndHJhbnNsYXRlKCcrcmFkaXVzKycsJyt0ZXh0UmlzZVNjYWxlWShjb25maWcudGV4dFZlcnRQb3NpdGlvbikrJyknKTtcblxuICAgIC8vIE1ha2UgdGhlIHZhbHVlIGNvdW50IHVwLlxuICAgIGlmKGNvbmZpZy52YWx1ZUNvdW50VXApe1xuICAgICAgICB2YXIgdGV4dFR3ZWVuID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy50ZXh0Q29udGVudCwgdGV4dEZpbmFsVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgdGhpcy50ZXh0Q29udGVudCA9IHRleHRSb3VuZGVyKGkodCkpICsgcGVyY2VudFRleHQ7IH1cbiAgICAgICAgfTtcbiAgICAgICAgdGV4dDEudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oY29uZmlnLndhdmVSaXNlVGltZSlcbiAgICAgICAgICAgIC50d2VlbihcInRleHRcIiwgdGV4dFR3ZWVuKTtcbiAgICAgICAgdGV4dDIudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oY29uZmlnLndhdmVSaXNlVGltZSlcbiAgICAgICAgICAgIC50d2VlbihcInRleHRcIiwgdGV4dFR3ZWVuKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIHRoZSB3YXZlIHJpc2UuIHdhdmUgYW5kIHdhdmVHcm91cCBhcmUgc2VwYXJhdGUgc28gdGhhdCBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBtb3ZlbWVudCBjYW4gYmUgY29udHJvbGxlZCBpbmRlcGVuZGVudGx5LlxuICAgIHZhciB3YXZlR3JvdXBYUG9zaXRpb24gPSBmaWxsQ2lyY2xlTWFyZ2luK2ZpbGxDaXJjbGVSYWRpdXMqMi13YXZlQ2xpcFdpZHRoO1xuICAgIGlmKGNvbmZpZy53YXZlUmlzZSl7XG4gICAgICAgIHdhdmVHcm91cC5hdHRyKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoJyt3YXZlR3JvdXBYUG9zaXRpb24rJywnK3dhdmVSaXNlU2NhbGUoMCkrJyknKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKGNvbmZpZy53YXZlUmlzZVRpbWUpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywndHJhbnNsYXRlKCcrd2F2ZUdyb3VwWFBvc2l0aW9uKycsJyt3YXZlUmlzZVNjYWxlKGZpbGxQZXJjZW50KSsnKScpXG4gICAgICAgICAgICAuZWFjaChcInN0YXJ0XCIsIGZ1bmN0aW9uKCl7IHdhdmUuYXR0cigndHJhbnNmb3JtJywndHJhbnNsYXRlKDEsMCknKTsgfSk7IC8vIFRoaXMgdHJhbnNmb3JtIGlzIG5lY2Vzc2FyeSB0byBnZXQgdGhlIGNsaXAgd2F2ZSBwb3NpdGlvbmVkIGNvcnJlY3RseSB3aGVuIHdhdmVSaXNlPXRydWUgYW5kIHdhdmVBbmltYXRlPWZhbHNlLiBUaGUgd2F2ZSB3aWxsIG5vdCBwb3NpdGlvbiBjb3JyZWN0bHkgd2l0aG91dCB0aGlzLCBidXQgaXQncyBub3QgY2xlYXIgd2h5IHRoaXMgaXMgYWN0dWFsbHkgbmVjZXNzYXJ5LlxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdhdmVHcm91cC5hdHRyKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoJyt3YXZlR3JvdXBYUG9zaXRpb24rJywnK3dhdmVSaXNlU2NhbGUoZmlsbFBlcmNlbnQpKycpJyk7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLndhdmVBbmltYXRlKSBhbmltYXRlV2F2ZSgpO1xuXG4gICAgZnVuY3Rpb24gYW5pbWF0ZVdhdmUoKSB7XG4gICAgICAgIHdhdmUudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oY29uZmlnLndhdmVBbmltYXRlVGltZSlcbiAgICAgICAgICAgIC5lYXNlKFwibGluZWFyXCIpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywndHJhbnNsYXRlKCcrd2F2ZUFuaW1hdGVTY2FsZSgxKSsnLDApJylcbiAgICAgICAgICAgIC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2F2ZS5hdHRyKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoJyt3YXZlQW5pbWF0ZVNjYWxlKDApKycsMCknKTtcbiAgICAgICAgICAgICAgICBhbmltYXRlV2F2ZShjb25maWcud2F2ZUFuaW1hdGVUaW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIi8qXG4gKiAgUXVlcnkgVUkgcGx1Z2luIGZvciByYWluZHJvcHMgb24gd2F0ZXIgZWZmZWN0LlxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9kLWhhcmVsL3JhaW5kcm9wcy5naXRcbiAqL1xuJC53aWRnZXQoXCJ3YXRlci5yYWluZHJvcHNcIiwge1xuICBvcHRpb25zOiB7XG4gICAgd2F2ZUxlbmd0aDogMzQwLCAvLyBXYXZlIExlbmd0aC4gQSBudW1lcmljIHZhbHVlLiBUaGUgaGlnaGVyIHRoZSBudW1iZXIsIHRoZSBzbWFsbGVyIHRoZSB3YXZlIGxlbmd0aC5cbiAgICBjYW52YXNXaWR0aDogMCwgLy8gV2lkdGggb2YgdGhlICB3YXRlci4gRGVmYXVsdCBpcyAxMDAlIG9mIHRoZSBwYXJlbnQncyB3aWR0aFxuICAgIGNhbnZhc0hlaWdodDogMCwgLy8gSGVpZ2h0IG9mIHRoZSB3YXRlci4gRGVmYXVsdCBpcyA1MCUgb2YgdGhlIHBhcmVudCdzIGhlaWdodCBcbiAgICBjb2xvcjogJyMwMGFlZWYnLCAvLyBXYXRlciBDb2xvclxuICAgIGZyZXF1ZW5jeTogMywgLy8gUmFpbmRyb3BzIGZyZXF1ZW5jeS4gSGlnaGVyIG51bWJlciBtZWFucyBtb3JlIGZyZXF1ZW50IHJhaW5kcm9wcy5cbiAgICB3YXZlSGVpZ2h0OiAxMDAsIC8vIFdhdmUgaGVpZ2h0LiBIaWdoZXIgbnVtYmVyIG1lYW5zIGhpZ2hlciB3YXZlcyBjcmVhdGVkIGJ5IHJhaW5kcm9wcy5cbiAgICBkZW5zaXR5OiAwLjAyLCAvLyBXYXRlciBkZW5zaXR5LiBIaWdoZXIgbnVtYmVyIG1lYW5zIHNob3J0ZXIgcmlwcGxlcy5cbiAgICByaXBwbGVTcGVlZDogMC4xLCAvLyBTcGVlZCBvZiB0aGUgcmlwcGxlIGVmZmVjdC4gSGlnaGVyIG51bWJlciBtZWFucyBmYXN0ZXIgcmlwcGxlcy5cbiAgICByaWdodFBhZGRpbmc6IDIwLCAvLyBUbyBjb3ZlciB1bndhbnRlZCBnYXBzIGNyZWF0ZWQgYnkgdGhlIGFuaW1hdGlvbi5cbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBwb3NpdGlvbkJvdHRvbTogMCxcbiAgICBwb3NpdGlvbkxlZnQ6IDBcbiAgfSxcbiAgX2NyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhbnZhcyA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5jYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5jYW52YXNIZWlnaHQgPSB0aGlzLmVsZW1lbnQuaGVpZ2h0KCkgLyAyO1xuICAgIH1cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5jYW52YXNXaWR0aCkge1xuICAgICAgdGhpcy5vcHRpb25zLmNhbnZhc1dpZHRoID0gdGhpcy5lbGVtZW50LndpZHRoKCk7XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucy5yZWFsV2lkdGggPSB0aGlzLm9wdGlvbnMuY2FudmFzV2lkdGggKyB0aGlzLm9wdGlvbnMucmlnaHRQYWRkaW5nO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMuY2FudmFzSGVpZ2h0O1xuICAgIGNhbnZhcy53aWR0aCA9IHRoaXMub3B0aW9ucy5yZWFsV2lkdGg7XG5cbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMub3B0aW9ucy5jb2xvcjtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGNhbnZhcyk7XG4gICAgY2FudmFzLnBhcmVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICBjYW52YXMucGFyZW50RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uO1xuICAgIGNhbnZhcy5zdHlsZS5ib3R0b20gPSB0aGlzLm9wdGlvbnMucG9zaXRpb25Cb3R0b207XG4gICAgY2FudmFzLnN0eWxlLmxlZnQgPSB0aGlzLm9wdGlvbnMucG9zaXRpb25MZWZ0O1xuXG4gICAgdGhpcy5zcHJpbmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMud2F2ZUxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNwcmluZ3NbaV0gPSBuZXcgdGhpcy5TcHJpbmcoKTtcbiAgICB9XG5cbiAgICByYWluZHJvcHNBbmltYXRpb25UaWNrKHRoaXMpO1xuICB9LFxuICBTcHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucCA9IDA7XG4gICAgdGhpcy52ID0gMDtcbiAgICAvL3RoaXMudXBkYXRlID0gZnVuY3Rpb24gKGRhbXAsIHRlbnMpXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihkZW5zaXR5LCByaXBwbGVTcGVlZCkge1xuICAgICAgLy90aGlzLnYgKz0gKC10ZW5zICogdGhpcy5wIC0gZGFtcCAqIHRoaXMudik7XG4gICAgICB0aGlzLnYgKz0gKC1yaXBwbGVTcGVlZCAqIHRoaXMucCAtIGRlbnNpdHkgKiB0aGlzLnYpO1xuICAgICAgdGhpcy5wICs9IHRoaXMudjtcbiAgICB9O1xuICB9LFxuICB1cGRhdGVTcHJpbmdzOiBmdW5jdGlvbihzcHJlYWQpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLndhdmVMZW5ndGg7IGkrKykge1xuICAgICAgLy90aGlzLnNwcmluZ3NbaV0udXBkYXRlKDAuMDIsIDAuMSk7XG4gICAgICB0aGlzLnNwcmluZ3NbaV0udXBkYXRlKHRoaXMub3B0aW9ucy5kZW5zaXR5LCB0aGlzLm9wdGlvbnMucmlwcGxlU3BlZWQpO1xuICAgIH1cblxuICAgIHZhciBsZWZ0RGVsdGFzID0gW10sXG4gICAgICByaWdodERlbHRhcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgdCA9IDA7IHQgPCA4OyB0KyspIHtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy53YXZlTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgbGVmdERlbHRhc1tpXSA9IHNwcmVhZCAqICh0aGlzLnNwcmluZ3NbaV0ucCAtIHRoaXMuc3ByaW5nc1tpIC0gMV0ucCk7XG4gICAgICAgICAgdGhpcy5zcHJpbmdzW2kgLSAxXS52ICs9IGxlZnREZWx0YXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPCB0aGlzLm9wdGlvbnMud2F2ZUxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByaWdodERlbHRhc1tpXSA9IHNwcmVhZCAqICh0aGlzLnNwcmluZ3NbaV0ucCAtIHRoaXMuc3ByaW5nc1tpICsgMV0ucCk7XG4gICAgICAgICAgdGhpcy5zcHJpbmdzW2kgKyAxXS52ICs9IHJpZ2h0RGVsdGFzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMud2F2ZUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpID4gMClcbiAgICAgICAgICB0aGlzLnNwcmluZ3NbaSAtIDFdLnAgKz0gbGVmdERlbHRhc1tpXTtcbiAgICAgICAgaWYgKGkgPCB0aGlzLm9wdGlvbnMud2F2ZUxlbmd0aCAtIDEpXG4gICAgICAgICAgdGhpcy5zcHJpbmdzW2kgKyAxXS5wICs9IHJpZ2h0RGVsdGFzW2ldO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH0sXG4gIHJlbmRlcldhdmVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaTtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgdGhpcy5vcHRpb25zLmNhbnZhc0hlaWdodCk7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy53YXZlTGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyhpICogKHRoaXMub3B0aW9ucy5yZWFsV2lkdGggLyB0aGlzLm9wdGlvbnMud2F2ZUxlbmd0aCksICh0aGlzLm9wdGlvbnMuY2FudmFzSGVpZ2h0IC8gMikgKyB0aGlzLnNwcmluZ3NbaV0ucCk7XG4gICAgfVxuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLm9wdGlvbnMucmVhbFdpZHRoLCB0aGlzLm9wdGlvbnMuY2FudmFzSGVpZ2h0KTtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiByYWluZHJvcHNBbmltYXRpb25UaWNrKGRyb3ApIHtcbiAgdmFyIGZwcyA9IDYwO1xuXG4gIGlmICghZG9jdW1lbnQuY29udGFpbnMoZHJvcC5lbGVtZW50WzBdKSkgcmV0dXJuO1xuXG4gIGlmIChpc0luVmlldygkKCcjJyArIGRyb3AuZWxlbWVudFswXS5pZCkpKSB7XG5cbiAgICBpZiAoKE1hdGgucmFuZG9tKCkgKiAxMDApIDwgZHJvcC5vcHRpb25zLmZyZXF1ZW5jeSlcbiAgICAgIGRyb3Auc3ByaW5nc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkcm9wLm9wdGlvbnMud2F2ZUxlbmd0aCldLnAgPSBkcm9wLm9wdGlvbnMud2F2ZUhlaWdodDtcblxuICAgIGRyb3AuY3R4LmNsZWFyUmVjdCgwLCAwLCBkcm9wLm9wdGlvbnMucmVhbFdpZHRoLCBkcm9wLm9wdGlvbnMuY2FudmFzSGVpZ2h0KTtcbiAgICBkcm9wLnVwZGF0ZVNwcmluZ3MoMC4xKTtcbiAgICBkcm9wLnJlbmRlcldhdmVzKCk7XG4gIH1cblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgIHJhaW5kcm9wc0FuaW1hdGlvblRpY2soZHJvcCk7XG4gICAgfSwgMjAwMCAvIGZwcyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc0luVmlldyhlbCkge1xuICB2YXIgd2luID0gJCh3aW5kb3cpO1xuICB2YXIgdmlld3BvcnQgPSB7XG4gICAgdG9wOiB3aW4uc2Nyb2xsVG9wKCksXG4gICAgbGVmdDogd2luLnNjcm9sbExlZnQoKVxuICB9O1xuICB2aWV3cG9ydC5yaWdodCA9IHZpZXdwb3J0LmxlZnQgKyB3aW4ud2lkdGgoKTtcbiAgdmlld3BvcnQuYm90dG9tID0gdmlld3BvcnQudG9wICsgd2luLmhlaWdodCgpO1xuXG4gIHZhciBib3VuZHMgPSBlbC5vZmZzZXQoKTtcbiAgYm91bmRzLnJpZ2h0ID0gYm91bmRzLmxlZnQgKyBlbC5vdXRlcldpZHRoKCk7XG4gIGJvdW5kcy5ib3R0b20gPSBib3VuZHMudG9wICsgZWwub3V0ZXJIZWlnaHQoKTtcblxuICByZXR1cm4gKCEodmlld3BvcnQucmlnaHQgPCBib3VuZHMubGVmdCB8fCB2aWV3cG9ydC5sZWZ0ID4gYm91bmRzLnJpZ2h0IHx8XG4gICAgdmlld3BvcnQuYm90dG9tIDwgYm91bmRzLnRvcCB8fCB2aWV3cG9ydC50b3AgPiBib3VuZHMuYm90dG9tKSk7XG59XG4iLCIvKiFcbiAqIHJhaW55ZGF5LmpzIHYwLjEuMiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJvc2xhdy9yYWlueWRheS5qc1xuICogQ29weXJpZ2h0IChjKSAyMDE1IE1hcmVrIEJyb2R6aWFrXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgR1BMdjIgbGljZW5zZVxuICovXG5mdW5jdGlvbiBSYWlueURheShhLGIpe2lmKHRoaXM9PT13aW5kb3cpcmV0dXJuIG5ldyBSYWlueURheShhLGIpO3RoaXMuaW1nPWEuaW1hZ2U7dmFyIGM9e29wYWNpdHk6MSxibHVyOjEwLGNyb3A6WzAsMCx0aGlzLmltZy5uYXR1cmFsV2lkdGgsdGhpcy5pbWcubmF0dXJhbEhlaWdodF0sZW5hYmxlU2l6ZUNoYW5nZTohMCxwYXJlbnRFbGVtZW50OmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSxmcHM6MzAsZmlsbFN0eWxlOlwiIzhFRDZGRlwiLGVuYWJsZUNvbGxpc2lvbnM6ITAsZ3Jhdml0eVRocmVzaG9sZDozLGdyYXZpdHlBbmdsZTpNYXRoLlBJLzIsZ3Jhdml0eUFuZ2xlVmFyaWFuY2U6MCxyZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yOjUscmVmbGVjdGlvbkRyb3BNYXBwaW5nV2lkdGg6MjAwLHJlZmxlY3Rpb25Ecm9wTWFwcGluZ0hlaWdodDoyMDAsd2lkdGg6dGhpcy5pbWcuY2xpZW50V2lkdGgsaGVpZ2h0OnRoaXMuaW1nLmNsaWVudEhlaWdodCxwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjAsbGVmdDowfTtmb3IodmFyIGQgaW4gYylcInVuZGVmaW5lZFwiPT10eXBlb2YgYVtkXSYmKGFbZF09Y1tkXSk7dGhpcy5vcHRpb25zPWEsdGhpcy5kcm9wcz1bXSx0aGlzLmNhbnZhcz1ifHx0aGlzLnByZXBhcmVDYW52YXMoKSx0aGlzLnByZXBhcmVCYWNrZ3JvdW5kKCksdGhpcy5wcmVwYXJlR2xhc3MoKSx0aGlzLnJlZmxlY3Rpb249dGhpcy5SRUZMRUNUSU9OX01JTklBVFVSRSx0aGlzLnRyYWlsPXRoaXMuVFJBSUxfRFJPUFMsdGhpcy5ncmF2aXR5PXRoaXMuR1JBVklUWV9OT05fTElORUFSLHRoaXMuY29sbGlzaW9uPXRoaXMuQ09MTElTSU9OX1NJTVBMRSx0aGlzLnNldFJlcXVlc3RBbmltRnJhbWUoKX1mdW5jdGlvbiBEcm9wKGEsYixjLGQsZSl7dGhpcy54PU1hdGguZmxvb3IoYiksdGhpcy55PU1hdGguZmxvb3IoYyksdGhpcy5yPU1hdGgucmFuZG9tKCkqZStkLHRoaXMucmFpbnlkYXk9YSx0aGlzLmNvbnRleHQ9YS5jb250ZXh0LHRoaXMucmVmbGVjdGlvbj1hLnJlZmxlY3RlZH1mdW5jdGlvbiBCbHVyU3RhY2soKXt0aGlzLnI9MCx0aGlzLmc9MCx0aGlzLmI9MCx0aGlzLm5leHQ9bnVsbH1mdW5jdGlvbiBDb2xsaXNpb25NYXRyaXgoYSxiLGMpe3RoaXMucmVzb2x1dGlvbj1jLHRoaXMueGM9YSx0aGlzLnljPWIsdGhpcy5tYXRyaXg9bmV3IEFycmF5KGEpO2Zvcih2YXIgZD0wO2ErNT49ZDtkKyspe3RoaXMubWF0cml4W2RdPW5ldyBBcnJheShiKTtmb3IodmFyIGU9MDtiKzU+PWU7KytlKXRoaXMubWF0cml4W2RdW2VdPW5ldyBEcm9wSXRlbShudWxsKX19ZnVuY3Rpb24gRHJvcEl0ZW0oYSl7dGhpcy5kcm9wPWEsdGhpcy5uZXh0PW51bGx9UmFpbnlEYXkucHJvdG90eXBlLnByZXBhcmVDYW52YXM9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiBhLnN0eWxlLnBvc2l0aW9uPXRoaXMub3B0aW9ucy5wb3NpdGlvbixhLnN0eWxlLnRvcD10aGlzLm9wdGlvbnMudG9wLGEuc3R5bGUubGVmdD10aGlzLm9wdGlvbnMubGVmdCxhLndpZHRoPXRoaXMub3B0aW9ucy53aWR0aCxhLmhlaWdodD10aGlzLm9wdGlvbnMuaGVpZ2h0LHRoaXMub3B0aW9ucy5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGEpLHRoaXMub3B0aW9ucy5lbmFibGVTaXplQ2hhbmdlJiZ0aGlzLnNldFJlc2l6ZUhhbmRsZXIoKSxhfSxSYWlueURheS5wcm90b3R5cGUuc2V0UmVzaXplSGFuZGxlcj1mdW5jdGlvbigpe251bGwhPT13aW5kb3cub25yZXNpemU/d2luZG93LnNldEludGVydmFsKHRoaXMuY2hlY2tTaXplLmJpbmQodGhpcyksMTAwKTood2luZG93Lm9ucmVzaXplPXRoaXMuY2hlY2tTaXplLmJpbmQodGhpcyksd2luZG93Lm9ub3JpZW50YXRpb25jaGFuZ2U9dGhpcy5jaGVja1NpemUuYmluZCh0aGlzKSl9LFJhaW55RGF5LnByb3RvdHlwZS5jaGVja1NpemU9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmltZy5jbGllbnRXaWR0aCxiPXRoaXMuaW1nLmNsaWVudEhlaWdodCxjPXRoaXMuaW1nLm9mZnNldExlZnQsZD10aGlzLmltZy5vZmZzZXRUb3AsZT10aGlzLmNhbnZhcy53aWR0aCxmPXRoaXMuY2FudmFzLmhlaWdodCxnPXRoaXMuY2FudmFzLm9mZnNldExlZnQsaD10aGlzLmNhbnZhcy5vZmZzZXRUb3A7KGUhPT1hfHxmIT09YikmJih0aGlzLmNhbnZhcy53aWR0aD1hLHRoaXMuY2FudmFzLmhlaWdodD1iLHRoaXMucHJlcGFyZUJhY2tncm91bmQoKSx0aGlzLmdsYXNzLndpZHRoPXRoaXMuY2FudmFzLndpZHRoLHRoaXMuZ2xhc3MuaGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodCx0aGlzLnByZXBhcmVSZWZsZWN0aW9ucygpKSwoZyE9PWN8fGghPT1kKSYmKHRoaXMuY2FudmFzLm9mZnNldExlZnQ9Yyx0aGlzLmNhbnZhcy5vZmZzZXRUb3A9ZCl9LFJhaW55RGF5LnByb3RvdHlwZS5hbmltYXRlRHJvcHM9ZnVuY3Rpb24oKXtpZihkb2N1bWVudC5jb250YWlucyh0aGlzLmNhbnZhcykpe3RoaXMuYWRkRHJvcENhbGxiYWNrJiZ0aGlzLmFkZERyb3BDYWxsYmFjaygpO2Zvcih2YXIgYT10aGlzLmRyb3BzLnNsaWNlKCksYj1bXSxjPTA7YzxhLmxlbmd0aDsrK2MpYVtjXS5hbmltYXRlKCkmJmIucHVzaChhW2NdKTt0aGlzLmRyb3BzPWIsd2luZG93LnJlcXVlc3RBbmltRnJhbWUodGhpcy5hbmltYXRlRHJvcHMuYmluZCh0aGlzKSl9fSxSYWlueURheS5wcm90b3R5cGUuc2V0UmVxdWVzdEFuaW1GcmFtZT1mdW5jdGlvbigpe3ZhciBhPXRoaXMub3B0aW9ucy5mcHM7d2luZG93LnJlcXVlc3RBbmltRnJhbWU9ZnVuY3Rpb24oKXtyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oYil7d2luZG93LnNldFRpbWVvdXQoYiwxZTMvYSl9fSgpfSxSYWlueURheS5wcm90b3R5cGUucHJlcGFyZVJlZmxlY3Rpb25zPWZ1bmN0aW9uKCl7dGhpcy5yZWZsZWN0ZWQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLnJlZmxlY3RlZC53aWR0aD10aGlzLmNhbnZhcy53aWR0aC90aGlzLm9wdGlvbnMucmVmbGVjdGlvblNjYWxlZG93bkZhY3Rvcix0aGlzLnJlZmxlY3RlZC5oZWlnaHQ9dGhpcy5jYW52YXMuaGVpZ2h0L3RoaXMub3B0aW9ucy5yZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yO3ZhciBhPXRoaXMucmVmbGVjdGVkLmdldENvbnRleHQoXCIyZFwiKTthLmRyYXdJbWFnZSh0aGlzLmltZyx0aGlzLm9wdGlvbnMuY3JvcFswXSx0aGlzLm9wdGlvbnMuY3JvcFsxXSx0aGlzLm9wdGlvbnMuY3JvcFsyXSx0aGlzLm9wdGlvbnMuY3JvcFszXSwwLDAsdGhpcy5yZWZsZWN0ZWQud2lkdGgsdGhpcy5yZWZsZWN0ZWQuaGVpZ2h0KX0sUmFpbnlEYXkucHJvdG90eXBlLnByZXBhcmVHbGFzcz1mdW5jdGlvbigpe3RoaXMuZ2xhc3M9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLmdsYXNzLndpZHRoPXRoaXMuY2FudmFzLndpZHRoLHRoaXMuZ2xhc3MuaGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodCx0aGlzLmNvbnRleHQ9dGhpcy5nbGFzcy5nZXRDb250ZXh0KFwiMmRcIil9LFJhaW55RGF5LnByb3RvdHlwZS5yYWluPWZ1bmN0aW9uKGEsYil7aWYodGhpcy5yZWZsZWN0aW9uIT09dGhpcy5SRUZMRUNUSU9OX05PTkUmJnRoaXMucHJlcGFyZVJlZmxlY3Rpb25zKCksdGhpcy5hbmltYXRlRHJvcHMoKSx0aGlzLnByZXNldHM9YSx0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWT0uMDAxKnRoaXMub3B0aW9ucy5mcHMvMjUsdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1g9KE1hdGguUEkvMi10aGlzLm9wdGlvbnMuZ3Jhdml0eUFuZ2xlKSooLjAwMSp0aGlzLm9wdGlvbnMuZnBzKS81MCx0aGlzLm9wdGlvbnMuZW5hYmxlQ29sbGlzaW9ucyl7Zm9yKHZhciBjPTAsZD0wO2Q8YS5sZW5ndGg7ZCsrKWFbZF1bMF0rYVtkXVsxXT5jJiYoYz1NYXRoLmZsb29yKGFbZF1bMF0rYVtkXVsxXSkpO2lmKGM+MCl7dmFyIGU9TWF0aC5jZWlsKHRoaXMuY2FudmFzLndpZHRoL2MpLGY9TWF0aC5jZWlsKHRoaXMuY2FudmFzLmhlaWdodC9jKTt0aGlzLm1hdHJpeD1uZXcgQ29sbGlzaW9uTWF0cml4KGUsZixjKX1lbHNlIHRoaXMub3B0aW9ucy5lbmFibGVDb2xsaXNpb25zPSExfWZvcih2YXIgZD0wO2Q8YS5sZW5ndGg7ZCsrKWFbZF1bM118fChhW2RdWzNdPS0xKTt2YXIgZz0wO3RoaXMuYWRkRHJvcENhbGxiYWNrPWZ1bmN0aW9uKCl7dmFyIGM9KG5ldyBEYXRlKS5nZXRUaW1lKCk7aWYoIShiPmMtZykpe2c9Yzt2YXIgZD10aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7ZC5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2FudmFzLmhlaWdodCksZC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kLDAsMCx0aGlzLmNhbnZhcy53aWR0aCx0aGlzLmNhbnZhcy5oZWlnaHQpO2Zvcih2YXIgZSxmPTA7ZjxhLmxlbmd0aDtmKyspaWYoYVtmXVsyXT4xfHwtMT09PWFbZl1bM10pe2lmKDAhPT1hW2ZdWzNdKXthW2ZdWzNdLS07Zm9yKHZhciBoPTA7aDxhW2ZdWzJdOysraCl0aGlzLnB1dERyb3AobmV3IERyb3AodGhpcyxNYXRoLnJhbmRvbSgpKnRoaXMuY2FudmFzLndpZHRoLE1hdGgucmFuZG9tKCkqdGhpcy5jYW52YXMuaGVpZ2h0LGFbZl1bMF0sYVtmXVsxXSkpfX1lbHNlIGlmKE1hdGgucmFuZG9tKCk8YVtmXVsyXSl7ZT1hW2ZdO2JyZWFrfWUmJnRoaXMucHV0RHJvcChuZXcgRHJvcCh0aGlzLE1hdGgucmFuZG9tKCkqdGhpcy5jYW52YXMud2lkdGgsTWF0aC5yYW5kb20oKSp0aGlzLmNhbnZhcy5oZWlnaHQsZVswXSxlWzFdKSksZC5zYXZlKCksZC5nbG9iYWxBbHBoYT10aGlzLm9wdGlvbnMub3BhY2l0eSxkLmRyYXdJbWFnZSh0aGlzLmdsYXNzLDAsMCx0aGlzLmNhbnZhcy53aWR0aCx0aGlzLmNhbnZhcy5oZWlnaHQpLGQucmVzdG9yZSgpfX0uYmluZCh0aGlzKX0sUmFpbnlEYXkucHJvdG90eXBlLnB1dERyb3A9ZnVuY3Rpb24oYSl7YS5kcmF3KCksdGhpcy5ncmF2aXR5JiZhLnI+dGhpcy5vcHRpb25zLmdyYXZpdHlUaHJlc2hvbGQmJih0aGlzLm9wdGlvbnMuZW5hYmxlQ29sbGlzaW9ucyYmdGhpcy5tYXRyaXgudXBkYXRlKGEpLHRoaXMuZHJvcHMucHVzaChhKSl9LFJhaW55RGF5LnByb3RvdHlwZS5jbGVhckRyb3A9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLmNsZWFyKGIpO2lmKGMpe3ZhciBkPXRoaXMuZHJvcHMuaW5kZXhPZihhKTtkPj0wJiZ0aGlzLmRyb3BzLnNwbGljZShkLDEpfXJldHVybiBjfSxEcm9wLnByb3RvdHlwZS5kcmF3PWZ1bmN0aW9uKCl7dGhpcy5jb250ZXh0LnNhdmUoKSx0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7dmFyIGE9dGhpcy5yO2lmKHRoaXMucj0uOTUqdGhpcy5yLHRoaXMucjwzKXRoaXMuY29udGV4dC5hcmModGhpcy54LHRoaXMueSx0aGlzLnIsMCwyKk1hdGguUEksITApLHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtlbHNlIGlmKHRoaXMuY29sbGlkaW5nfHx0aGlzLnlzcGVlZD4yKXtpZih0aGlzLmNvbGxpZGluZyl7dmFyIGI9dGhpcy5jb2xsaWRpbmc7dGhpcy5yPTEuMDAxKih0aGlzLnI+Yi5yP3RoaXMucjpiLnIpLHRoaXMueCs9Yi54LXRoaXMueCx0aGlzLmNvbGxpZGluZz1udWxsfXZhciBjPTErLjEqdGhpcy55c3BlZWQ7dGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLngtdGhpcy5yL2MsdGhpcy55KSx0aGlzLmNvbnRleHQuYmV6aWVyQ3VydmVUbyh0aGlzLngtdGhpcy5yLHRoaXMueS0yKnRoaXMucix0aGlzLngrdGhpcy5yLHRoaXMueS0yKnRoaXMucix0aGlzLngrdGhpcy5yL2MsdGhpcy55KSx0aGlzLmNvbnRleHQuYmV6aWVyQ3VydmVUbyh0aGlzLngrdGhpcy5yLHRoaXMueStjKnRoaXMucix0aGlzLngtdGhpcy5yLHRoaXMueStjKnRoaXMucix0aGlzLngtdGhpcy5yL2MsdGhpcy55KX1lbHNlIHRoaXMuY29udGV4dC5hcmModGhpcy54LHRoaXMueSwuOSp0aGlzLnIsMCwyKk1hdGguUEksITApLHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTt0aGlzLmNvbnRleHQuY2xpcCgpLHRoaXMucj1hLHRoaXMucmFpbnlkYXkucmVmbGVjdGlvbiYmdGhpcy5yYWlueWRheS5yZWZsZWN0aW9uKHRoaXMpLHRoaXMuY29udGV4dC5yZXN0b3JlKCl9LERyb3AucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueC10aGlzLnItMSx0aGlzLnktdGhpcy5yLTIsMip0aGlzLnIrMiwyKnRoaXMucisyKSxhPyh0aGlzLnRlcm1pbmF0ZT0hMCwhMCk6dGhpcy55LXRoaXMucj50aGlzLnJhaW55ZGF5LmNhbnZhcy5oZWlnaHR8fHRoaXMueC10aGlzLnI+dGhpcy5yYWlueWRheS5jYW52YXMud2lkdGh8fHRoaXMueCt0aGlzLnI8MD8hMDohMX0sRHJvcC5wcm90b3R5cGUuYW5pbWF0ZT1mdW5jdGlvbigpe2lmKHRoaXMudGVybWluYXRlKXJldHVybiExO3ZhciBhPXRoaXMucmFpbnlkYXkuZ3Jhdml0eSh0aGlzKTtpZighYSYmdGhpcy5yYWlueWRheS50cmFpbCYmdGhpcy5yYWlueWRheS50cmFpbCh0aGlzKSx0aGlzLnJhaW55ZGF5Lm9wdGlvbnMuZW5hYmxlQ29sbGlzaW9ucyl7dmFyIGI9dGhpcy5yYWlueWRheS5tYXRyaXgudXBkYXRlKHRoaXMsYSk7YiYmdGhpcy5yYWlueWRheS5jb2xsaXNpb24odGhpcyxiKX1yZXR1cm4hYXx8dGhpcy50ZXJtaW5hdGV9LFJhaW55RGF5LnByb3RvdHlwZS5UUkFJTF9OT05FPWZ1bmN0aW9uKCl7fSxSYWlueURheS5wcm90b3R5cGUuVFJBSUxfRFJPUFM9ZnVuY3Rpb24oYSl7KCFhLnRyYWlsWXx8YS55LWEudHJhaWxZPj0xMDAqTWF0aC5yYW5kb20oKSphLnIpJiYoYS50cmFpbFk9YS55LHRoaXMucHV0RHJvcChuZXcgRHJvcCh0aGlzLGEueCsoMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucmFuZG9tKCksYS55LWEuci01LE1hdGguY2VpbChhLnIvNSksMCkpKX0sUmFpbnlEYXkucHJvdG90eXBlLlRSQUlMX1NNVURHRT1mdW5jdGlvbihhKXt2YXIgYj1hLnktYS5yLTMsYz1hLngtYS5yLzIrMipNYXRoLnJhbmRvbSgpOzA+Ynx8MD5jfHx0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuY2xlYXJiYWNrZ3JvdW5kLGMsYixhLnIsMixjLGIsYS5yLDIpfSxSYWlueURheS5wcm90b3R5cGUuR1JBVklUWV9OT05FPWZ1bmN0aW9uKCl7cmV0dXJuITB9LFJhaW55RGF5LnByb3RvdHlwZS5HUkFWSVRZX0xJTkVBUj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jbGVhckRyb3AoYSk/ITA6KGEueXNwZWVkPyhhLnlzcGVlZCs9dGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1kqTWF0aC5mbG9vcihhLnIpLGEueHNwZWVkKz10aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWCpNYXRoLmZsb29yKGEucikpOihhLnlzcGVlZD10aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWSxhLnhzcGVlZD10aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWCksYS55Kz1hLnlzcGVlZCxhLmRyYXcoKSwhMSl9LFJhaW55RGF5LnByb3RvdHlwZS5HUkFWSVRZX05PTl9MSU5FQVI9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2xlYXJEcm9wKGEpPyEwOihhLmNvbGxpZGVkPyhhLmNvbGxpZGVkPSExLGEuc2VlZD1NYXRoLmZsb29yKGEucipNYXRoLnJhbmRvbSgpKnRoaXMub3B0aW9ucy5mcHMpLGEuc2tpcHBpbmc9ITEsYS5zbG93aW5nPSExKTooIWEuc2VlZHx8YS5zZWVkPDApJiYoYS5zZWVkPU1hdGguZmxvb3IoYS5yKk1hdGgucmFuZG9tKCkqdGhpcy5vcHRpb25zLmZwcyksYS5za2lwcGluZz1hLnNraXBwaW5nPT09ITE/ITA6ITEsYS5zbG93aW5nPSEwKSxhLnNlZWQtLSxhLnlzcGVlZD9hLnNsb3dpbmc/KGEueXNwZWVkLz0xLjEsYS54c3BlZWQvPTEuMSxhLnlzcGVlZDx0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWSYmKGEuc2xvd2luZz0hMSkpOmEuc2tpcHBpbmc/KGEueXNwZWVkPXRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9ZLGEueHNwZWVkPXRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9YKTooYS55c3BlZWQrPTEqdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1kqTWF0aC5mbG9vcihhLnIpLGEueHNwZWVkKz0xKnRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9YKk1hdGguZmxvb3IoYS5yKSk6KGEueXNwZWVkPXRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9ZLGEueHNwZWVkPXRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9YKSwwIT09dGhpcy5vcHRpb25zLmdyYXZpdHlBbmdsZVZhcmlhbmNlJiYoYS54c3BlZWQrPSgyKk1hdGgucmFuZG9tKCktMSkqYS55c3BlZWQqdGhpcy5vcHRpb25zLmdyYXZpdHlBbmdsZVZhcmlhbmNlKSxhLnkrPWEueXNwZWVkLGEueCs9YS54c3BlZWQsYS5kcmF3KCksITEpfSxSYWlueURheS5wcm90b3R5cGUucG9zaXRpdmVNaW49ZnVuY3Rpb24oYSxiKXt2YXIgYz0wO3JldHVybiBjPWI+YT8wPj1hP2I6YTowPj1iP2E6YiwwPj1jPzE6Y30sUmFpbnlEYXkucHJvdG90eXBlLlJFRkxFQ1RJT05fTk9ORT1mdW5jdGlvbigpe3RoaXMuY29udGV4dC5maWxsU3R5bGU9dGhpcy5vcHRpb25zLmZpbGxTdHlsZSx0aGlzLmNvbnRleHQuZmlsbCgpfSxSYWlueURheS5wcm90b3R5cGUuUkVGTEVDVElPTl9NSU5JQVRVUkU9ZnVuY3Rpb24oYSl7dmFyIGI9TWF0aC5tYXgoKGEueC10aGlzLm9wdGlvbnMucmVmbGVjdGlvbkRyb3BNYXBwaW5nV2lkdGgpL3RoaXMub3B0aW9ucy5yZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yLDApLGM9TWF0aC5tYXgoKGEueS10aGlzLm9wdGlvbnMucmVmbGVjdGlvbkRyb3BNYXBwaW5nSGVpZ2h0KS90aGlzLm9wdGlvbnMucmVmbGVjdGlvblNjYWxlZG93bkZhY3RvciwwKSxkPXRoaXMucG9zaXRpdmVNaW4oMip0aGlzLm9wdGlvbnMucmVmbGVjdGlvbkRyb3BNYXBwaW5nV2lkdGgvdGhpcy5vcHRpb25zLnJlZmxlY3Rpb25TY2FsZWRvd25GYWN0b3IsdGhpcy5yZWZsZWN0ZWQud2lkdGgtYiksZT10aGlzLnBvc2l0aXZlTWluKDIqdGhpcy5vcHRpb25zLnJlZmxlY3Rpb25Ecm9wTWFwcGluZ0hlaWdodC90aGlzLm9wdGlvbnMucmVmbGVjdGlvblNjYWxlZG93bkZhY3Rvcix0aGlzLnJlZmxlY3RlZC5oZWlnaHQtYyksZj1NYXRoLm1heChhLngtMS4xKmEuciwwKSxnPU1hdGgubWF4KGEueS0xLjEqYS5yLDApO3RoaXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5yZWZsZWN0ZWQsYixjLGQsZSxmLGcsMiphLnIsMiphLnIpfSxSYWlueURheS5wcm90b3R5cGUuQ09MTElTSU9OX1NJTVBMRT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYyxkPWI7bnVsbCE9ZDspe3ZhciBlPWQuZHJvcDtpZihNYXRoLnNxcnQoTWF0aC5wb3coYS54LWUueCwyKStNYXRoLnBvdyhhLnktZS55LDIpKTxhLnIrZS5yKXtjPWU7YnJlYWt9ZD1kLm5leHR9aWYoYyl7dmFyIGYsZzthLnk+Yy55PyhmPWEsZz1jKTooZj1jLGc9YSksdGhpcy5jbGVhckRyb3AoZyksdGhpcy5jbGVhckRyb3AoZiwhMCksdGhpcy5tYXRyaXgucmVtb3ZlKGYpLGcuZHJhdygpLGcuY29sbGlkaW5nPWYsZy5jb2xsaWRlZD0hMH19LFJhaW55RGF5LnByb3RvdHlwZS5wcmVwYXJlQmFja2dyb3VuZD1mdW5jdGlvbigpe3RoaXMuYmFja2dyb3VuZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuYmFja2dyb3VuZC53aWR0aD10aGlzLmNhbnZhcy53aWR0aCx0aGlzLmJhY2tncm91bmQuaGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodCx0aGlzLmNsZWFyYmFja2dyb3VuZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuY2xlYXJiYWNrZ3JvdW5kLndpZHRoPXRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2xlYXJiYWNrZ3JvdW5kLmhlaWdodD10aGlzLmNhbnZhcy5oZWlnaHQ7dmFyIGE9dGhpcy5iYWNrZ3JvdW5kLmdldENvbnRleHQoXCIyZFwiKTthLmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KSxhLmRyYXdJbWFnZSh0aGlzLmltZyx0aGlzLm9wdGlvbnMuY3JvcFswXSx0aGlzLm9wdGlvbnMuY3JvcFsxXSx0aGlzLm9wdGlvbnMuY3JvcFsyXSx0aGlzLm9wdGlvbnMuY3JvcFszXSwwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KSxhPXRoaXMuY2xlYXJiYWNrZ3JvdW5kLmdldENvbnRleHQoXCIyZFwiKSxhLmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KSxhLmRyYXdJbWFnZSh0aGlzLmltZyx0aGlzLm9wdGlvbnMuY3JvcFswXSx0aGlzLm9wdGlvbnMuY3JvcFsxXSx0aGlzLm9wdGlvbnMuY3JvcFsyXSx0aGlzLm9wdGlvbnMuY3JvcFszXSwwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KSwhaXNOYU4odGhpcy5vcHRpb25zLmJsdXIpJiZ0aGlzLm9wdGlvbnMuYmx1cj49MSYmdGhpcy5zdGFja0JsdXJDYW52YXNSR0IodGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0LHRoaXMub3B0aW9ucy5ibHVyKX0sUmFpbnlEYXkucHJvdG90eXBlLnN0YWNrQmx1ckNhbnZhc1JHQj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9W1swLDldLFsxLDExXSxbMiwxMl0sWzMsMTNdLFs1LDE0XSxbNywxNV0sWzExLDE2XSxbMTUsMTddLFsyMiwxOF0sWzMxLDE5XSxbNDUsMjBdLFs2MywyMV0sWzkwLDIyXSxbMTI3LDIzXSxbMTgxLDI0XV0sZT1bNTEyLDUxMiw0NTYsNTEyLDMyOCw0NTYsMzM1LDUxMiw0MDUsMzI4LDI3MSw0NTYsMzg4LDMzNSwyOTIsNTEyLDQ1NCw0MDUsMzY0LDMyOCwyOTgsMjcxLDQ5Niw0NTYsNDIwLDM4OCwzNjAsMzM1LDMxMiwyOTIsMjczLDUxMiw0ODIsNDU0LDQyOCw0MDUsMzgzLDM2NCwzNDUsMzI4LDMxMiwyOTgsMjg0LDI3MSwyNTksNDk2LDQ3NSw0NTYsNDM3LDQyMCw0MDQsMzg4LDM3NCwzNjAsMzQ3LDMzNSwzMjMsMzEyLDMwMiwyOTIsMjgyLDI3MywyNjUsNTEyLDQ5Nyw0ODIsNDY4LDQ1NCw0NDEsNDI4LDQxNyw0MDUsMzk0LDM4MywzNzMsMzY0LDM1NCwzNDUsMzM3LDMyOCwzMjAsMzEyLDMwNSwyOTgsMjkxLDI4NCwyNzgsMjcxLDI2NSwyNTksNTA3LDQ5Niw0ODUsNDc1LDQ2NSw0NTYsNDQ2LDQzNyw0MjgsNDIwLDQxMiw0MDQsMzk2LDM4OCwzODEsMzc0LDM2NywzNjAsMzU0LDM0NywzNDEsMzM1LDMyOSwzMjMsMzE4LDMxMiwzMDcsMzAyLDI5NywyOTIsMjg3LDI4MiwyNzgsMjczLDI2OSwyNjUsMjYxLDUxMiw1MDUsNDk3LDQ4OSw0ODIsNDc1LDQ2OCw0NjEsNDU0LDQ0Nyw0NDEsNDM1LDQyOCw0MjIsNDE3LDQxMSw0MDUsMzk5LDM5NCwzODksMzgzLDM3OCwzNzMsMzY4LDM2NCwzNTksMzU0LDM1MCwzNDUsMzQxLDMzNywzMzIsMzI4LDMyNCwzMjAsMzE2LDMxMiwzMDksMzA1LDMwMSwyOTgsMjk0LDI5MSwyODcsMjg0LDI4MSwyNzgsMjc0LDI3MSwyNjgsMjY1LDI2MiwyNTksMjU3LDUwNyw1MDEsNDk2LDQ5MSw0ODUsNDgwLDQ3NSw0NzAsNDY1LDQ2MCw0NTYsNDUxLDQ0Niw0NDIsNDM3LDQzMyw0MjgsNDI0LDQyMCw0MTYsNDEyLDQwOCw0MDQsNDAwLDM5NiwzOTIsMzg4LDM4NSwzODEsMzc3LDM3NCwzNzAsMzY3LDM2MywzNjAsMzU3LDM1NCwzNTAsMzQ3LDM0NCwzNDEsMzM4LDMzNSwzMzIsMzI5LDMyNiwzMjMsMzIwLDMxOCwzMTUsMzEyLDMxMCwzMDcsMzA0LDMwMiwyOTksMjk3LDI5NCwyOTIsMjg5LDI4NywyODUsMjgyLDI4MCwyNzgsMjc1LDI3MywyNzEsMjY5LDI2NywyNjUsMjYzLDI2MSwyNTldO2N8PTA7dmFyIGYsZyxoLGksaixrLGwsbSxuLG8scCxxLHIscyx0LHUsdix3LHgseSx6PXRoaXMuYmFja2dyb3VuZC5nZXRDb250ZXh0KFwiMmRcIiksQT16LmdldEltYWdlRGF0YSgwLDAsYSxiKSxCPUEuZGF0YSxDPWMrMSxEPUMqKEMrMSkvMixFPW5ldyBCbHVyU3RhY2ssRj1uZXcgQmx1clN0YWNrLEc9RTtmb3IoaD0xOzIqYysxPmg7aCsrKUc9Ry5uZXh0PW5ldyBCbHVyU3RhY2ssaD09PUMmJihGPUcpO0cubmV4dD1FO3ZhciBIPW51bGwsST1udWxsO2w9az0wO2Zvcih2YXIgSixLPWVbY10sTD0wO0w8ZC5sZW5ndGg7KytMKWlmKGM8PWRbTF1bMF0pe0o9ZFtMLTFdWzFdO2JyZWFrfWZvcihnPTA7Yj5nO2crKyl7Zm9yKHM9dD11PW09bj1vPTAscD1DKih2PUJba10pLHE9Qyoodz1CW2srMV0pLHI9QyooeD1CW2srMl0pLG0rPUQqdixuKz1EKncsbys9RCp4LEc9RSxoPTA7Qz5oO2grKylHLnI9dixHLmc9dyxHLmI9eCxHPUcubmV4dDtmb3IoaD0xO0M+aDtoKyspaT1rKygoaD5hLTE/YS0xOmgpPDwyKSxtKz0oRy5yPXY9QltpXSkqKHk9Qy1oKSxuKz0oRy5nPXc9QltpKzFdKSp5LG8rPShHLmI9eD1CW2krMl0pKnkscys9dix0Kz13LHUrPXgsRz1HLm5leHQ7Zm9yKEg9RSxJPUYsZj0wO2E+ZjtmKyspQltrXT1tKks+PkosQltrKzFdPW4qSz4+SixCW2srMl09bypLPj5KLG0tPXAsbi09cSxvLT1yLHAtPUgucixxLT1ILmcsci09SC5iLGk9bCsoKGk9ZitjKzEpPGEtMT9pOmEtMSk8PDIscys9SC5yPUJbaV0sdCs9SC5nPUJbaSsxXSx1Kz1ILmI9QltpKzJdLG0rPXMsbis9dCxvKz11LEg9SC5uZXh0LHArPXY9SS5yLHErPXc9SS5nLHIrPXg9SS5iLHMtPXYsdC09dyx1LT14LEk9SS5uZXh0LGsrPTQ7bCs9YX1mb3IoZj0wO2E+ZjtmKyspe2Zvcih0PXU9cz1uPW89bT0wLGs9Zjw8MixwPUMqKHY9QltrXSkscT1DKih3PUJbaysxXSkscj1DKih4PUJbaysyXSksbSs9RCp2LG4rPUQqdyxvKz1EKngsRz1FLGg9MDtDPmg7aCsrKUcucj12LEcuZz13LEcuYj14LEc9Ry5uZXh0O2ZvcihqPWEsaD0xO0M+aDtoKyspaz1qK2Y8PDIsbSs9KEcucj12PUJba10pKih5PUMtaCksbis9KEcuZz13PUJbaysxXSkqeSxvKz0oRy5iPXg9QltrKzJdKSp5LHMrPXYsdCs9dyx1Kz14LEc9Ry5uZXh0LGItMT5oJiYoais9YSk7Zm9yKGs9ZixIPUUsST1GLGc9MDtiPmc7ZysrKWk9azw8MixCW2ldPW0qSz4+SixCW2krMV09bipLPj5KLEJbaSsyXT1vKks+PkosbS09cCxuLT1xLG8tPXIscC09SC5yLHEtPUguZyxyLT1ILmIsaT1mKygoaT1nK0MpPGItMT9pOmItMSkqYTw8MixtKz1zKz1ILnI9QltpXSxuKz10Kz1ILmc9QltpKzFdLG8rPXUrPUguYj1CW2krMl0sSD1ILm5leHQscCs9dj1JLnIscSs9dz1JLmcscis9eD1JLmIscy09dix0LT13LHUtPXgsST1JLm5leHQsays9YX16LnB1dEltYWdlRGF0YShBLDAsMCl9LENvbGxpc2lvbk1hdHJpeC5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7aWYoYS5naWQpe2lmKCF0aGlzLm1hdHJpeFthLmdteF18fCF0aGlzLm1hdHJpeFthLmdteF1bYS5nbXldKXJldHVybiBudWxsO2lmKHRoaXMubWF0cml4W2EuZ214XVthLmdteV0ucmVtb3ZlKGEpLGIpcmV0dXJuIG51bGw7aWYoYS5nbXg9TWF0aC5mbG9vcihhLngvdGhpcy5yZXNvbHV0aW9uKSxhLmdteT1NYXRoLmZsb29yKGEueS90aGlzLnJlc29sdXRpb24pLCF0aGlzLm1hdHJpeFthLmdteF18fCF0aGlzLm1hdHJpeFthLmdteF1bYS5nbXldKXJldHVybiBudWxsO3RoaXMubWF0cml4W2EuZ214XVthLmdteV0uYWRkKGEpO3ZhciBjPXRoaXMuY29sbGlzaW9ucyhhKTtpZihjJiZudWxsIT1jLm5leHQpcmV0dXJuIGMubmV4dH1lbHNle2lmKGEuZ2lkPU1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLDkpLGEuZ214PU1hdGguZmxvb3IoYS54L3RoaXMucmVzb2x1dGlvbiksYS5nbXk9TWF0aC5mbG9vcihhLnkvdGhpcy5yZXNvbHV0aW9uKSwhdGhpcy5tYXRyaXhbYS5nbXhdfHwhdGhpcy5tYXRyaXhbYS5nbXhdW2EuZ215XSlyZXR1cm4gbnVsbDt0aGlzLm1hdHJpeFthLmdteF1bYS5nbXldLmFkZChhKX1yZXR1cm4gbnVsbH0sQ29sbGlzaW9uTWF0cml4LnByb3RvdHlwZS5jb2xsaXNpb25zPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBEcm9wSXRlbShudWxsKSxjPWI7cmV0dXJuIGI9dGhpcy5hZGRBbGwoYixhLmdteC0xLGEuZ215KzEpLGI9dGhpcy5hZGRBbGwoYixhLmdteCxhLmdteSsxKSxiPXRoaXMuYWRkQWxsKGIsYS5nbXgrMSxhLmdteSsxKSxjfSxDb2xsaXNpb25NYXRyaXgucHJvdG90eXBlLmFkZEFsbD1mdW5jdGlvbihhLGIsYyl7aWYoYj4wJiZjPjAmJmI8dGhpcy54YyYmYzx0aGlzLnljKWZvcih2YXIgZD10aGlzLm1hdHJpeFtiXVtjXTtudWxsIT1kLm5leHQ7KWQ9ZC5uZXh0LGEubmV4dD1uZXcgRHJvcEl0ZW0oZC5kcm9wKSxhPWEubmV4dDtyZXR1cm4gYX0sQ29sbGlzaW9uTWF0cml4LnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5tYXRyaXhbYS5nbXhdW2EuZ215XS5yZW1vdmUoYSl9LERyb3BJdGVtLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXM7bnVsbCE9Yi5uZXh0OyliPWIubmV4dDtiLm5leHQ9bmV3IERyb3BJdGVtKGEpfSxEcm9wSXRlbS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLGM9bnVsbDtudWxsIT1iLm5leHQ7KWM9YixiPWIubmV4dCxiLmRyb3AuZ2lkPT09YS5naWQmJihjLm5leHQ9Yi5uZXh0KX07Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
