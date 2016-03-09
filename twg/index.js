var color = d3.scale.linear().domain([8, 13, 18, 20]).range(["#E7E879", "#50B584", "#3E8E68", "#23632F"]);
var color_sex = d3.scale.linear().domain([1, 2]).range(["#309ac1", "#eb6f70"]);
var color_star = d3.scale.linear().domain([1, 2, 3, 4]).range(["#D33948", "#FFDB91", "#95BF95", "#96E5FF"]);
    //range(["#ffffe0", "#800000"]);

var width = 900 , height = 800;
var svg = d3.select("svg");

var nodes = [] , name_q = [] , big_q = [];
var node = svg.selectAll(".node");

// 4點位置座標
var foci = [{ x: 350, y: 600 }, { x: -800, y: -600 }, { x: 1400, y: -600 }, { x: -800, y: 1000 }, { x: 1400, y: 1000 }];
var foci_updown = [{x:350 , y:650} , {x:-400 , y: -800} , {x: 1600, y:0} , {x: -1000, y:500} , {x: 700, y: 1100}];
var foci_two = [{ x: 350, y: 1000 }, { x: -800, y: 400 }, { x: 1400, y: 400 }];
var count = [{position0:0 , position1:0 , position2:0 , position3:0 , position4:0},
    {position0:0 , position1:0 , position2:0 , position3:0 , position4:0},
    {position0:0 , position1:0 , position2:0 , position3:0 , position4:0},
    {position0:0 , position1:0 , position2:0 , position3:0 , position4:0},
    {position0:0 , position1:0 , position2:0 , position3:0 , position4:0},
    {position0:0 , position1:0 , position2:0 , position3:0 , position4:0}];

/* 12點位置座標
var foci_star = [{x: 400 , y:2000} , {x: -1000 , y: -700},{x: -100 , y: -700} , {x :800 , y :-700} , {x :1700 , y :-700} ,{x: -800 , y: 400},{x: 0 , y: 400} , {x :800 , y :400} , {x :1600 , y :400} , {x: -1000 , y: 1500},{x: -100 , y: 1500} , {x :800 , y :1500} , {x :1700 , y :1500}];
*/

var stop_toggle = 0, change_toggle = 0, autoplay_toggle = 0, color_toggle = 0 , drop_toggle = 0 , eye_toggle = 0;
var beforeState = 0 ;
var autoInterval_id , setTimeAnalysis_id0 , setTimeAnalysis_id1 , setTimeAnalysis_id2 , setTimeAnalysis_id3 , setTimeAnalysis_id4 , eyeInterval;

//半徑 球的數量
var i = 0;
var r = 0, radius = 0;
/*-----------------------------
change_toggle =>    0:初始狀態
                    1:無重力
                    2:院所分類
                    3:系級
                    4:哪裡人
                    5:性別
                    6:mental_1
                    7:mental_2
                    8:顯示數據
------------------------------ */

