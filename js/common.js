var addListener = function(ele, event, fn) {
	if(ele.addEventListener) {
		ele.addEventListener(event, fn);
	}
	else if(ele.attachEvent) {
		ele.attachEvent("on" + event) = fn;
	}
	else{
		ele["on" + event] = fn;
	}
};


var setCookie = function(c_name,value,expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString());
};

var getCookie = function(c_name) {
	if (document.cookie.length>0) {
	 	c_start = document.cookie.indexOf(c_name + "=")
	  	if (c_start!=-1) {
	    	c_start = c_start + c_name.length+1 
	    	c_end = document.cookie.indexOf(";",c_start)
	    	if (c_end == -1){
	    		c_end = document.cookie.length;
	    	}
	    	return unescape(document.cookie.substring(c_start,c_end)); 	
	    } 
	  }
	return "";
};

var dateFormat = function(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return "" + year + "-" + month + "-" + day;
};


var getCss = function(b,a) {
	return b.currentStyle?b.currentStyle[a]:document.defaultView.getComputedStyle(b,false)[a];
};


var Questionnaire = function(option) {
	this.name = option.name;
	this.deadline = option.deadline;
	this.state = option.state;
	this.questions = option.questions;
};


var QstFactory = function(type) {
	this.type = type;
	this.question = null;
	this.choices = null;
	this.value = "";
	this.require = true;
};
