(function() {

  var api = "https://www.taiwanstat.com/airs/latest/";
  d3.json(api, function(data) { 
      $('.data-update-time').text('更新時間（每小時更新）：' + data[0]['PublishTime']);

      for (site_index in data) {

          if (parseInt(data[site_index]['PSI']) == 0) {
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', '../pm2.5/img/PM2.5-wait.png');
          }
          else if (parseInt(data[site_index]['PSI']) <= 50) {
              $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui green tag label status').text('良好');
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PSI-1.png');
          }
          else if (parseInt(data[site_index]['PSI']) <= 100) {
              $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui yellow tag label status').text('普通');
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PSI-2.png');
          }
          else if (parseInt(data[site_index]['PSI']) <= 199) {
              $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui red tag label status').text('不良');
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PSI-3.png');
          }
          else if (parseInt(data[site_index]['PSI']) <= 299) {
              $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui purple tag label status').text('非常不良');
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PSI-4.png');
          }
          else if (parseInt(data[site_index]['PSI']) >= 300) {
              $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui black tag label status').text('有害');
              $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PSI-5.png');
          }

          if (parseInt(data[site_index]['PSI']) == 0) {
              $('#' + data[site_index]['site_id'] + ' .psi').children('h5')
                              .text("PSI: 設備維護中");
          }
          else {
              $('#' + data[site_index]['site_id'] + ' .psi').children('h5')
                              .text("PSI: " + data[site_index]['PSI']);
          }

          $('#' + data[site_index]['site_id'] + ' .pm25').children('h5')
                          .text("PM2.5: " + data[site_index]['PM2_5'] + " μg/m").append('<sup>3</sup>');
          $('#' + data[site_index]['site_id'] + ' .pm10').children('h5')
                          .text("PM10: " + data[site_index]['PM10'] + ' μg/m').append('<sup>3</sup>');
          $('#' + data[site_index]['site_id'] + ' .update').children('h5')
                          .text("更新時間: " + data[site_index]['PublishTime']);
      }
  });

    $("#country-selection").change(function() {
        window.location.href= "#" + $(this).val();
    })
})()
