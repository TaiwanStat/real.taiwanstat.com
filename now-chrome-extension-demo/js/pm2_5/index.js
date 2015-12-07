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
