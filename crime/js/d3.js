var gener_color=360;
var height=600;
var pop = {};
var data = {}
var topodata2 = {};

var width = $('.bar.column').width();
if(width > 600)
  width = 600;

d3.json("./data/city.json",function(resTopodata2){
d3.csv("./data/crim.csv",function(resData){
d3.json("./data/population.json",function(resPop){
  data = resData;
  pop = resPop;
  topodata2 = resTopodata2
  bar(data, pop);


    	var features = topojson.feature(topodata2, topodata2.objects["city"]).features;
      	// 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名}
	var projection=d3.geo.mercator().center([122,24]).scale(7000); // 座標變換函式
	var path = d3.geo.path().projection(projection);
  var svg = d3.select('#map');

  svg.attr('width', width)
    .attr('height', width/600*650)
    .attr("viewBox", "0 0 600 650");
  var g=svg.append("g");


	var allcrim=d3.nest()
		.key(function(d){return d.案類;})
		.key(function(d){return d.發生地點.substring(0,3);})
		.rollup(function(d){return d.length;})
		.entries(data);
	var index=getform();
	var crim=allcrim[index].values;
	for(var i=0;i<crim.length;i++){
		crim[i].values=Math.round((crim[i].values)/get_popu(crim[i].key)*100)/100;
	}
	var arr=[];
	for(var i=0;i<crim.length;i++) arr.push(crim[i].values);
	var max=d3.max(arr);
	g.selectAll("path").data(features).enter().append("path")
		.attr("class",function(d){return d.properties.C_Name;}).attr("d",path)
		.attr("fill",function(d,i) {  	var name=d.properties.C_Name;
						var value=-100;
						for(var j=0;j<crim.length;j++)
						{
							if(crim[j].key==name){
							value=crim[j].values;
							break;
							}
						}
						var color = 0.9 -value/max * 0.6;

        					return  d3.hsl(gener_color ,color, color);})
		.classed("city",true)
		.on("mouseover",mouse).on("click",click);
	function mouse(d){
		d3.select(this).classed("mouse",true).on("mouseleave",leave);
		var Cname=d.properties.C_Name;
		d3.selectAll("."+Cname).classed("mouse",true);
		function leave(){
			d3.select(this).classed("mouse",false);
			d3.selectAll("."+Cname).classed("mouse",false);
		}
	}
	function click(d){
		ccrim(d);
  		var b = path.bounds(d);
		d3.select(this).on("click",reset).mouse;

  			/*g.transition().duration(750).attr("transform", "translate(" + projection.translate() + ")"
			//+ "scale(" +Math.min(300/(b[1][0] - b[0][0]),400/(b[1][1] - b[0][1]))+ ")"
			+ "scale(" +4+ ")"
			+ "translate(" + (-(b[1][0] + b[0][0])/2-50) + "," + (-(b[1][1] + b[0][1])/2+25)  + ")");*/
	}
	function reset(){
		$("#City").attr("disabled",false);
		d3.select("form").select("text").attr("x",0).attr("y",0).text("");
		change();
    $('select').show();
	//	g.transition().duration(750).attr("transform","");
		d3.selectAll("path").classed("click",false).on("click",click);
	}
	function get_popu(name){
		return (pop[name]/100000);
		//per ten million
	}
});
});
});