function tick(e) {

    //e.alpha （ tick 裡的 alpha 值 )
    var k = .1 * e.alpha;

    //  利用按鍵改變模式
    if (change_toggle == 0) {
        $('#logo_div').css("display","block");

        beforeState = 0;

        force.gravity(0)

        // Push nodes toward their designated focus.
        // forEach(value , index , obj)
        nodes.forEach(function(o, i) {
            o.y += (250 - o.y + 100) * k;
            o.x += (450 - o.x) * k;

            var r = Math.sqrt(Math.pow(o.x - 400, 2) + Math.pow(o.y - 200, 2));
            if (r < 110 && r != 0) {
                o.x += 1.1 * (o.x - 400) / (r+20);
                o.y += 1.1 * (o.y - 200) / (r+20);
            } else if (r > 140 && r != 0) {
                o.x -= 1.1 * (o.x - 400) / (r+20);
                o.y -= 1.1 * (o.y - 400) / (r+20);
            }
        });

        //撞擊
        //quadtree 一種很棒的搜尋方式，增加效率！
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;
        while (++i < n)
            q.visit(collide(nodes[i]));

        $('.face_eye').css("display","block");
        $('.face_smile').css("display","block");
        $('.face_outEye').css("display","block");
        $('.name_text').css("opacity", 0);

    } else if (change_toggle == 1){
        force.gravity(0);
    }
    else if (change_toggle == 2) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[0]].y - o.y) * k;
            o.x += (foci[o.setNum[0]].x - o.x) * k;
        });

    } else if (change_toggle == 3) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[1]].y - o.y) * k;
            o.x += (foci[o.setNum[1]].x - o.x) * k;
        });

    } else if (change_toggle == 4) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci_updown[o.setNum[2]].y - o.y) * k;
            o.x += (foci_updown[o.setNum[2]].x - o.x) * k;
        });

    } else if (change_toggle == 5) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci_two[o.setNum[3]].y - o.y) * k;
            o.x += (foci_two[o.setNum[3]].x - o.x) * k;
        });

    } else if (change_toggle == 6){
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci_updown[o.setNum[4]].y - o.y) * k;
            o.x += (foci_updown[o.setNum[4]].x - o.x) * k;
        });
    }
    else if (change_toggle == 7){
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[5]].y - o.y) * k;
            o.x += (foci[o.setNum[5]].x - o.x) * k;
        });
    }
    else if (change_toggle == 8){
        force.gravity(0);

        nodes.forEach(function(o,i){
            o.vy += 0.5; // 加速度 - 向下 0.5
            o.y += o.vy;
            if(o.y + o.radius >= 790) {  // 不超過 y 軸 300 的位置
              o.y = 790 - o.radius;
              o.vy = -1 * (Math.abs(o.vy)+0.2); //加0.2提高彈跳位置 
            }
            o.vy = o.vy * 0.9; // 速度因空氣阻力(!?)而不斷減少
        });
    }

    d3.selectAll(".circle")
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })

    d3.selectAll(".g_text")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })

    force.alpha(0.02);
}

//建立layout , force !!
var force = d3.layout.force()
    .nodes(nodes) //綁定資料
    .gravity(0)
    .size([width, height]) //設定範圍
    .charge(function(d) {
        return 20 * -d.radius;
    })
    .on("tick", tick);

//Firebase 資料庫
//公用的 var myDataRef = new Firebase('https://o47un23yblt.firebaseio-demo.com/');
var myDataRef = new Firebase('https://flickering-heat-4075.firebaseio.com');
var nodeList = myDataRef.child('nodes');
var nameList = myDataRef.child('nameRecord');

// space    => 無重力狀態
//  z       => 暫停/開始
//  x       => 換成殘酷的男女顏色
//  /       => 切換狀態
//  .       => 自動播放 (change_toggle 從你現在狀態開始)
//  ,       => 回復初始狀態(change_toggle = 0)
//  a       => 掉落分析
$('body').keypress(function(e) {
    console.log(e.keyCode);
    $('#logo_div').css("display","none");

    //stop_toggle => 控制stop
    if (e.keyCode == 122 || e.keyCode == 12552) {
        if (stop_toggle == 0) {
            force.stop();

            //檢查是否在自動播放狀態（文字也要停掉）
            if (autoplay_toggle == 1)
                window.clearInterval(autoInterval_id);

            stop_toggle = 1;
        } else {
            force.resume();

            if (autoplay_toggle == 1)
                autoInterval_id = window.setInterval("slideFlow()", 2000);



            stop_toggle = 0;
        }
    }
    if (e.keyCode == 120 || e.keyCode == 12556) {

        if (color_toggle == 0) {
            d3.selectAll(".circle").style("fill", function(d) {
                    return color_sex(d.setNum[3]);
                }) //依照性別去選顏色

            color_toggle = 1;
        } else {
            d3.selectAll(".circle").style("fill", function(d) {
                    return color(d.radius);
                }) //原本顏色

            color_toggle = 0;
        }
    }
    //change_toggle = 1
    if (e.keyCode == 13) {

        //隱藏 name_text
        $('.name_text').css("opacity", 0);

        if (change_toggle != 1) {
            change_toggle = 1;
            window.clearInterval(autoInterval_id);
        } else {
            change_toggle = 0;
        }
    }
    //change_toggle = 2.3.4....
    if (e.keyCode == 47 || e.keyCode == 12581) {

        //explosion();
        if (autoplay_toggle ==1)
            window.clearInterval(autoInterval_id);

        slideFlow();
    }
    //自動播放 toggle 從現在狀態開始
    if (e.keyCode == 46 || e.keyCode == 12577) {
        console.log("autoplaytoggle:" + autoplay_toggle);

        if (autoplay_toggle == 0) {

            autoInterval_id = window.setInterval("slideFlow()", 3000)
            autoplay_toggle = 1;
        } else {
            //隱藏 name_text
            $('.name_text').css("display", "none");
            window.clearInterval(autoInterval_id);
            change_toggle = 0;
            autoplay_toggle = 0;
        }
    }

    if (e.keyCode == 44 || e.keyCode == 12573) {
        //隱藏 name_text
        $('.name_text').css("opacity", 0);

        if (autoplay_toggle == 1)
            window.clearInterval(autoInterval_id);

        stopAnalysis();
        autoplay_toggle = 0 ;
        drop_toggle = 0 ;
        change_toggle = 0;
    }
    if(e.keyCode == 97 || e.keyCode == 12551) {
        if ( drop_toggle == 0){
            change_toggle = 8;

            show_number();
            $('.data_text').css("opacity" , 1);
            
            drop_toggle =1 ;
        }
        else{
            change_toggle = beforeState;

            stopAnalysis();
            drop_toggle = 0 ;
        }
    }
    if (e.keyCode ==115 ){
        console.log("111");
        mentalFlow();
    }
});

