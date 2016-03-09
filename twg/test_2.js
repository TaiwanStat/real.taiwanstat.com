/*---------//

 //----------*/

//Firebase 資料庫
//var myDataRef = new Firebase('https://o47un23yblt.firebaseio-demo.com/');
var myDataRef = new Firebase('https://flickering-heat-4075.firebaseio.com');
var nodeList = myDataRef.child('nodes');
var nameList = myDataRef.child('nameRecord');

//半徑
var r = 0 , radius = 0;

$('#messageInput').keypress(function(e) {
    if (e.keyCode == 13) {
        submit();
    };

    //可以輸入空白鍵
    if ( e.keyCode == 32 ) {
    	stop_toggle = 1;
    }

});

$('#submit').click(function(e){

    //把原本html動作擋掉
    //e.preventDefault();

    console.log("click");
    submit();
});
function submit() {

    var name = $('#nameInput').val();
    var sex = $('#sexualInput').val();
    var school = $('#schoolInput').val();
    var department = $('#departmentInput').val();
    var area = $('#whereInput').val();
    var message = $('#messageInput').val();
    var age = $('#ageInput').val();
    var mental_1 = $('input[name="mentalInput_1"]:checked').val();
    var mental_2 = $('input[name="mentalInput_2"]:checked').val();
    var setNum = setChangeNum(school, age, area, sex , mental_1 , mental_2); //輸入陣列變數

    console.log(mental_1 +"111" + mental_2);
    //後端資料庫
    nodeList.push({
        'name': name,
        'sex': sex,
        'school': school,
        'department': department,
        'area': area,
        'age': age,
        'message': message,
        'setNum': setNum,
        'vy':0.3
    });

    nameList.push({
        'name': name
    });

    //重新整理
    window.location.reload();
}


function setChangeNum( school , age , area, sex , mental_1 , mental_2)
{
	switch ( school )
	{
		case "文學院" :
		case "管理學院" :
		case "社會科學院" :
			school = 1 ; break ;
		case "理學院" :
		case "工學院" :
		case "生物科學與科技學院" :
			school = 2 ; break ;
		case "電機資訊學院" :
			school = 3 ; break ;
		case "規劃與設計學院" :
		case "醫學院" :
			school = 4 ; break ;
		default:
			school = 0; break ;
	}
	switch(area)
	{
		case "北部":
			area = 1 ; break;
		case "東部":
			area = 2 ; break;
		case "中部":
			area = 3 ; break;
		case "南部":
			area = 4 ; break;
		default:
			area = 0 ;
	}
    switch(age)
    {
        case "大一":
        case "大二":
            age = 1 ; break;
        case "大三":
            age = 2 ; break;
        case "大四":
            age = 3 ; break;
        case "碩博":
            age = 4 ; break;
        default:
            age = 0 ; break;
    }
    switch(sex)
    {
        case "man":
            sex = 1 ; break;
        case "woman":
            sex = 2 ; break;
        default:
            sex = 0 ;
    }
    switch(mental_1)
    {
        case "A":
            mental_1 = 1 ; break;
        case "B":
            mental_1 = 2 ; break;
        case "C":
            mental_1 = 3 ; break;
        case "D":
            mental_1 = 4 ; break;
        default:
            mental_1 = 0 ; break;
    }
    switch(mental_2)
    {
        case "A":
            mental_2 = 1 ; break;
        case "B":
            mental_2 = 2 ; break;
        case "C":
            mental_2 = 3 ; break;
        case "D":
            mental_2 = 4 ; break;
        case "E":
            mental_2 = 0 ; break;
        default:
            mental_2 = '';
            break;
    }

	var setNum = [school , age , area , sex , mental_1 , mental_2] ;

	return setNum;
}


