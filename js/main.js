(function(window, document, $) {

  var discussion;
  var embed;
  var window_width = $(window).width();

  discussion = 
    '<discussion style= "margin: 20px;>' + 
    '<h3 id="discussion_title">數據討論區</h3>' + 
    '<div id="fb-root"></div>' + 
    '<script>' + 
    '(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id))' + 
    'return;js = d.createElement(s); js.id = id;js.src = ' + 
    '"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.3&appId=1659889874241396";' + 
    'fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));' + 
    '</script>' + 
    '<div class="fb-comments" data-href="' + 
    document.location.href  + 
    '" data-width="100%" data-numposts="8"></div></discussion>';

  embed = 
    '<div id="embed" class="ui form" style="margin: 20px; width: 85%; float: left;">' +
    '<div class="field">' +
    '<label style="font-size: 20px; margin-bottom: 5px;">網頁嵌入碼</label>' +
    '<input type="text" style="font-size: 15px" value=\'' +
    '<iframe src="' + document.URL + '" width="800" height="600" frameborder="0"></iframe>\'>' +
    '</div></div>';

  $('#main-content').append(embed);
  $('#main-content').append(discussion);

  if(window.parent != window) {
    $("body").find(".fb-plugin").remove();
    $("body").find("discussion").remove();
    $("body").find("#embed").remove();
    $("body").find("header").remove();
    $("body").find("footer").remove();
    $("body").append("<div id='background'></div>");
  }

  if(window_width < 400) {
    $('.demo-card-wide').width((window_width -20) + 'px');
  }
})(window, document, jQuery);