// 後端data 傳回來
// Math.random() => 0 ~ 0.99999
nodeList.on('child_added', function(snapshot) {

    //擷取資料 => myDateRef
    var person = snapshot.val();

    //用age 判斷r
    radius = setRadius(person.age);

    //Add nodes
    nodes.push({
        'radius': radius,
        'name': person.name,
        'sex': person.sex,
        'school': person.school,
        'department': person.department,
        'area': person.area,
        'message': person.message,
        'age': person.age,
        'setNum': person.setNum,
        'vy':person.vy
    });

    //分析setNum
    analysis_setNum(person.setNum);
    console.log("count:"+count[1].position1);

    r = parseInt(radius);

    //開始forcelayout!!
    force.start();
    node = node.data(nodes);

    node.enter().append("g")
        .attr("class", "node")
        .attr("id", "ID" + i);

    d3.select("#ID" + i).append("circle")
        .attr("class", "circle")
        .attr("id", "circle" + i)
        .attr("r", r) // 半徑範圍: 8 ~ 18
        .style("fill", function(d) {
            if (change_toggle == 5)
                return color_sex(d.setNum[3]); //性別色
            else if (change_toggle == 6)
                return color_star(d.setNum[4]); //星座色
            else return color(d.radius); //原色
        })
        .call(force.drag)
        .on('dblclick', highlightNodes); // Highlight Effect!


    d3.select("#ID" + i).append("text")
        .attr("class", "g_text")
        .attr("dx", 23)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name
        });
    console.log(nodes);

    //計算node 數量
    i++;

    if ( i == 25)
        $(".face_eye").fadeTo("slow",1);
    if ( i == 35)
        $("#smile1").fadeTo("slow" , 1);
    if ( i == 45)
        $("#smile2").fadeTo("slow" , 1);
    if ( i == 50){
        $("#smile2").fadeTo("slow" , 0);
        $(".face_outEye").fadeTo("slow" , 1);
        $("#eye1").animate({"r":4 , "cx":367},500);
        $("#eye2").animate({"r":4 , "cx":467},500);

        eyeMove();
    }
});

function eyeMove(){
    eyeInterval = setInterval(function(){
        if (eye_toggle == 0){
            $('#eye1').animate({"cx":353},2000);
            $('#eye2').animate({"cx":453},2000);

            eye_toggle = 1 ;
        }
        else{
            $('#eye1').animate({"cx":367},2000);
            $('#eye2').animate({"cx":467},2000);

            eye_toggle = 0 ;
        }
    },4000)
}

//監聽nameList
nameList.on("child_added",function(snapshot){

    name_q.push({'name':snapshot.val().name});
    big_q.push({'id':i-1});

    nameList.remove();
    show_name();
});

