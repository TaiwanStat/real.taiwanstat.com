/**
Class Definition:
	Name: DataProcess;
	Type: Static class, or namespace;
*/
var DataProcessM = {

	/**
		Public Fields
	*/

	latestDate: {},
	dayLimit: 30,
	smallDayPeriod: 10,

	priceList: [],

	vagNum: -1,
	vagIdList:[],
	vagNameMap:
		{
			'FB': "花椰菜", 'FC': "胡瓜", 'FE': "冬瓜", 'FF': "絲瓜", 'FG': "苦瓜", 'FH': "扁蒲", 'FI': "茄子", 'FJ': "番茄", 'FK': "甜椒",
			'FL': "豌豆", 'FM': "菜豆", 'FN': "敏豆", 'FP': "萊豆", 'FQ': "毛豆", 'FT': "南瓜", 'FV': "辣椒", 'FW': "金針花",
			'FY': "玉米", 'FZ': "落花生", 'LA': "甘藍", 'LB': "小白菜", 'LC': "包心白", 'LD': "青江白菜", 'LF': "蕹菜",
			'LG': "芹菜", 'LH': "菠菜", 'LI': "萵苣菜", 'LJ': "芥菜", 'LK': "芥藍菜", 'LM': "莧菜", 'LN': "油菜",
			'LO': "甘薯葉", 'LP': "芫荽", 'LS': "茴香", 'LX': "蕨菜", 'MA': "洋菇", 'MB': "草菇", 'MC': "木耳",
			'MD': "香菇", 'ME': "金絲菇", 'MI': "秀珍菇", 'MJ': "杏鮑菇", 'SA': "蘿蔔", 'SB': "胡蘿蔔",
			'SC': "馬鈴薯", 'SD': "洋蔥", 'SE': "青蔥", 'SF': "韭菜", 'SG': "大蒜", 'SJ': "芋",
			'SM': "牛蒡", 'SO': "甘薯", 'SP': "薑", 'SQ': "茭白筍", 'SV': "蘆筍",
			'SW': "球莖甘藍"
		},

	/**
		Public Methods
	*/

	processData:

		// CALLBACK(int: progress_percentage)
		function(csvString, CALLBACK, CALLBACK_FINISH){

			var allLines = csvString.split(/\r\n|\n/);
			var headers = allLines[0].split(',');
			CALLBACK(25);

			DataProcessM.vagIdList = headers.slice(3, headers.length);
			DataProcessM.vagNum = DataProcessM.vagIdList.length;
			DataProcessM.priceList = DataProcessM.vagIdList.map(function(arg){
				return {
					id: arg,
					name: DataProcessM.vagNameMap[arg],
					price: [],
					avg: 0,
					smallavg: 0
				};
			});
			CALLBACK(50);

			for(var i = allLines.length - DataProcessM.dayLimit; i<allLines.length; i++){
				var prices = allLines[i].split(',');
				for(var j = 3; j < prices.length; j++){
					DataProcessM.priceList[j-3].price[i-allLines.length+DataProcessM.dayLimit] = parseInt(prices[j]);
				}
			}
			CALLBACK(75);

			for(var i = 0; i < DataProcessM.vagNum; i++){
				for(var j = 0; j < DataProcessM.smallDayPeriod; j++){
					DataProcessM.priceList[i].avg += DataProcessM.priceList[i].price[j];
				}
				DataProcessM.priceList[i].smallavg = DataProcessM.priceList[i].avg / DataProcessM.smallDayPeriod;
				for(var j = DataProcessM.smallDayPeriod; j < DataProcessM.priceList[i].price.length; j++){
					DataProcessM.priceList[i].avg += DataProcessM.priceList[i].price[j];
				}
				DataProcessM.priceList[i].avg = DataProcessM.priceList[i].avg / DataProcessM.priceList[i].price.length;
			}
			CALLBACK(100);

			//console.log(DataProcessM.priceList);
			CALLBACK_FINISH();

		},

	getIndexFromId:

		function(id){
			for(var i = 0; i < DataProcessM.vagNum; i++){
				if(DataProcessM.priceList[i].id == id){
					return i;
				}
			}
		}

}
