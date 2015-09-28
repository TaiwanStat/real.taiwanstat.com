# TaiwanStat realtime data

Please only use `gh-pages` for main html page

## Table of content

- [Develop](#develop)
  - [Prerequisite](#prerequisite)
  - [Twstat cli tool](#twstat-cli)
  - [Run canner -core](#run)
- [Guidelines](#guidelines)
  - [Open a new project](#open-a-new-project)
  - [Setup new project](#setup-new-project)

## Develop

Install `canner-core`

#### Prerequisite

- npm
- nodejs

#### Twstat-cli

A cli tool for taiwanstat.

[See details and docs](https://github.com/TaiwanStat/twstat-cli)

#### Run

Build the project once:

```
twstat chart_item.js
```

Keep watching the project rebuild when it modified:

```
twstat chart_item.js -w
```

## GuideLines

#### Open a new project

開始一個新專案第一步先創立一個新的 folder 看你這個圖表要叫做什麼，例如：cancer，就在 root folder 下面開一個新的資料夾。只要 root folder 下面沒有重複的專案，就代表你可以使用這個 name 喔 :)

然後到 `lists.json` 裡面找到 `data.page` 裡面是一個 array, 在 array 的第一個 **item 之前** create 你的 project object.

會像是：

```js
{
  // 專案的 title
  "title": "2007 ~ 2014 年台灣垃圾處理統計",
  // 專案的 url 一定要跟你 create folder 的 name 要一樣
  "url": "garbage",
  // 專案的圖片一律存在 images 這個 folder 的下面
  "img": "images/garbage.png",
  // 當你在 fb fans page po 的文複製到 description
  "description": "台灣每年產生 700 萬噸以上的垃圾(一天2萬噸)，這麼大量的垃圾如何處理是一個重要的課題。究竟衛生掩埋、焚化、資源回收，哪個才是台灣垃圾處理最大宗？而2002年環保暑發佈了《垃圾回收再利用法》是否改變了台灣垃圾處理的方式？"
}
```

#### Setup new project

要開始一個新專案首先要先創立一個新的 `index.hbs` 在你剛創立的那個 folder 下面，那個 `hbs`，裡面有很重要的五個區域 `{{>head}}, {{> header}}`, `{{> start}}`, `{{> end}}`, `{{> footer}}` 這五個區域分別會 include 一些 script。

下面是一個 example 的 `index.hbs` ，後面分別會講述各部分 include 什麼東西。

`index.hbs`: 

```html
<!DOCTYPE html>
<head>
  {{> head}}
    <!-- my js & css -->
</head>
<body>
  {{>header}}
  {{> start}}
    <!-- my charts -->
  {{> end}}
    <!-- my js & css -->
  {{> footer}}
</body>
```
### `{{>head}}`
head 區塊會 include 下面這些東西, `semantic`, `d3.js`, `jquery`, `meta`, `title`..., 所以請不要在其他地方重新宣告。

```html
<meta charset="utf-8">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" type="image/png" href="/favicon.ico" />
<meta property="og:title" content="用數據看台灣 - {{chart_description.title}}">
<meta property="og:site_name" content="用數據看台灣 - {{chart_description.title}}">
<meta property="og:description" content="{{chart_description.description}}">
<title>用數據看台灣 - {{chart_description.title}}</title>
<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">
<meta property="og:image" content="http://i.imgur.com/04AFcnA.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="300">
<meta property="og:image:height" content="300">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="/bower_components/semantic/dist/semantic.min.css" type="text/css" media="all" />
<link rel="stylesheet" href="/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.indigo-pink.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="/bower_components/semantic/dist/semantic.min.js"></script>
<script src="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js"></script>

```

### `{{> header}}`

header 區塊

我們的 header & footer 用 google 所開發的 material-design 所以他會引入一些 material-design 的一些 structure code ，[看 material-design doc](https://www.google.com/design/spec/material-design/introduction.html)

header 引入了 mdl 的 header & nav links

```html
<header class="mdl-layout__header">
<div class="mdl-layout__header-row">
  <span class="mdl-layout-title"><a href="http://real.taiwanstat.com/" style="color: #FFF"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</a></span>
  <div class="mdl-layout-spacer"></div>
  <nav class="mdl-navigation mdl-layout--large-screen-only">
  <a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>
  <a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>
  <a class="mdl-navigation__link" href="http://global.taiwanstat.com/r/">世界即時資訊</a>
  <a class="mdl-navigation__link" href="http://global.taiwanstat.com/l/">世界統計資訊</a>
  <a class="mdl-navigation__link" href="http://taiwanstat.com/opendata">開放資料分析部落格</a>
  <a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>
  </nav>
  <div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title"><a href="http://real.taiwanstat.com/"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</a></span>
      <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>
      <a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>
      <a class="mdl-navigation__link" href="http://global.taiwanstat.com/r/">世界即時資訊</a>
      <a class="mdl-navigation__link" href="http://global.taiwanstat.com/l/">世界統計資訊</a>
      <a class="mdl-navigation__link" href="http://taiwanstat.com/opendata">開放資料分析部落格</a>
      <a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>
      qG
      </nav>
    </div>

```

### `{{> start}}`

start 把這個圖表的 title & fb likes 都呈現出來，所以後面只要專心畫圖就好了，不用再寫 fb likes 的 code

```html

<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="layout-header">
  <main class="mdl-layout__content" id="main-content">
  <h2 id="title">{{chart_description.title}}</h2>
    <div class="fb-plugin">
    <div class="fb-like-box" data-href="https://www.facebook.com/taiwanstat?fref=ts" data-colorscheme="light" data-show-faces="false"></div>
    <div class="fb-like" data-href="http://real.taiwanstat.com/{{chart_description.url}}" data-width="300px" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
  </div>
    
```

### `{{> end}}`

end 包含 mdl 的 close tag, 然後包含 google analytics, fb script.

end:

```html
</main>
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-61023469-1', 'auto');
  ga('send', 'pageview');
</script>
<div id="fb-root"></div>
<script>
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=600079286760117&version=v2.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>
```

### `{{> footer}}`

footer 包含網站 footer 的 template 以及用 js 加入，數據討論區，嵌入碼引入

footer:

```html
<footer class="mdl-mini-footer">
  <div class="mdl-mini-footer__left-section">© 2015 <a href="#">用數據看台灣團隊</a> | 
    <a href="http://www.csie.ncku.edu.tw/ncku_csie/">NCKU-NetDB</a>
    {{#if chart_description.collaborators}}{{#each chart_description.collaborators}} | 
    <a href="{{url}}">{{name}}</a>{{/each}}{{/if}}
  </div>
  <div class="mdl-mini-footer__right-section">
    <span class="footer_msg">合作提案、客製化圖表製作、意見回饋
  </span>
    歡迎來信: <a href="mailto:contact@taiwanstat.com">contact@taiwanstat.com</a>
  </div>
</footer>
<script src="/js/main.js"></script>
```

## Open Data
[hackpad](https://hackpad.com/open-data-NfBKJugHykJ)