function show_name(){
    if (name_q.length == 0)
        ;
    else{
        $('#welcome_text').html("~歡迎 :&nbsp;&nbsp;<em><span id = \"welcome_name\">" + name_q[0].name + "</span></em>&nbsp;&nbsp;&nbsp;到來~");
        $("#welcome").fadeTo("slow", 1 , big);
        $("#welcome").delay(700).fadeTo("normal", 0 , shift_name_q);
    }
}

function shift_name_q(){
    var c = name_q.shift();
    console.log(c);
    if (name_q.length == 0){
        //讓welcome block 消失，才不會擋住點擊效果
        $("#welcome").css("display", "none");
    }
    else{
        $('#welcome_text').html("~歡迎 :&nbsp;&nbsp;<em><span id = \"welcome_name\">" + name_q[0].name + "</span></em>&nbsp;&nbsp;&nbsp;到來~");
    }
}

function big(){
    if (big_q.length == 0)
        ;
    else{
        d3.select("#circle" + big_q[0].id)
            .transition()
            .duration(1000)
            .attr("r", 200)
            .transition()
            .duration(500)
            .attr("r", r)
            .call(function(){
                big_q.shift();
            });
    }
}
function analysis_setNum(array){
    console.log("setNum:"+array);
    for(var c = 0 ; c < array.length ; c++)
    {
        if ( array[c] == 0)
            count[c].position0++ ;
        if ( array[c] == 1)
            count[c].position1++ ;
        if ( array[c] == 2)
            count[c].position2++ ;
        if ( array[c] == 3)
            count[c].position3++ ;
        if ( array[c] == 4)
            count[c].position4++ ;
    }
    console.log(count[4].position2);
}

function show_number(){
    var a0 = 0 , a1 = 0 , a2 = 0 , a3 = 0 , a4 = 0;

    //因beforeState 為change_toggle的狀態，這裡對應setNum要-2
    var n0 = setPercent(count[beforeState-2].position0);
    var n1 = setPercent(count[beforeState-2].position1);
    var n2 = setPercent(count[beforeState-2].position2);
    var n3 = setPercent(count[beforeState-2].position3);
    var n4 = setPercent(count[beforeState-2].position4);

    if(beforeState == 2 || beforeState == 3){
        $('#dataText_0').attr({"x": 425 , "y":520});
        $('#dataText_1').attr({"x": 200 , "y":280});
        $('#dataText_2').attr({"x": 650 , "y":280});
        $('#dataText_3').attr({"x": 200 , "y":630});
        $('#dataText_4').attr({"x": 650 , "y":630});
    }
    if(beforeState == 4){
        //與字差70
        $('#dataText_1').attr({"x": 280 , "y":230});
        $('#dataText_2').attr({"x": 710 , "y":380});
        $('#dataText_3').attr({"x": 140 , "y":510});
        $('#dataText_4').attr({"x": 510 , "y":660});
    }
    if(beforeState == 5){
        $('#dataText_1').attr({"x": 200 , "y":500});
        $('#dataText_2').attr({"x": 650 , "y":500});
    }

    console.log("n1:"+n1);
    console.log("n2:"+n2);
    console.log("n3:"+n3);
    console.log("n4:"+n4);

    setTimeAnalysis_id0 = window.setInterval(function(){
        if (a0 >= n0) {
            $("#dataText_0").text(n0+"%");
            $("#dataText_0").css("font-size",a0*2.5 +"px");
            window.clearInterval(setTimeAnalysis_id0);
        }
        else{
            $("#dataText_0").text(a0+"%");
            $("#dataText_0").css("font-size",a0*2.5 +"px"); 
            a0++;
        }
        set_dataText_color(a0 , 0);
    }, 50);

    setTimeAnalysis_id1 = window.setInterval(function(){
        if (a1 >= n1) {
            $("#dataText_1").text(n1+"%");
            $("#dataText_1").css("font-size",a1*2.5 +"px");
            window.clearInterval(setTimeAnalysis_id1);
        }
        else{
            $("#dataText_1").text(a1+"%");
            $("#dataText_1").css("font-size",a1*2.5 +"px"); 
            a1++;
            set_dataText_color(a1 , 1);
        }
    }, 50);
    setTimeAnalysis_id2 = window.setInterval(function(){
        if (a2 >= n2) {
            $("#dataText_2").text(n2+"%");
            $("#dataText_2").css("font-size",a2*2.5 +"px");
            window.clearInterval(setTimeAnalysis_id2);
        }
        else{
            $("#dataText_2").text(a2+"%");
            $("#dataText_2").css("font-size",a2*2.5 +"px"); 
            a2++;
            set_dataText_color(a2 , 2);
        }
    }, 50);
    setTimeAnalysis_id3 = window.setInterval(function(){
        if (a3 >= n3) {
            $("#dataText_3").text(n3+"%");
            $("#dataText_3").css("font-size",a3*2.5 +"px");
            window.clearInterval(setTimeAnalysis_id3);
        }
        else{
            $("#dataText_3").text(a3+"%");
            $("#dataText_3").css("font-size",a3*2.5 +"px"); 
            a3++;
            set_dataText_color(a3 , 3);
        }
    }, 50);
    setTimeAnalysis_id4 = window.setInterval(function(){
        if (a4 >= n4) {
            $("#dataText_4").text(n4+"%");
            $("#dataText_4").css("font-size",a4*2.5 +"px");
            window.clearInterval(setTimeAnalysis_id4);
        }
        else{
            $("#dataText_4").text(a4+"%");
            $("#dataText_4").css("font-size",a4*2.5 +"px"); 
            a4++;
            set_dataText_color(a4 , 4);
        }
    }, 50);

}

