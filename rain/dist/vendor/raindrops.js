!function t(i,s,o){function n(h,r){if(!s[h]){if(!i[h]){var p="function"==typeof require&&require;if(!r&&p)return p(h,!0);if(e)return e(h,!0);throw new Error("Cannot find module '"+h+"'")}var a=s[h]={exports:{}};i[h][0].call(a.exports,function(t){var s=i[h][1][t];return n(s?s:t)},a,a.exports,t,i,s,o)}return s[h].exports}for(var e="function"==typeof require&&require,h=0;h<o.length;h++)n(o[h]);return n}({1:[function(t,i,s){function o(t){document.contains(t.element[0])&&(n($("#"+t.element[0].id))&&(100*Math.random()<t.options.frequency&&(t.springs[Math.floor(Math.random()*t.options.waveLength)].p=t.options.waveHeight),t.ctx.clearRect(0,0,t.options.realWidth,t.options.canvasHeight),t.updateSprings(.1),t.renderWaves()),requestAnimationFrame(function(){o(t)}))}function n(t){var i=$(window),s={top:i.scrollTop(),left:i.scrollLeft()};s.right=s.left+i.width(),s.bottom=s.top+i.height();var o=t.offset();return o.right=o.left+t.outerWidth(),o.bottom=o.top+t.outerHeight(),!(s.right<o.left||s.left>o.right||s.bottom<o.top||s.top>o.bottom)}$.widget("water.raindrops",{options:{waveLength:340,canvasWidth:0,canvasHeight:0,color:"#00aeef",frequency:3,waveHeight:100,density:.02,rippleSpeed:.1,rightPadding:20,position:"absolute",positionBottom:0,positionLeft:0},_create:function(){var t=window.document.createElement("canvas");this.options.canvasHeight||(this.options.canvasHeight=this.element.height()/2),this.options.canvasWidth||(this.options.canvasWidth=this.element.width()),this.options.realWidth=this.options.canvasWidth+this.options.rightPadding,t.height=this.options.canvasHeight,t.width=this.options.realWidth,this.ctx=t.getContext("2d"),this.ctx.fillStyle=this.options.color,this.element.append(t),t.parentElement.style.overflow="hidden",t.parentElement.style.position="relative",t.style.position=this.options.position,t.style.bottom=this.options.positionBottom,t.style.left=this.options.positionLeft,this.springs=[];for(var i=0;i<this.options.waveLength;i++)this.springs[i]=new this.Spring;o(this)},Spring:function(){this.p=0,this.v=0,this.update=function(t,i){this.v+=-i*this.p-t*this.v,this.p+=this.v}},updateSprings:function(t){var i;for(i=0;i<this.options.waveLength;i++)this.springs[i].update(this.options.density,this.options.rippleSpeed);for(var s=[],o=[],n=0;8>n;n++){for(i=0;i<this.options.waveLength;i++)i>0&&(s[i]=t*(this.springs[i].p-this.springs[i-1].p),this.springs[i-1].v+=s[i]),i<this.options.waveLength-1&&(o[i]=t*(this.springs[i].p-this.springs[i+1].p),this.springs[i+1].v+=o[i]);for(i=0;i<this.options.waveLength;i++)i>0&&(this.springs[i-1].p+=s[i]),i<this.options.waveLength-1&&(this.springs[i+1].p+=o[i])}},renderWaves:function(){this.options.frequency>0&&5<this.options.canvasHeight&&(this.options.canvasHeight-=.02);var t;for(this.ctx.beginPath(),this.ctx.moveTo(0,this.options.canvasHeight),t=0;t<this.options.waveLength;t++)this.ctx.lineTo(t*(this.options.realWidth/this.options.waveLength),this.options.canvasHeight/2+this.springs[t].p);this.ctx.lineTo(this.options.realWidth,this.options.canvasHeight),this.ctx.fill()}})},{}]},{},[1]);