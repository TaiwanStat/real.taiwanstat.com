(function() {

    var myFirebaseRef = new Firebase("https://realtaiwanstat2.firebaseio.com");
    myFirebaseRef.child("air").limitToLast(1).on("child_added", function(snapshot) {
      var raw = snapshot.val();  // Alerts "San Francisco"
      var data = JSON.parse(raw);
   
        $('.data-update-time').text('更新時間（每小時更新）：' + data[0]['PublishTime']);
        for (site_index in data) {
            if (parseInt(data[site_index]['PM2.5']) <= 11) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui green tag label status').text('低');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-1.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 23) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui green tag label status').text('低');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-2.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 35) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui green tag label status').text('低');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-3.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 41) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui yellow tag label status').text('中');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-4.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 47) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui orange tag label status').text('中');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-5.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 53) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui orange tag label status').text('中');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-6.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 58) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui red tag label status').text('高');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-7.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 64) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui red tag label status').text('高');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-8.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) <= 70) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui black tag label status').text('高');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-9.png');
            }
            else if (parseInt(data[site_index]['PM2.5']) >= 71) {
                $('#' + data[site_index]['site_id'] + ' .status').attr('class', 'ui purple tag label status').text('非常高');
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-10.png');
            }
            else if (isNaN(parseInt(data[site_index]['PM2.5']))) {
                $('#' + data[site_index]['site_id'] + ' .status_img').attr('src', 'img/PM2.5-wait.png');
            }

            if (isNaN(parseInt(data[site_index]['PM2.5']))) {
                $('#' + data[site_index]['site_id'] + ' .pm25').children('h5')
                                .text("PM2.5: 待更新");
            }
            else {
                $('#' + data[site_index]['site_id'] + ' .pm25').children('h5')
                                .text("PM2.5: " + data[site_index]['PM2.5'] + " μg/m").append('<sup>3</sup>');
            }

            $('#' + data[site_index]['site_id'] + ' .psi').children('h5')
                            .text("PSI: " + data[site_index]['PSI']);

            $('#' + data[site_index]['site_id'] + ' .pm10').children('h5')
                            .text("PM10: " + data[site_index]['PM10'] + " μg/m").append('<sup>3</sup>');
        }
    });

    $("#country-selection").change(function() {
        window.location.href= "#" + $(this).val();
    })
})()