function stopAnalysis(){

    $('.data_text').attr("stroke","black");
    $('.data_text').attr("fill","black");

    //$('.name_text').css("opacity",0);
    $('.data_text').css("opacity" , 0);
    $('.data_text').css("font-size" , "0px");
    window.clearInterval(setTimeAnalysis_id0);
    window.clearInterval(setTimeAnalysis_id1);
    window.clearInterval(setTimeAnalysis_id2);
    window.clearInterval(setTimeAnalysis_id3);
    window.clearInterval(setTimeAnalysis_id4);
}

function setPercent(num){
    var answer = (num*100)/i ;
    return answer.toFixed(1);
}

function set_dataText_color(num , id){
    if (num >= 15){
        $('#dataText_'+id).attr("stroke", "#2583BA");
    }
    if (num >= 20){
        $('#dataText_'+id).attr("stroke", "rgba(255,209,0,0.72)");
        $('#dataText_'+id).attr("stroke-width", "1.2px");
    }
    if (num >= 25){
        $('#dataText_'+id).attr("stroke", "red");
        $('#dataText_'+id).attr("stroke-width", "1.8px");
    }
    if (num >= 30){
        $('#dataText_'+id).attr("fill" , "red");
        $('#dataText_'+id).attr("stroke-width", "0px");
    }
    if ( num >= 50)
        ;
}

