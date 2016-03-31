/**
Class Definition:
	Name: VagListM
	Type: Non-static Class, Obj prototype
*/
VagListM = function(d3svg, items){

	/**
		Public Field Initialization
	*/

	this.svgObj = d3svg;
	this.svgWidth = parseInt(d3svg.style("width"));

	this.secondBarOption = "";
	this.sortOptionBool = true;
	this.sortOption = "";
	this.itemMargin = 5;
	this.itemBeginX = 10;
	this.itemBeginY = 0;
	this.itemWidth = this.svgWidth - this.itemBeginX*2;
	this.itemHeight = this.itemWidth / 6;
	if(this.itemHeight > 80) this.itemHeight=80;
	this.itemBarsRatio = 0.77;
	this.itemPadding = 1;
	this.itemPadding2 = (this.itemWidth - this.itemPadding * 2) * this.itemBarsRatio;

	this.svgHeight = (this.itemHeight + this.itemMargin) * items.length;
	d3svg.style("height", "" + this.svgHeight + "px");

	this.itemData = items;
	this.itemList = items.map(function(a){
		round = function(a){ return Math.round(a*10) / 10; };
		return {
			id: a.id,
			name: a.name,

			price: a.price[a.price.length-1],
			yesterday: a.price[a.price.length-1] - a.price[a.price.length-2],
			smallavg: round(a.price[a.price.length-1] - a.smallavg),
			avg: round(a.price[a.price.length-1] - a.avg),

			d3group: d3svg.append("g")
		};
	});


	/**
		Public Method
	*/

	this.show = function(secondBarOption){

		this.secondBarOption = secondBarOption;
		this.svgObj.selectAll("g > *").remove();

		for(var i = 0; i < this.itemList.length; i++){
			this.drawItem(i);
		}

		this.arrange();
	};

	this.drawItem = function(i){

		var d = this.itemList[i].d3group;
		d.attr("id", this.itemList[i].id);

		d.append("rect")
			.attr("x",this.itemBeginX)
			.attr("y",this.itemBeginY)
			.attr("width",this.itemWidth)
			.attr("height",this.itemHeight)
			.style("fill","#e4e4e4");

		var ppercentage = this.itemList[i].price / 200;
		ppercentage = ppercentage > 1 ? 1 : ppercentage;
		var pbarLength = ppercentage * (this.itemWidth - this.itemPadding * 2) * this.itemBarsRatio;
		d.append("rect")
			.attr("x",this.itemBeginX + this.itemPadding)
			.attr("y",this.itemBeginY + this.itemPadding)
			.attr("width",pbarLength)
			.attr("height",this.itemHeight - this.itemPadding*2)
			.style("fill","#99ff99");

		var increase = this.itemList[i][this.secondBarOption] / 30;
		increase = increase > 1 ? 1 : increase;
		var increaseBarLength = increase * (this.itemWidth - this.itemPadding * 2) * (1-this.itemBarsRatio);
		if(increaseBarLength > 0){
			d.append("rect")
				.attr("class", "secondbar")
				.attr("x",this.itemBeginX + this.itemPadding + this.itemPadding2)
				.attr("y",this.itemBeginY + this.itemPadding)
				.attr("width",increaseBarLength)
				.attr("height",this.itemHeight - this.itemPadding*2)
				.style("fill","#ff6666");
		} else {
			d.append("rect")
				.attr("x",this.itemBeginX + this.itemPadding + this.itemPadding2)
				.attr("y",this.itemBeginY + this.itemPadding)
				.attr("width",-increaseBarLength)
				.attr("height",this.itemHeight - this.itemPadding*2)
				.style("fill","#99ccff");
		}

		d.append("text")
			.attr("x",this.itemBeginX + 5)
			.attr("y",this.itemHeight*0.6)
			.text(this.itemList[i].name + ": " + this.itemList[i].price + " NTD")
			.style("fill","#333333")
			.style("font-size", this.itemHeight*0.5);

		var increaseText = this.itemList[i][this.secondBarOption];
		if(increaseText >=0) increaseText = "+" + increaseText;
		d.append("text")
			.attr("class", "secondtext")
			.attr("x",this.itemBeginX + this.itemPadding + this.itemPadding2 + 2)
			.attr("y",this.itemHeight*0.6)
			.text(increaseText)
			.style("fill","#333333")
			.style("font-size", this.itemHeight*0.5);
	};

	this.sortByOptionAndAnimate = function(reverse, sortOption){
		
		this.sortOption = sortOption;
		this.sortOptionBool = reverse;

		this.itemList.sort(function(a, b){
			return a[sortOption] - b[sortOption];
		});
		
		if(reverse){
			this.itemList.reverse();
		}

		this.arrange();
	};

	this.sortByDefaultAndAnimate = function(){
		this.sortByOptionAndAnimate(this.sortOptionBool, this.sortOption);
	};

	this.sort = function(reverse, sortOption){
		
		this.sortOption = sortOption;
		this.sortOptionBool = reverse;

		this.itemList.sort(function(a, b){
			return a[sortOption] - b[sortOption];
		});
		
		if(reverse){
			this.itemList.reverse();
		}

	};

	this.removeItem = function(id){
		for(var i = 0; i < this.itemList.length; i++){
			if(this.itemList[i].id == id){
				this.itemList.splice(i, 1);
				break;
			}
		}
		this.svgObj.selectAll("#" + id).remove();
		this.arrange();
	};

	this.addItem = function(index){
		round = function(a){ return Math.round(a*10) / 10; };
		var a = this.itemData[index];
		var obj = {
			id: a.id,
			name: a.name,

			price: a.price[a.price.length-1],
			yesterday: a.price[a.price.length-1] - a.price[a.price.length-2],
			smallavg: round(a.price[a.price.length-1] - a.smallavg),
			avg: round(a.price[a.price.length-1] - a.avg),

			d3group: d3svg.append("g")
		}
		this.itemList.push(obj);
		this.drawItem(this.itemList.length-1);
		this.sortByDefaultAndAnimate();
	};

	this.idInList = function(id){
		for(var i = 0; i < this.itemList.length; i++){
			if(this.itemList[i].id == id){
				return true;
			}
		}
		return false;
	};

	/**
		Private Method
	*/
	
	this.arrange = function(){
		for(i = 0; i < this.itemList.length; i++){
			var y = this.itemBeginY + i * (this.itemHeight + this.itemMargin);
			this.itemList[i].d3group
				.transition()
				.attrTween("transform", tween(y))
				.duration(600);
		}
	};

	tween = function(y){
		return function(d, i, a){
			return d3.interpolateString(a, "translate(0, " + y + ")", "translate()");
		};
	};

}