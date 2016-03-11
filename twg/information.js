//Firebase 資料庫
//公用的 var myDataRef = new Firebase('https://o47un23yblt.firebaseio-demo.com/');
var myDataRef = new Firebase('https://flickering-heat-4075.firebaseio.com');
var nodeList = myDataRef.child('nodes');
var nameList = myDataRef.child('nameRecord');

nodeList.on('child_added' , function(snapshot){
	//擷取資料 => myDateRef
    var person = snapshot.val();

    displayMessage(person.name , person.sex , person.age , person.school , person.department , person.area , person.star , person.message)
});