//Colide Function
function collide(node) {
    var r = node.radius + 20,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                //0.8 表撞擊彈出力道
                l = (l - r) / l * .8;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

var toggle = 0;

function highlightNodes() {

    if (toggle == 0) {

        //Reduce the opacity of all but the neighbouring nodes
        d3.selectAll(".circle").style("opacity", 0.1);
        d3.selectAll(".g_text").style("opacity", 0.1);
        d3.selectAll(".name_text").style("opacity", 0);
        d3.select(this).style("opacity", 1);

        toggle = 1;

    } else {
        //Put them back to opacity=1
        d3.selectAll(".circle").style("opacity", 1);
        d3.selectAll(".g_text").style("opacity", 1);
        toggle = 0;

        if (change_toggle == 0 || change_toggle == 1)
            d3.selectAll(".name_text").style("opacity", 0);
        else
            d3.selectAll(".name_text").style("opacity", 1);
    }

}

function mentalFlow(){
    console.log("1yo");
    if (change_toggle != 6){
        console.log("1yo6");
        beforeState = 6;
        change_toggle == 6 ;
    }
    else{
        console.log("1y7");
        change_toggle = 7;
        beforeState == 7;
    }

}

function slideFlow() {
    console.log("change_toggle:" + change_toggle);

    $('#logo_div').css("display","none");

    $('.data_text').attr("stroke","black");
    $('.data_text').attr("fill","black");

    //隱藏 name_textx
    $('.name_text').css("opacity", 0);
    $(".name_text").fadeTo("fast", 1);

    $('.face_eye').css("display","none");
    $('.face_smile').css("display","none");
    $('.face_outEye').css("display","none");

    stopAnalysis();

    if (change_toggle == 0 ) {
        change_toggle = 2;

        beforeState = 2;
        //set "name_text"
        $('#text_1').text("文、管理、社科學院");
        $('#text_2').text("理、工、生科學院");
        $('#text_3').text("電機資訊學院");
        $('#text_4').text("規設、醫學院");
        $('#text_5').text("");
        $('#text_6').text("");
        $('#text_7').text("");
        $('#text_8').text("");
        $('#text_9').text("");
        $('#text_10').text("");
        $('#text_11').text("");
        d3.selectAll(".circle").style("fill", function(d) {
                return color(d.radius);
            }) //原本顏色

    }else if ( change_toggle == 5){
        change_toggle = 0;

        d3.selectAll(".circle").style("fill", function(d) {
                return color(d.radius);
            }) //原本顏色
    }
    else {
        change_toggle++;

        if (change_toggle == 3) {
            beforeState = 3;
            $('#text_1').text("青春  a 大一、大二");
            $('#text_2').text("認真讀書 a 大三");
            $('#text_3').text("即將高飛 a 大四");
            $('#text_4').text("超級強 a 研究生");
            $('#text_5').text("秘密神人等級");
            $('#text_6').text("");
            $('#text_7').text("");
            $('#text_8').text("");
            $('#text_9').text("");
            $('#text_10').text("");
            $('#text_11').text("");

        }
        if (change_toggle == 4) {
            beforeState = 4;
            $('#text_1').text("");
            $('#text_2').text("");
            $('#text_3').text("");
            $('#text_4').text("");
            $('#text_5').text("");
            $('#text_6').text("");
            $('#text_7').text("");
            $('#text_8').text("北部人");
            $('#text_9').text("東部人");
            $('#text_10').text("中部人");
            $('#text_11').text("南部人");

        }
        if (change_toggle == 5) {
            beforeState = 5;
            $('#text_1').text("");
            $('#text_2').text("");
            $('#text_3').text("");
            $('#text_4').text("");
            $('#text_5').text("");
            $('#text_6').text("Boys!!");
            $('#text_7').text("Girls!!");
            $('#text_8').text("");
            $('#text_9').text("");
            $('#text_10').text("");
            $('#text_11').text("");

            d3.selectAll(".circle").style("fill", function(d) {
                    return color_sex(d.setNum[3]);
                }) //依照性別去選顏色
        }
        /*
        if (change_toggle == 6) {
            beforeState = 6;
            $('#text_1').text("");
            $('#text_2').text("");
            $('#text_3').text("");
            $('#text_4').text("");
            $('#text_5').text("");
            $('#text_6').text("");
            $('#text_7').text("");
            $('#text_8').text("火象星座");
            $('#text_9').text("土象星座");
            $('#text_10').text("風象星座");
            $('#text_11').text("水象星座");

            d3.selectAll(".circle").style("fill", function(d) {
                    return color_star(d.setNum[4]);
                }) //依照星座去選顏色
        }
        */
    }
    if(change_toggle == 8){
        change_toggle = beforeState;
        drop_toggle = 0;
    }
}

function setRadius(age) {
    var r = Math.random() * 10;
    switch (age) {
        case "大一":
            while (r > 9.9 || r < 8)
                r = Math.random() * 10;
            return r;
        case "大二":
            while (r > 12.9 || r < 10)
                r = Math.random() * 10 + 3;
            return r;
        case "大三":
            while (r > 14.9 || r < 13)
                r = Math.random() * 10 + 5;
            return r;
        case "大四":
            while (r > 16.9 || r < 15)
                r = Math.random() * 10 + 7;
            return r;
        case "碩博":
            while (r > 18.9 || r < 17)
                r = Math.random() * 10 + 9;
            return r;
        default:
            return 21;
    }
}

//爆炸 => 還未用到
function explosion() {
    nodes.forEach(function(o, i) {
        o.x += (Math.random() - .5) * 80;
        o.y += (Math.random() - .5) * 100;
    });
    force.resume();
}