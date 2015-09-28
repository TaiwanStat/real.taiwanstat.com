var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var moment = require('moment');
var fs = require('fs');

var _URL = 'http://edw.epa.gov.tw/reportInspectRiver.aspx';
var params = {
  county: '全國',
  river: '全國',
  area: '全國',
  drain: '全國',
  date: '201503'
};

getRiverData();

function getRiverData () {
  async.waterfall([
    function (){
      request.post({url: _URL, form: params}, function (error, response, body) {
        if(error){
          console.error('Request error.');
        }
        var outputData = parseData(body);
        fs.writeFile('river.json', JSON.stringify(outputData));
        console.log('output: river.json');
      }
      )}
    ], function (err, outputData) {
      if (err) {
        console.error('Error.');
      }

      if (!outputData || outputData.length === 0) {
        console.log('GET NULL');
      }
   });
};

function parseData (html){

  var outputData = {};
  var $ = cheerio.load(html);
  var attr = ['siteName', 'date', 'RPI', 'WT', 'PH', 'EC', 'Temperature', 
    'SS', 'DO', 'BOD5', 'COD', 'NH3N', 'Cl', 'DOS', 'Coliform', 'Cd', 'Pb', 'Cu',
    'Zn', 'Cr', 'Mn', 'Ag', 'As', 'Se'];

  $('#GroupingGridView1')
    .find('tr.DataTableRowStyle, tr.DataTableAlternatingRowStyle')
    .each(function (number, elem){
      var tds = $(this).find('td');
      var tdBasic = tds.length - 27;
      var siteData = {};
      var siteName =  $(this).find('td').eq(tdBasic)
                      .text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
      
      for (var i = tdBasic; i < (tdBasic+15); ++i) {
        siteData[attr[i-tdBasic]] = $(this).find('td')
                                   .eq(i)
                                   .text()
                                   .trim()
                                   .replace(/(\r\n|\n|\r|\s)/g,'');
      }
      outputData[siteName] = siteData;
  });
  return outputData;
}
