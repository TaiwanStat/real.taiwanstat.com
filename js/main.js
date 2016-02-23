(function(window, document, $) {

  var discussion;
  var embed;
  var window_width = $(window).width();
  var hostname = window.location.hostname;
  var path = window.location.pathname;

  if (path != '/' && path != '/r/' && path != '/l/' || 
      hostname == 'water.taiwanstat.com') {

    discussion = 
      '<discussion>' + 
      '<h3 id="discussion_title" style="margin-left: 20px;">數據討論區</h3>' + 
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

  }

  $('#layout-header').scroll(function() {
    $('footer').hide();
  });

  window.sendEmail = function() {
    var mail = 'mailto:contact@taiwanstat.com';
    var a = document.createElement('a');
    a.href = mail;
    a.click();

  };
  var scrollup = $('.footer-mobile');

  scrollup.click(function () {
      $("main").animate({
          scrollTop: 0
      }, 600);

      $("#layout-header").animate({
          scrollTop: 0
      }, 600);
      return false;
  });
  $('#layout-header').scroll(function() {
    var scroll = $(this).scrollTop();
    if (scroll > 200) {
      scrollup.fadeIn(500);
    } else {
      scrollup.fadeOut(500);
    }
   }); 

   var rootPath = window.location.pathname.split('/')[1];
   if (hostname == 'real.taiwanstat.com' || hostname == 'water.taiwanstat.com' || hostname == "localhost") {
     $('.mdl-layout--large-screen-only a:nth-child(1)').addClass('active');   
   }
   else if (hostname == 'long.taiwanstat.com') {
     $('.mdl-layout--large-screen-only a:nth-child(2)').addClass('active');   
   }
   else if (hostname == 'global.taiwanstat.com') {
     if (rootPath == 'r') {
       $('.mdl-layout--large-screen-only a:nth-child(3)').addClass('active');
     }
     else if (rootPath == 'l') {
       $('.mdl-layout--large-screen-only a:nth-child(4)').addClass('active');
     }
   }

   var url = 'https://chrome.google.com/webstore/detail/instants/fghfkeajhcmoohfcfmdkajambdcanmob';

  $('body').append('<a class="ui button blue banner" href="' + url + '">Instants Chrome 擴充功能發布！提供您即時的生活品質資訊。</a>');


})(window, document, jQuery);
