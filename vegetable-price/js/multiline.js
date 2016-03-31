var vgCate = [
    '根莖類',
    '葉菜類',
    '花菜類',
    '瓜果類',
    '豆類與種子類',
    '其他',
];

var vgItem = {
    '根莖類':[
		'蘿蔔', '胡蘿蔔', '馬鈴薯', '芋', '牛蒡', '甘薯', '茭白筍', '蘆筍', '球莖甘藍', '洋蔥', '薑', '大蒜'
	],
	'葉菜類':[
		'甘藍', '小白菜', '包心白', '青江白菜', '蕹菜', '芹菜', '菠菜', '萵苣菜', '芥菜', '芥藍菜', '莧菜', '油菜', '甘薯葉', '蕨菜'
	],
	'花菜類':[
		'花椰菜', '金針花'
	],
	'瓜果類':[
		'胡瓜','冬瓜','絲瓜','苦瓜','扁蒲','茄子','番茄','甜椒','南瓜'
	],
	'豆類與種子類':[
		'豌豆', '菜豆', '敏豆', '萊豆', '毛豆', '玉米', '落花生'
	],
	'菇類':[
		'洋菇', '草菇', '木耳', '香菇', '金絲菇', '秀珍菇', '杏鮑菇'
	],
	'其他':[
		'辣椒', '芫荽', '茴香', '洋蔥', '青蔥', '韭菜', '大蒜', '薑'
	]
};

var TRANSF_TIME = 800;

var DROPDOWN_DURATION = 400;