function bar(data, pop){
	var allcrim=d3.nest()
		.key(function(d){return d.案類;})
		.key(function(d){return d.發生地點.substring(0,3);})
		.rollup(function(d){return d.length;})
		.entries(data);
	var index=getform();
	var crim=allcrim[index].values;
	for(var i=0;i<crim.length;i++){
		crim[i].values=Math.round((crim[i].values)/get_popu(crim[i].key)*100)/100;
	}
	var arr=[];
	for(var i=0;i<crim.length;i++) arr.push(crim[i].values);
	var max=d3.max(arr);
	var Xscale=d3.scale.linear().domain([0,max]).range([0,width-110]);
	var Yscale=d3.scale.linear().domain([0,21]).range([0,height]);
  var svg = d3.select("#bar");
  svg.attr('width', width)
    .attr('height', 600)
    .attr("viewBox", "0 0 "+width+" 600");
	var barg=svg.append("g");

	
	var bar=barg.selectAll("rect").data(crim);
	var labels=barg.selectAll("text").data(crim);
	bar.enter().append("rect");
	labels.enter().append("text");
	//var bar=barg.selectAll("rect").data(crim.values).enter().append("rect")
		bar.attr("class",function(d){return d.key;}).sort(function(a,b){return b.values-a.values;})
		.attr("x",110)
		.attr("y",function(d,i){return Yscale(i);})
		.attr("width",function(d){
			return Xscale(d.values);})
		.attr("height",20)
		.attr("fill",function(d) {
			var color = 0.9 - d.values/max * 0.6;
        		return  d3.hsl(gener_color ,color, color);})
		.on("mouseover",mouse);
	d3.select("#map").select("g").selectAll("rect").sort(function(a,b){
			return b.values-a.values;
		}).transition();
	//var labels=barg.selectAll("text").data(crim.values).enter().append("text")
		labels.attr("class","labels").sort(function(a,b){return b.values-a.values;})
		.attr("x",0)
		.attr("y",function(d,i){return Yscale(i)+14;})
		.text(function(d){
			if(d.key=="") return "不詳 "+d.values;
			else return d.key+" "+d.values;});
	function mouse(d){
		d3.select(this).classed("mouse",true).on("mouseleave",leave);
		var Cname=d.key;
		d3.selectAll("."+Cname).classed("mouse",true);
		function leave(){
			d3.select(this).classed("mouse",false);
			d3.selectAll("."+Cname).classed("mouse",false);
		}
	}
	function get_popu(name){
		return (pop[name]/100000);
		//per ten million
	}
}
function change(){
	var allcrim=d3.nest()
		.key(function(d){return d.案類;})
		.key(function(d){return d.發生地點.substring(0,3);})
		.rollup(function(d){return d.length;})
		.entries(data);
	var index=getform();
	var crim=allcrim[index].values;
	for(var i=0;i<crim.length;i++){
		crim[i].values=Math.round((crim[i].values)/get_popu(crim[i].key)*100)/100;
	}
	var arr=[];
	for(var i=0;i<crim.length;i++) arr.push(crim[i].values);
	var max=d3.max(arr);
	var Xscale=d3.scale.linear().domain([0,max]).range([0,width-110]);
	var Yscale=d3.scale.linear().domain([0,21]).range([0,height]);
	var bar=d3.select("#bar").select("g").selectAll("rect").data(crim,function(d){return d.key;});
	var labels=d3.select("#bar").select("g").selectAll("text").data(crim);
	var g=d3.select("#map").select("g").selectAll("path");
	bar.exit().remove();
	labels.exit().remove();
	bar.enter().append("rect").on("mouseover",mouse);
	labels.enter().append("text");
	//var bar=barg.selectAll("rect").data(crim.values).enter().append("rect")
		bar.sort(function(a,b){return b.values-a.values;})
		.attr("fill","#fff")
		.attr("width",0)
		.transition().duration(750).attr("class",function(d){return d.key;})
		.attr("x",110)
		.attr("y",function(d,i){return Yscale(i);})
		.attr("width",function(d){return Xscale(d.values);})
		.attr("height",20)
		.attr("fill",function(d) {
			var color = 0.9 - d.values/max * 0.6;
        		return  d3.hsl(gener_color ,color, color);})
	//var labels=barg.selectAll("text").data(crim.values).enter().append("text")
		labels.sort(function(a,b){return b.values-a.values;}).transition().duration(750).attr("class","labels")
		.attr("x",0)
		.attr("y",function(d,i){return Yscale(i)+14;})
		.text(function(d){return d.key+" "+d.values;});
		g.transition().duration(750)
		.attr("fill",function(d,i) {  	var name=d.properties.C_Name;
						var value=-100;
						for(var j=0;j<crim.length;j++)
						{
							if(crim[j].key==name){
							value=crim[j].values;
							break;
							}
						}
						//var value=d3.selectAll("."+name).data();
						//if(value.length==1){return d3.hsl(gener_color,1,1);}
						//else{
						var color = 0.9 -value/max * 0.6;
        					return  d3.hsl(gener_color ,color, color);});
	function mouse(d){
		d3.select(this).classed("mouse",true).on("mouseleave",leave);
		var Cname=d.key;
		d3.selectAll("."+Cname).classed("mouse",true);
		function leave(){
			d3.select(this).classed("mouse",false);
			d3.selectAll("."+Cname).classed("mouse",false);
		}
	}
	function get_popu(name){
		return (pop[name]/100000);
		//per ten million
	}
}
function ccrim(d){
	$("#City").attr("disabled",true);
	var value=d.properties.C_Name;
	d3.select("form").select("text").attr("x",0).attr("y",0).text(value);
  $('select').hide();
	var allcrim=d3.nest()
		.key(function(d){return d.發生地點.substring(0,3);})
		.key(function(d){return d.案類;})
		.rollup(function(d){return d.length;})
		.entries(data);
	var rank=d3.nest()
		.key(function(d){return d.案類;})
		.key(function(d){return d.發生地點.substring(0,3);})
		.rollup(function(d){return d.length;})
		.entries(data);
	var crim;
	for(var i=0;i<22;i++){
		if(value==allcrim[i].key) {crim=allcrim[i].values; break;}
	}
	for(var i=0;i<crim.length;i++){
		crim[i].values=Math.round((crim[i].values)/get_popu(value)*100)/100;
	}
	for(var i=0;i<rank.length;i++){
		for(var j=0;j<rank[i].values.length;j++){
			rank[i].values[j].values=Math.round((rank[i].values[j].values)/get_popu(rank[i].values[j].key)*100)/100;
		}
	}
	var arr=[];
	for(var i=0;i<crim.length;i++) arr.push(crim[i].values);
	var max=d3.max(arr);
	var Xscale=d3.scale.linear().domain([0,max]).range([0,width-200]);
	var Yscale=d3.scale.linear().domain([0,21]).range([0,height]);
	var bar=d3.select("#bar").select("g").selectAll("rect").data(crim);
	var labels=d3.select("#bar").select("g").selectAll("text").data(crim);
	bar.exit().remove();
	labels.exit().remove();
	bar.enter().append("rect");
	labels.enter().append("text");
	//var bar=barg.selectAll("rect").data(crim.values).enter().append("rect")
		bar.sort(function(a,b){return b.values-a.values;})
		.attr("fill","#fff")
		.transition().duration(750).attr("class",function(d){return d.key;})
		.attr("x",200)
		.attr("y",function(d,i){return Yscale(i);})
		.attr("width",function(d){return Xscale(d.values);})
		.attr("height",20)
		.attr("fill",function(d) {
			var color = 0.9 - d.values/max * 0.6;
        		return  d3.hsl(gener_color ,color, color);})
	//var labels=barg.selectAll("text").data(crim.values).enter().append("text")
		labels.sort(function(a,b){return b.values-a.values;}).transition().duration(750).attr("class","labels")
		.attr("x",0)
		.attr("y",function(d,i){return Yscale(i)+14;})
		.text(function(d){
			var rankarr=[];
			for(i=0;i<rank.length;i++){
				if(rank[i].key==d.key) break;
			}
			for(var j=0;j<rank[i].values.length;j++)
				rankarr.push(rank[i].values[j].values);
			rankarr.sort(function(a,b){return b-a;});
			var num=rankarr.indexOf(d.values);
			return d.key+"\t\t"+d.values+"(NO."+(num+1)+")";});

	function get_popu(name){
		return (pop[name]/100000);
		//per ten million
	}
}
function getform() {
    var obj = document.getElementById("City");
    var c = obj.selectedIndex;
  return c;
}
