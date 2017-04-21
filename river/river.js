const request = require('request');
const async = require('async');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');


const dataSheet = 'id,city,basin,riverName,siteName,date,RPI,WT,PH,EC,NH3N,Ch,Temperature,SS,DO,COD,DOS,BOD,CG';


const _URL = 'http://erdb.epa.gov.tw/DataRepository/EnvMonitor/RiverWaterQualityMonitoringData.aspx';


getRiverData();

function getRiverData() {
    async.waterfall([
        function(callback) {
            request.get(_URL, function(error, response, body) {
                if (error) {
                    console.error('Request error.');
                }
                const $ = cheerio.load(body);
                var tmp = $('#__VIEWSTATE').val();
                var tmp2 = $('#__EVENTVALIDATION').val()
                callback(null,tmp,tmp2);
            });
        },
        function(tmp,tmp2, callback) {
            var params = {
                '__EVENTTARGET':'',
                '__EVENTARGUMENT':'',
                '__LASTFOCUS':'',
                '__VIEWSTATE':tmp,
                '__VIEWSTATEGENERATOR':'660F8311',
                '__EVENTVALIDATION':tmp2,
                'ctl00$ContentPlaceHolder1$hiddenTopic1':'水',
                'ctl00$ContentPlaceHolder1$hiddenTopic2':'環境及生態監測',
                'ctl00$ContentPlaceHolder1$hiddenSubject':'河川',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$rbList':'0',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlCounty':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlBasin':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlRiver':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlYearS':'2017',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlMonthS':'02',
                'ctl00$ContentPlaceHolder1$imgSearch.x':'44',
                'ctl00$ContentPlaceHolder1$imgSearch.y':'25',
                'ctl00$hfUserLogin': '',

            };
            request.post({ url: _URL, form: params }, function(error, response, body) {
                if (error) {
                    console.error('Request error.');
                }
                const $ = cheerio.load(body);
                var tmp3 = $('#__VIEWSTATE').val();
                var tmp4 = $('#__EVENTVALIDATION').val()
                callback(null,tmp3,tmp4);
            });
        },
        function(tmp3,tmp4, callback) {
            var params = {
                '__EVENTTARGET':'',
                '__EVENTARGUMENT':'',
                '__LASTFOCUS':'',
                '__VIEWSTATE':tmp3,
                '__VIEWSTATEGENERATOR':'660F8311',
                '__EVENTVALIDATION':tmp4,
                'ctl00$ContentPlaceHolder1$hiddenTopic1':'水',
                'ctl00$ContentPlaceHolder1$hiddenTopic2':'環境及生態監測',
                'ctl00$ContentPlaceHolder1$hiddenSubject':'河川',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$rbList':'0',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlCounty':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlBasin':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlRiver':'全部',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlYearS':'2017',
                'ctl00$ContentPlaceHolder1$ucSearchCondition$ddlMonthS':'02',
                'ctl00$ContentPlaceHolder1$ShareAndExport$ibtnExcel.x':'26',
                'ctl00$ContentPlaceHolder1$ShareAndExport$ibtnExcel.y':'29',
                'ctl00$hfUserLogin': '',

            }
            request.post({ url: _URL, form: params }, function(error, response, body) {
                if (error) {
                    console.error('Request error.');
                }
                var csvStr = dataSheet + '\n' + body;
                fs.writeFile('river.csv', csvStr);
            });
        }
    ], function(err, outputData) {
        if (err) {
            console.error('Error.');
        }

        if (!outputData || outputData.length === 0) {
            console.log('GET NULL');
        }
    });
};

function parseData(html) {

    var outputData = {};
    var $ = cheerio.load(html);
    var attr = ['siteName', 'date', 'RPI', 'WT', 'PH', 'EC', 'Temperature',
        'SS', 'DO', 'BOD5', 'COD', 'NH3N', 'Cl', 'DOS', 'Coliform', 'Cd', 'Pb', 'Cu',
        'Zn', 'Cr', 'Mn', 'Ag', 'As', 'Se'
    ];

    $('#GroupingGridView1')
        .find('tr.DataTableRowStyle, tr.DataTableAlternatingRowStyle')
        .each(function(number, elem) {
            var tds = $(this).find('td');
            var tdBasic = tds.length - 27;
            var siteData = {};
            var siteName = $(this).find('td').eq(tdBasic)
                .text().trim().replace(/(\r\n|\n|\r|\s)/g, '');

            for (var i = tdBasic; i < (tdBasic + 15); ++i) {
                siteData[attr[i - tdBasic]] = $(this).find('td')
                    .eq(i)
                    .text()
                    .trim()
                    .replace(/(\r\n|\n|\r|\s)/g, '');
            }
            outputData[siteName] = siteData;
        });
    return outputData;
}