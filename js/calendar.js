var CalendarTool = function(container, date) {
	this.container = container;
	this.date = date;
	this.head = null;
	this.body = null;
	this.preMonthBtn = null;
	this.nextMonthBtn = null;
	this.init();
};

CalendarTool.prototype = {
	weekDay: ['日','一','二','三','四','五','六'],
	getYear: function() {
		return this.date.getFullYear();
	},
	getMonth: function() {
		return (this.date.getMonth() + 1);
	},
	getDay: function() {
		return this.date.getDate();
	},
	getWeekDay: function() {
		return this.weekDay[this.date.getDay()];
	},
	isRunNian: function(year) {
		if(year % 100 == 0) {
			return (year % 400 == 0);
		}
		return (year % 4 == 0);
	},
	setHead: function() {
		var head = document.createElement('div');
		head.className = 'calendar-head';
		var monthDec = document.createElement('div');
		monthDec.className = 'month-decrease';
		this.preMonthBtn = monthDec;
		var monthInc = document.createElement('div');
		monthInc.className = 'month-increase';
		this.nextMonthBtn = monthInc;
		var yearAndMonth = document.createElement('div');
		yearAndMonth.className = 'year-month';
		var year = document.createElement('span');
		var month = document.createElement('span');
		this.year = year;
		this.month = month;
		year.innerHTML = this.getYear() + '年';
		month.innerHTML = (this.getMonth() < 10 ? '0'+ this.getMonth() : this.getMonth()) + '月';
		yearAndMonth.appendChild(year);
		yearAndMonth.appendChild(month);
		head.appendChild(monthDec);
		head.appendChild(yearAndMonth);
		head.appendChild(monthInc);

		this.head = head;
	},

	setBody: function() {
		var tableDiv = document.createElement('div');
		tableDiv.className = 'calendar-body';
		var table = document.createElement('table');
		var tableStr = '<tr><td class="weekDay">日</td><td class="weekDay">一</td><td class="weekDay">二</td><td class="weekDay">三</td><td class="weekDay">四</td><td class="weekDay">五</td><td class="weekDay">六</td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>\
						<tr><td class="weekend"></td><td></td><td></td><td></td><td></td><td></td><td class="weekend"></td></tr>';
		table.innerHTML = tableStr;
		var day = this.getDay();
		var day_temp = this.date;
		day_temp.setDate(1);
		var firstDay = day_temp;
		var firstDay_number = 1;
		var month = this.getMonth();
		var year = this.getYear();
		var isRunNian = this.isRunNian(year);
		var column = firstDay.getDay();
		//console.log(column);
		var temp = [[], [], [], [], [], []];

		var getMaxDay = function(month) {
			if([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
				return 31;
			}
			else if(month == 2) {
				if(isRunNian) {
					return 29;
				}
				return 28;
			}
			else {
				return 30;
			}
		}

		var fillFirstRow = function(array, column) {
			var _maxDay = getMaxDay(month - 1);	
			while(column > 0) {
				array[--column] = _maxDay--;
			}
		}
		
		//第一个数组填充本月日期
		while(column < 7) {
			temp[0][column] = firstDay_number;
			column++;
			firstDay_number++;
		}

		var maxDay = getMaxDay(month);

		//各个数组依次填充本月日期
		for(var i = 1; i < temp.length; i++) {
			var temp_max = temp[i - 1][6];
			if(temp_max >= maxDay) {
				temp_max = 0;
			}
			var j = 0;
			while(j < 7) {
				temp[i][j++] = ++temp_max;
				if(temp_max >= maxDay) {
					temp_max = 0;
				}
			}
		}

		fillFirstRow(temp[0], firstDay.getDay());

		//将数组中存的日期填入表格
		for(var m = 1; m < 7; m++) {
			for(var n = 0; n < 7; n++) {
				table.rows[m].cells[n].innerHTML = temp[m-1][n];
			}
		}


		tableDiv.appendChild(table);

		//非本月日期添加class，置灰
		for(var d = 0; d < 7; d++) {
			if(table.rows[1].cells[d].innerHTML > 7) {
				var c = table.rows[1].cells[d].className;
				c = c ? c + ' invalid-day' : 'invalid-day';
				table.rows[1].cells[d].className = c;
			}

			if(table.rows[5].cells[d].innerHTML < 15) {
				var c = table.rows[5].cells[d].className;
				c = c ? c + ' invalid-day' : 'invalid-day';
				table.rows[5].cells[d].className = c;
			}

			if(table.rows[6].cells[d].innerHTML < 15) {
				var c = table.rows[6].cells[d].className;
				c = c ? c + ' invalid-day' : 'invalid-day';
				table.rows[6].cells[d].className = c;
			}
		}

		//console.log(table.rows[1].cells[1].innerHTML);
		this.body = tableDiv;
	},


	addLis: function() {
		addListener(this.preMonthBtn, 'click', function() {
			var day = this.date;
			if(day.getMonth() == 0) {
				day = day.setYear(day.getFullYear() - 1);
				day = new Date(day);
				day.setMonth(11);
			}
			else{
				day = day.setMonth(day.getMonth() - 1);
				day = new Date(day);
			}
			this.date = day;
			this.year.innerHTML = day.getFullYear() + "年";
			var m = day.getMonth() + 1
			this.month.innerHTML = (m >= 10 ? m : ("0" + m)) + "月";
			this.container.removeChild(this.container.lastElementChild);
			this.setBody();
			this.container.appendChild(this.body);

			addListener(this.body, 'click', function(e) {
				var target = e.target || e.srcElement;
				if(target.nodeName.toLowerCase() != "td" || target.className.indexOf("invalid-day") > -1 || target.className.indexOf("weekDay") > -1) {
					return false;
				}
				var ipt = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#date");
				ipt.value = this.year.innerHTML.slice(0, 4) + '-' + this.month.innerHTML.slice(0, 2) + '-' + (target.innerHTML < 10 ? '0' + target.innerHTML : target.innerHTML);
			}.bind(this));
			
			// addListener(this, 'blur', function() {
			// 	console.log(11);
			// 	this.style.display = "none";
			// }.bind(this));
		}.bind(this));

		addListener(this.nextMonthBtn, 'click', function() {
			var day = this.date;
			if(day.getMonth() == 11) {
				day = day.setYear(day.getFullYear() + 1);
				day = new Date(day);
				day.setMonth(0);
			}
			else{
				day = day.setMonth(day.getMonth() + 1);
				day = new Date(day);
			}
			this.date = day;
			this.year.innerHTML = day.getFullYear() + "年";
			var m = day.getMonth() + 1
			this.month.innerHTML = (m >= 10 ? m : ("0" + m)) + "月";
			this.container.removeChild(this.container.lastElementChild);
			this.setBody();
			this.container.appendChild(this.body);

			addListener(this.body, 'click', function(e) {
				var target = e.target || e.srcElement;
				if(target.nodeName.toLowerCase() != "td" || target.className.indexOf("invalid-day") > -1 || target.className.indexOf("weekDay") > -1) {
					return false;
				}
				var ipt = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#date");
				ipt.value = this.year.innerHTML.slice(0, 4) + '-' + this.month.innerHTML.slice(0, 2) + '-' + (target.innerHTML < 10 ? '0' + target.innerHTML : target.innerHTML);
			}.bind(this));
		}.bind(this));

		addListener(this.body, 'click', function(e) {
			var target = e.target || e.srcElement;
			if(target.nodeName.toLowerCase() != "td" || target.className.indexOf("invalid-day") > -1 || target.className.indexOf("weekDay") > -1) {
				return false;
			}
			var ipt = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("#date");
			ipt.value = this.year.innerHTML.slice(0, 4) + '-' + this.month.innerHTML.slice(0, 2) + '-' + (target.innerHTML < 10 ? '0' + target.innerHTML : target.innerHTML);
		}.bind(this));

		// addListener(this, 'blur', function() {
		// 	console.log(11);
		// 	this.style.display = "none";
		// }.bind(this));
	},


	init: function() {
		this.setHead();
		this.setBody();
		this.container.appendChild(this.head);
		this.container.appendChild(this.body);
		this.addLis();
	}
}

var container = document.getElementById("calendar");
new CalendarTool(container, new Date());