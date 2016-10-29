var path = require('path');
var url = require('url');

var lists = require('./lists.json');
var post_arr = [];

post_arr.push(lists);

lists.data.page.forEach(function(p) {
  if(!url.parse(p.url).protocol) {
  	var domain = 'http://real.taiwanstat.com/';
  	if (p.title == '台南登革熱及快篩診所地圖') {
			domain = 'https://www.taiwanstat.com/realtime/';
  	}
    post_arr.push({
      "data": {
      //  "domain": "https://www.taiwanstat.com/realtime/",
				domain: domain,
        "chart_description": p
      },
      "partials": './include/partials.js',
      "layout": path.join(p.url, "index.hbs"),
      "filename": path.join(p.url, "index.html")
    });
  }
});

module.exports = post_arr;
