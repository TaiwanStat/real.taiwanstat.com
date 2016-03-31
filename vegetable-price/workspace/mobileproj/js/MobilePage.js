MobilePage = {

	list: {},

	appendCvItem:

		function(){
			for(var i = 0; i < DataProcessM.vagNum; i++){
				var name = DataProcessM.vagNameMap[DataProcessM.vagIdList[i]];
				var id = DataProcessM.vagIdList[i];
				$("#chooseVagetable").append("<div class='cvItem cvItemVag' data-vagid='" + id + "'>" + name + "</div>");
			}
			$(".cvItemVag").click(MobilePage.cvItemVagEvent);
		},

	menuItemEvent:

		function(){

			if($(this).data("index") == "0"){

				if(list.sortOption == "price"){
					$(this).html("改為以價格排序");
					list.sortByOptionAndAnimate(list.sortOptionBool, increaseTag);
				}else{
					$(this).html("改為以漲幅排序");
					list.sortByOptionAndAnimate(list.sortOptionBool, "price");
				}

			} else if($(this).data("index") == "1"){

				list.sortOptionBool = !list.sortOptionBool;
				list.sortByDefaultAndAnimate();

			} else if($(this).data("index") == "2"){

				if(isInSettingMode == true){
					$(".slider").css("left", "0%");
					isInSettingMode = false;
				} else {
					$(".slider").css("left", "-100%");
					isInSettingMode = true;
				}

			}
		},

	sitItemEvent:

		function(){
			increaseTag = $(this).data("mode");
			list.show(increaseTag);
			if(list.sortOption == "price"){
				list.sortByDefaultAndAnimate();
			}else{
				list.sortByOptionAndAnimate(list.sortOptionBool, increaseTag);
			}
		},

	vagDeselectAllEvent:

		function(){

			$(".cvItemVag").css("color", "#bbbbbb");
			for(var i = 0; i < DataProcessM.vagNum; i++){
				list.removeItem(DataProcessM.vagIdList[i]);
			}
		},

	vagSelectAllEvent: 

		function(){
			MobilePage.vagDeselectAllEvent();
			$(".cvItemVag").css("color", "#000000");
			for(var i = 0; i < DataProcessM.vagNum; i++){
				list.addItem(i);
			}
		},

	cvItemVagEvent:

		function(){
			if( list.idInList($(this).data("vagid")) ){
				$(this).css("color", "#bbbbbb");
				list.removeItem($(this).data("vagid"));
			} else {
				$(this).css("color", "#000000");
				list.addItem(DataProcessM.getIndexFromId($(this).data("vagid")));
			}
		}

}