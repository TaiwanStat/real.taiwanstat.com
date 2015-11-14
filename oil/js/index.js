AmCharts.ready(function () {
  createStockChart();
});

var chartData1 = [];
var chartData2 = [];
var chartData3 = [];
var chartData4 = [];
var chartData5 = [];
var chartData6 = [];
var chartData7 = [];

var predict92 = 0.0;
var predict95 = 0.0;
var predict98 = 0.0;
var predictultra = 0.0;


var ref = new Firebase('https://oildata2.firebaseio.com/datas');

var count = 0;
var data = [];
var newPost ;
function compare(a,b) {
  if (a.date< b.date)
    return -1;
  if (a.date> b.date)
    return 1;
  return 0;
}


function createStockChart() {

  var chart = new AmCharts.AmStockChart();
  chart.categoryAxesSettings = {maxSeries:0};

  // DATASETS //////////////////////////////////////////
  // create data sets first
  var dataSet1 = new AmCharts.DataSet();
  dataSet1.title = "92無鉛汽油";
  dataSet1.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet1.dataProvider = chartData1;
  dataSet1.categoryField = "date";

  var dataSet2 = new AmCharts.DataSet();
  dataSet2.title = "95無鉛汽油";
  dataSet2.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet2.dataProvider = chartData2;
  dataSet2.categoryField = "date";

  var dataSet3 = new AmCharts.DataSet();
  dataSet3.title = "98無鉛汽油";
  dataSet3.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet3.dataProvider = chartData3;
  dataSet3.categoryField = "date";

  var dataSet4 = new AmCharts.DataSet();
  dataSet4.title = "高級柴油";
  dataSet4.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet4.dataProvider = chartData4;
  dataSet4.categoryField = "date";

  var dataSet5 = new AmCharts.DataSet();
  dataSet5.title = "西德州國際原油";
  dataSet5.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet5.dataProvider = chartData5;
  dataSet5.categoryField = "date";

  var dataSet6 = new AmCharts.DataSet();
  dataSet6.title = "北海布蘭特原油";
  dataSet6.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet6.dataProvider = chartData6;
  dataSet6.categoryField = "date";

  var dataSet7 = new AmCharts.DataSet();
  dataSet7.title = "杜拜原油";
  dataSet7.fieldMappings = [{
    fromField: "value",
    toField: "value"
  }, {
    fromField: "volume",
    toField: "volume"
  }];
  dataSet7.dataProvider = chartData7;
  dataSet7.categoryField = "date";


  // set data sets to the chart
  chart.dataSets = [dataSet1, dataSet2, dataSet3, dataSet4, dataSet5, dataSet6, dataSet7];

  // PANELS ///////////////////////////////////////////
  // first stock panel
  var stockPanel1 = new AmCharts.StockPanel();
  //stockPanel1.showCategoryAxis = false;
  stockPanel1.title = "Value";
  stockPanel1.percentHeight = 70;

  // graph of first stock panel
  var graph1 = new AmCharts.StockGraph();
  graph1.valueField = "value";
  graph1.comparable = true;
  graph1.compareField = "value";
  graph1.bullet = "round";
  graph1.bulletBorderColor = "#FFFFFF";
  graph1.bulletBorderAlpha = 1;
  graph1.balloonText = "[[title]]:<b>[[value]]</b>";
  graph1.compareGraphBalloonText = "[[title]]:<b>[[value]]</b>";
  graph1.compareGraphBullet = "round";
  graph1.compareGraphBulletBorderColor = "#FFFFFF";
  graph1.compareGraphBulletBorderAlpha = 1;
  stockPanel1.addStockGraph(graph1);

  // create stock legend
  var stockLegend1 = new AmCharts.StockLegend();
  stockLegend1.periodValueTextComparing = "[[percents.value.close]]%";
  stockLegend1.periodValueTextRegular = "[[value.close]]";
  stockPanel1.stockLegend = stockLegend1;




  // set panels to the chart
  chart.panels = [stockPanel1/*, stockPanel2*/];


  // OTHER SETTINGS ////////////////////////////////////
  var sbsettings = new AmCharts.ChartScrollbarSettings();
  sbsettings.graph = graph1;
  chart.chartScrollbarSettings = sbsettings;

  // CURSOR
  var cursorSettings = new AmCharts.ChartCursorSettings();
  cursorSettings.valueBalloonsEnabled = true;

  cursorSettings.fullWidth = true;
  cursorSettings.cursorAlpha = 0.1;
  cursorSettings.valueLineBalloonEnabled = true ;
  cursorSettings.valueLineEnabled = true ;
  cursorSettings.valueLineAlpha = 0.5 ;

  chart.chartCursorSettings = cursorSettings;


  // PERIOD SELECTOR ///////////////////////////////////
  var periodSelector = new AmCharts.PeriodSelector();
  periodSelector.position = "left";
  periodSelector.periods = [{
    period: "DD",
    count: 10,
    label: "10 天"
  }, {
    period: "MM",
    count: 1,
    label: "1 個月"
  }, {
    period: "YYYY",
    count: 1,
    label: "1 年"
  }, {
    period: "YTD",
    selected: true,
    label: "今年"
  }, {
    period: "MAX",
    label: "最大區間"
  }];
  chart.periodSelector = periodSelector;


  // DATA SET SELECTOR
  var dataSetSelector = new AmCharts.DataSetSelector();
  dataSetSelector.position = "left";
  chart.dataSetSelector = dataSetSelector;


  ref.once("value", function(snapshot) {  //get data from firebase and generate chartDatas
    newPost = snapshot.val();
    data = $.map(newPost, function(value, index) {
      return [value];
    });
    //data.sort(compare);

    // set stock events
    dataSet1.stockEvents = [] ;
    dataSet2.stockEvents = [] ;
    dataSet3.stockEvents = [] ;
    dataSet4.stockEvents = [] ;
    dataSet5.stockEvents = [] ;
    dataSet6.stockEvents = [] ;
    dataSet7.stockEvents = [] ;

    // generate chartDatas
    for(i = 0 ; i < data.length ; i++ ){
      if(data[i].type==1){
        chartData5.push({
          date: new Date(data[i].date),
          value: data[i].WTI,
          volume: data[i].WTI
        });
        chartData6.push({
          date: new Date(data[i].date),
          value: data[i].Brent,
          volume: data[i].Brent
        });
        chartData7.push({
          date: new Date(data[i].date),
          value: data[i].Dubai,
          volume: data[i].Dubai
        });
      }else if(data[i].type==0){
        chartData1.push({
          date: new Date(data[i].date),
          value: data[i].ninetwo,
          volume: data[i].ninetwo
        });
        chartData2.push({
          date: new Date(data[i].date),
          value: data[i].ninefive,
          volume: data[i].ninefive
        });
        chartData3.push({
          date: new Date(data[i].date),
          value: data[i].nineeight,
          volume: data[i].nineeight
        });
        chartData4.push({
          date: new Date(data[i].date),
          value: data[i].ultra,
          volume: data[i].ultra
        });
      }else if(data[i].type==2){//events
        if(data[i].domestic==1){//domestic
          dataSet1.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
          dataSet2.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
          dataSet3.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
          dataSet4.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
        }else {
          dataSet5.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
          dataSet6.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
          dataSet7.stockEvents.push({
            date: new Date(data[i].date),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "X",
            description: data[i].event,
            url: data[i].url,
            urlTarget: "_blank"
          });
        }
      }
    }
    chartData1.sort(compare);
    chartData2.sort(compare);
    chartData3.sort(compare);
    chartData4.sort(compare);
    chartData5.sort(compare);
    chartData6.sort(compare);
    chartData7.sort(compare);
    /*
       dataSet1.stockEvents.push({
date: new Date("2015-10-12"),
type: "sign",
backgroundColor: "#85CDE6",
graph: graph1,
text: "S",
description: "This is description of an event"
});
dataSet1.stockEvents.push({
date: new Date("2015-10-19"),
type: "sign",
backgroundColor: "#85CDE6",
graph: graph1,
text: "S",
description: "This is description of an event"
});
*/
    temp = $.map(data[data.length-1], function(value, index) {
        return [value];
        });

predict92 = temp[0].ninetwo;
predict95 = temp[0].ninefive;
predict98 = temp[0].nineeight;
predictultra = temp[0].ultra;

chart.write('chartdiv');
document.getElementById('pre92').innerHTML += predict92 + Rise_Fall(FloatSubtraction(predict92 , chartData1[chartData1.length-1].value));
document.getElementById('pre95').innerHTML += predict95 + Rise_Fall(FloatSubtraction(predict95 , chartData2[chartData2.length-1].value));
document.getElementById('pre98').innerHTML += predict98 + Rise_Fall(FloatSubtraction(predict98 , chartData3[chartData3.length-1].value));
document.getElementById('preultra').innerHTML += predictultra + Rise_Fall(FloatSubtraction(predictultra , chartData4[chartData4.length-1].value));



document.getElementById('now92').innerHTML += chartData1[chartData1.length-1].value ;
document.getElementById('now95').innerHTML += chartData2[chartData2.length-1].value ;
document.getElementById('now98').innerHTML += chartData3[chartData3.length-1].value ;
document.getElementById('nowultra').innerHTML += chartData4[chartData4.length-1].value ;
});
}

function FloatSubtraction(arg1, arg2)
{
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

function Rise_Fall(value)
{
  var ret = ""
    if(value > 0)
    {
      ret = '<b style="color : red;" > (+' + value + ')</b>';
    }
    else
    {
      ret = '<b style="color : green;" > (' + value + ')</b>';
    }
  return ret;
}