function drawMultilineChart(domobj, domobjsel, _width){

    var dateParse = d3.time.format("%Y-%m-%d").parse;

    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = _width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);



    var color = d3.scale.category20();

    var mycolor = ["#FFFF00", "#FF8250","#FF0000"];

    var rankScale = d3.scale.linear()
                        .range(mycolor)
                        .domain([0,10,20]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format('%m月'))
        .tickSize(-height,0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5,"$")
        .orient("left")
        .tickSize(-width,0);

    var line = d3.svg.line()
        //.interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.price); });

    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d.date); })
        .y0(height2)
        .y1(function(d) { return y2(d.price); });



    var xAxis2 = d3.svg.axis()
        .scale(x2)
        .tickFormat(d3.time.format('%m月'))
        .orient("bottom");


    // basic form
    var svg = domobj
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

	var multi = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bg = multi.append("g")
            .append("rect")
            .attr("class","main_rect")
            .attr("width", width)
            .attr("height", height);

    var focus = multi.append("g")
            .attr("class","focus")
            .style("display", "none");

    //end--line chart feature setting

    // store data from firebase and drawing charts
	//   Read only once
    //d3.csv("./data/merge.csv", function(error, data) {
    d3.json("./data/alldata.json", function(error, data) {

		var priceDomain = [+0, +50];

		var timeDomain = getTimeDomain();

		var vgdata = data.vgdata;

        var tydata = data.tydata;

        // reconstruct(rebuild) date
        vgdata.forEach( function(v) {
            v.value.forEach( function(e) {
                e.date = dateParse(e.date);
                e.price = +e.price;
            });
            v.average = getAverage(v.value,timeDomain);
        });

        tydata.forEach( function(v) {
                v.name = v.name,
                v.rank = +v.rank,
                v.start_date = dateParse(v.start_date),
                v.end_date = dateParse(v.end_date)
        });

        var y_max = d3.max(
                vgdata.filter( function(v) { return v.opacity===1;}),
                function(v) { return d3.max(v.value, function(d) { return d.price; }); }
        );


        y_max = isNaN(y_max)? +50: y_max+20;

        priceDomain = [+0, y_max];

        x.domain(timeDomain);
		y.domain(priceDomain);

        x2.domain(timeDomain);
        y2.domain(y.domain());


        // append x axis by feature xAxis
        var gxAxis = multi.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0," + height + ")")
                .call(xAxis);

        // append y axis by feature yAxis
        var gyAxis = multi.append("g")
                .attr("class","y axis")
                .call(yAxis)
            .append("text")
                .attr("transform","rotate(-90)")
                .attr("y",6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price/Weight ($/kg)");

        multi.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // add all g
        var vg = multi.selectAll(".city")
                    .data(vgdata)
                    .enter()
                .append("g")
                    .attr("class","city")
                    .attr("id", function(v) { return 'tag_'+v.name; })
                    .attr("clip-path", "url(#clip)")
                    .style("opacity", function(v) { return v.opacity; });

        // add path by feature "line" under each ".city"
        var graph = vg.append("path")
            .attr("class","line")
            .attr("id", function(v) { return "tag_"+v.name; })
            .attr("d", function(v) { return line(v.value); })
            .style("stroke", function(v) { return color(v.name); });

        var tybar = multi.selectAll("bar")
                .data(tydata)
                .enter()
            .append("rect")
                .attr("clip-path", "url(#clip)")
                .attr("id", "typhoonbar")
                .attr("class","bar")
                .attr("x", function(ty) { return x(ty.start_date); })
                .attr("width", function(ty) { return x(ty.end_date) - x(ty.start_date); })
                .attr("y", 0)
                .attr("height", height)
                .style("fill", function(ty) {
                        var _rank = ty.rank <= 15 ? 0  :
                                    ty.rank <= 25 ? 10 :
                                    20;
                        return rankScale( _rank); })
                .style("opacity", 0.5)
                .style("display", 'block');

        var tooltip = domobj
            .append("div")
                .attr("class","tooltip")
                .style("opacity",1)
                .style("display","none");

        tooltip
            .selectAll("tip")
            .data(vgdata)
            .enter()
        .append("div")
            .attr("class","tip")
            .attr("id", function(v) { return "tag_"+v.name; })
            .style("display", "none")
        .append("text")
            .style("color", function(v) { return color(v.name); });

        tooltip
            .selectAll("typhoon")
                .data(tydata)
                .enter()
            .append("div")
                .attr("class","typhoon")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
            .append("text")
                .style("color", "black" )
                .text(function(v){ return v.name+":"+v.rank+" rk"; });

                // x dash line
        focus.selectAll(".x")
                .data(vgdata)
                .enter()
            .append("line")
                .attr("class","x")
                .attr("id", function(v) { return "tag_" + v.name; })
                .style("display","none")
                .style("stroke", "blue")
                .style("stroke-dasharray", "3.3")
                .style("opacity", 1)
                .attr("y1", -height)
                .attr("y2", 0);

        // y dash line
        focus.selectAll(".y")
                .data(vgdata)
                .enter()
            .append("line")
                .attr("class","y")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
                .style("stroke", function(v) { return color(v.name); })
                .style("stroke-dasharray", "3.3")
                .style("opacity", 1)
                .attr("x1", 0)
                .attr("x2", width);

        // plot
        focus.selectAll(".dot")
                .data(vgdata)
                .enter()
            .append("circle")
                .attr("class", "dot")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
                .style("opacity", 1)
                .style("fill", "none")
                .style("stroke", function(v) { return color(v.name); })
                .attr("r", 4);

        // active plane
        var activPlane = multi.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() {
                d3.select('g.focus').style('display', 'block');
                d3.select('div.tooltip').style("display", 'block');
            })
            .on("mouseout", function() {
                d3.select('g.focus').style('display', 'none');
                d3.select('div.tooltip').style("display", 'none');
            })
            .on("mousemove", mousemove);

        var bisectDate = d3.bisector(function(v) { return v.date; }).left;

        function mousemove () {

            var max = [];
            var x0 = x.invert(d3.mouse(this)[0]);
            var _x = d3.mouse(this)[0];

            vgdata.forEach( function(v) {
                if (v.opacity===1) {
                    var i = bisectDate(v.value, x0, 1);

                    i = (i>=v.value.length)?v.value.length-1:i;

                    var d0 = v.value[i - 1];
                    var d1 = v.value[i];
                    var d = x0 - d0.date > d1.date - x0 ? d1 : d0;


                    d3.select("g.focus > line.x#tag_" + v.name )
                        .attr("transform", "translate("+x(d.date)+","+y(0)+")");

                    d3.select("g.focus > line.y#tag_" + v.name )
                        .attr("transform", "translate("+0+","+y(d.price)+")");

                    d3.select("g.focus > circle.dot#tag_" + v.name )
                        .attr("transform", "translate("+x(d.date)+","+y(d.price)+")");

                    d3.select("div.tooltip > div#tag_" + v.name + ".tip > text")
                        .text(v.name+":"+d.price+" $NT/kg");

                    d3.select("a.ui.label.mouseprice")
                        .text(d.price);

                    }
                })
            ;

            if($('.typhoonbutton').hasClass('active')) {
                var change_white = true;

                tydata.forEach( function(ty) {
                    var ds1 = x(ty.start_date);
                    var ds2 = x(ty.end_date);

                    if (ds1<=_x && _x<=ds2) {
                        var _rank = ty.rank <= 15 ? 0  :
                                    ty.rank <= 25 ? 10 :
                                    20;

                        _color = rankScale(_rank);

                        d3.select('div.tooltip').style("background", _color);

                        d3.select('div.tooltip > div.typhoon#tag_' + ty.name )
                                .style("display", null);

                        change_white = false;
                    } else {
                        d3.select('div.tooltip > div.typhoon#tag_'+ty.name )
                            .style("display", "none");
                    }
                });

                if (change_white) {
                    d3.select('div.tooltip')
                        .style('background', 'white');
                }
            }
                d3.select('div.tooltip')
                    .style("left",d3.event.pageX+"px")
                    .style("top",d3.event.pageY+"px");
        }

        /*-------------------------------------------------*/
        var dropDownTop = d3.select('select.ui.dropdown.cate');

        dropDownTop.append("option")
                .attr("value","根莖類")
                .text("NONE");

        dropDownTop.selectAll("option.cateitem")
                .data(vgCate)
                .enter()
            .append("option")
                .attr("class","cateitem")
                .attr("value",function(d) { return d; })
                .text(function(d) { return d; });


        var dropDown = d3.select('select.ui.dropdown.eachVG');

        dropDown.append("option")
                .attr("value","蘿蔔")
                .text("蘿蔔");

        var tmpt = dropDown.selectAll("option.myitem")
                .data(vgdata);

        tmpt.exit().remove();

        tmpt.enter().append("option")
                .attr("class","myitem")
                .attr("value",function(d) { return d.name; })
                .text(function(d) { return d.name; });

        $('.dropdown.cate')
            .dropdown({
                action: 'activate',
                duration: DROPDOWN_DURATION,
                onChange: changeCate
            })
        ;

        changeCate('根莖類', '根莖類', '');


        function changeCate (text, value, $selectedItem){
              $('option.myitem').remove();
              if(typeof text!='undefined'){
                  var tmpt = dropDown.selectAll("option.myitem")
                          .data(vgItem[text]);

                  tmpt.exit().remove();

                  tmpt.enter().append("option")
                      .attr("class","myitem")
                      .attr("value",function(d) { return d; })
                      .text(function(d) { return d; });
              }
          }


        $('.dropdown.eachVG')
            .dropdown({
                action: 'activate',
                duration: DROPDOWN_DURATION,
                onChange:  changeVG
            })
        ;
        changeVG('蘿蔔', '蘿蔔');

        function changeVG(text, value, $selectedItem){
                    vgdata.forEach(function(d){
                        if(d.opacity===1) {
                            d.opacity = +0;
                            d3.select("g.city#tag_"+d.name).style("opacity",d.opacity);

                            d3.select("g.brushArea#tag_"+d.name)
                                .style("display", function(v) { return v.opacity===1 ?null:"none";});
                                //.style("opacity",d.opacity);

                            d3.select(".x#tag_"+d.name)
                                .style("display", function(v) { return v.opacity===1 ?null:"none";});

                            d3.select(".y#tag_"+d.name)
                                .style("display", function(v) { return v.opacity===1 ?null:"none" ;});

                            d3.select(".dot#tag_"+d.name)
                                .style("display", function(v) { return v.opacity===1 ?null:"none"; });

                            d3.select(".tip#tag_"+d.name)
                                .style("display", function(v) { return v.opacity===1 ?null:"none"; });

                            d3.select("div.ui.header#vgName")
                                .text('蔬果');

                            d3.select("a.ui.label.todayprice")
                                .text('-');

                            d3.select("a.ui.label.updownprice")
                                .text('-');

                            d3.select("a.ui.label.averageprice")
                                .text('-');

                            d3.select("a.ui.label.mouseprice")
                                .text('-');
                        }
                    });

                    if(typeof text!='undefined'){

                        var targetData = vgdata.filter(function(d){ return d.name==text; })[0];

                        targetData.opacity = +1;


                       // change y domain
                        y.domain([
                                0,
                                d3.max(
                                    targetData.value.map(function(v){ return v.price;})
                                )*7/6
                            ]);

                        y2.domain(y.domain());

                        d3.select("g.y.Axis")
                                .transition()
                                .duration(TRANSF_TIME)
                                .call(yAxis);

                        // line
                        d3.select("path.line#tag_"+targetData.name)
                                    .attr("d",line(targetData.value));

                        d3.select("g.city#tag_"+targetData.name)
                                .transition()
                                .duration(TRANSF_TIME)
                                    .style("opacity",targetData.opacity);

                        // area
                        d3.select("path.area#tag_"+targetData.name)
                                    .attr("d",area2(targetData.value));

                        d3.select("g.brushArea#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none";});

                        d3.select(".x#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none";});

                        d3.select(".y#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none" ;});

                        d3.select(".dot#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });

                        d3.select("div.ui.header#vgName")
                            .text(targetData.name);

                        d3.select("a.ui.label.todayprice")
                            .text(targetData.value[targetData.value.length-1].price);

                        var price = Math.round(
                                (targetData.value[targetData.value.length-1].price
                                       - targetData.value[targetData.value.length-2].price)*100
                                )/100;

                        d3.select("a.ui.label.updownprice")
                            .text(price)
                        ;
                        if (price > 0) {
                          $('.updownprice').addClass('red');
                        }
                        else {
                          $('.updownprice').addClass('green');
                        }

                        d3.select("a.ui.label.averageprice")
                            .text(targetData.average);

                        d3.select("a.ui.label.mouseprice")
                            .text(targetData.value[targetData.value.length-1].price);

                        d3.select(".tip#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });
                    }
                }
        /*-------------------------------------------------*/

        $('button.typhoonbutton')
            .on('click',function(){
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).text('顯示');
                    tybar
                        .style('display','none');
                } else {
                    $(this).addClass('active');
                    $(this).text('不顯示');
                    tybar
                        .style('display',null);
                }
            })
        ;


        ///// brush

     var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    /*
    context.append("path")
        .data(data)
        .attr("class", "area")
        .attr("d", area2);
    */

    // add all g
    var vgAreaG = context.selectAll(".brushArea")
            .data(vgdata)
                .enter()
            .append("g")
                .attr("class","brushArea")
                .attr("id", function(v) { return 'tag_'+v.name; })
                .attr("clip-path", "url(#clip)")
                .style("display", 'none')
                .style("opacity", function(v) { return +1; });

        // add path by feature "line" under each ".city"
    var vgArea = vgAreaG.append("path")
        .attr("class","area")
        .attr("id", function(v) { return "tag_"+v.name; })
        .attr("d", function(v) { return area2(v.value); })
        .style('fill', function(v) { return color(v.name); })
        .style("stroke", function(v) { return color(v.name); });

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
    .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7)
        .style("fill", "silver")
        .style("fill-opacity", 0.5)
        .style("visibility", "visible");

    ////////////////

        function brushed() {

            x.domain(brush.empty() ? x2.domain() : brush.extent())
                    .range([0, width]);

            graph
                .attr("d", function(v) { return line(v.value); });

            tybar
                .attr("x", function(ty) { return x(ty.start_date); })
                .attr("width", function(ty) { return x(ty.end_date) - x(ty.start_date); })
                .attr("y", 0)
                .attr("height", height);

            vg.select(".x.axis").call(xAxis);
            d3.select(".x.axis").call(xAxis);
        }

        $('#wait').remove();
    });//csv-loader....
}

function getTimeDomain() {
    var start_date = new Date(2015,0,1);
    var yesterday = new Date();

    yesterday.setDate(yesterday.getDate()-1);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);

    return [start_date, yesterday];
}


function getAverage(array, domain){

    var a = [];

    a = array.filter(function(d){
            return d.date > domain[0] &&
                    d.date < domain[1];
        })
    ;
    return _average(a);


    /*private function*/
    function _average(array){
        var total = +0;
        var length = array.length;
        var average = +0;

        if (length > +0) {
            for (i in array) {
                total = total + array[i].price;
            }

            average = total/length;
            average = Math.round(average*100)/100;
        }

        return average;
    };
}
