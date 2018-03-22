
//生成随机答卷函数，模拟实际从后台获取的答卷
var createRandomQuestionaires = function() {
	var answers = [];
	//问卷一，Q1，Q2，Q3单选，Q4多选，Q5文本,单选设置为2个选择，多选为4个选择，文本只统计是否有效
	var answer_1 = [];
	for(var i = 0; i < 5; i++) {
		if(i < 3) {
			answer_1.push(Math.ceil(2*Math.random()));
		}
		else if(i < 4) {
			var multi_choose = [];
			for(var j = 1; j <= 4; j++) {
				if(Math.floor(2*Math.random())) {
					multi_choose.push(j);
				}
			}
			answer_1.push(multi_choose);
		}
		else {
			answer_1.push(Math.floor(2*Math.random()) + "");
		}
	}

	//问卷二，Q1，Q2，Q3单选，Q4，Q5多选，Q6，Q7文本
	var answer_2 = [];
	for(var i = 0; i < 7; i++) {
		if(i < 3) {
			answer_2.push(Math.ceil(2*Math.random()));
		}
		else if(i < 5) {
			var multi_choose = [];
			for(var j = 1; j <= 4; j++) {
				if(Math.floor(2*Math.random())) {
					multi_choose.push(j);
				}
			}
			answer_2.push(multi_choose);
		}
		else {
			answer_2.push(Math.floor(2*Math.random()) + "");
		}
	}

	//问卷三，Q1，Q2，Q3，Q4，Q5单选，Q6，Q7多选，Q8，Q9文本
	var answer_3 = [];
	for(var i = 0; i < 9; i++) {
		if(i < 5) {
			answer_3.push(Math.ceil(2*Math.random()));
		}
		else if(i < 7) {
			var multi_choose = [];
			for(var j = 1; j <= 4; j++) {
				if(Math.floor(2*Math.random())) {
					multi_choose.push(j);
				}
			}
			answer_3.push(multi_choose);
		}
		else {
			answer_3.push(Math.floor(2*Math.random()) + "");
		}
	}

	answers.push(answer_1);
	answers.push(answer_2);
	answers.push(answer_3);

	return answers;
};

//添加柱状图统计模块容器
var addBarView = function(id, type) {
	var qstType = "";
	var str = "";
	if(type == "radio") {
		qstType = "单选题";
		str = "<div><div class='question'><p><span>Q" + (id + 1) + "</span>"+ qstType +"</p>\
	<ul><li>选项一</li><li>选项二</li></ul></div><div class='data-view'><p>数据占比</p>\
	<div class='bar'><div></div></div><div class='bar'><div></div></div></div></div>";
	}
	if(type == "textarea") {
		qstType = "文本题";
		str = "<div><div class='question'><p><span>Q" + (id + 1) + "</span>"+ qstType +"</p>\
	</div><div class='data-view'><p>有效回答比</p>\
	<div class='bar'><div></div></div></div></div>";
	
	}
	$(str).appendTo($("div.view"));
};

//添加饼状图统计模块容器
var addCakeView = function(id) {
	var str = "<div><div class='question'><p><span>Q" + (id + 1) + "</span>多选题</p>\
	<ul><li>选项一</li><li>选项二</li><li>选项三</li><li>选项四</li></ul></div><div class='data-view'><p>数据占比</p>\
	<canvas></canvas></div>";
	$(str).appendTo($("div.view"));
};

//统计答题率
var countProb = function(answers) {
	var questionaireNum = answers.length;
	var questionNum = answers[0].length;
	var result = [];
	for(var i = 0; i < questionNum; i++) {
		var resultTemp = {};
		for(var j = 0; j < questionaireNum; j++) {
			if(((typeof answers[j][i]).toLowerCase() == "number" || (typeof answers[j][i]).toLowerCase() == "string")) {
				if((typeof answers[j][i]).toLowerCase() == "number") {
					resultTemp.type = "radio";
				}
				else {
					resultTemp.type = "textarea";
				}


				if(!resultTemp[answers[j][i]]) {
					resultTemp[answers[j][i]] = 1;
				}
				else {
					resultTemp[answers[j][i]]++;
				}
			}
			else {
				resultTemp.type = "checkbox";
				var chooseNum = answers[j][i].length;
				for(var k = 0; k < chooseNum; k++) {
					if(!resultTemp[answers[j][i][k]]) {
						resultTemp[answers[j][i][k]] = 1;
					}
					else {
						resultTemp[answers[j][i][k]]++;
					}
				}
			}
		}
		result.push(resultTemp);
	}
	for(var k = 0; k < questionNum; k++) {
		var allAnswer = 0;
		for(var m in result[k]) {
			if(m == "type") {
				continue;
			}
			allAnswer += result[k][m];
		}
		for(var n in result[k]) {
			if(n == "type") {
				continue;
			}
			result[k][n] = result[k][n] / allAnswer;
		}
	}

	return result;
};


//依据答题率绘制概率图容器
var renderAnswerContainer = function(result) {
	var length = result.length;
	for(var i = 0; i <length; i++) {
		//console.log(result.type);
		if(result[i].type == "radio") {
			addBarView(i, "radio");
		}
		else if(result[i].type == "textarea") {
			addBarView(i, "textarea");
		}
		else {
			addCakeView(i);
		}
	}
};


//绘制扇形图函数
CanvasRenderingContext2D.prototype.sector = function(x, y, radius, sDeg, eDeg, text) {
	this.save();
	this.translate(x, y);
	this.beginPath();
	this.arc(0, 0, radius, sDeg, eDeg);
	this.save();
	this.rotate(eDeg);
	this.moveTo(radius, 0);
	this.lineTo(0, 0);
	this.restore();
	this.rotate(sDeg);
	this.fillStyle = "black";
	this.fillText(text, radius, 30);
	this.lineTo(radius, 0);
	this.closePath();
	this.restore();
	return this;
};

//四个扇形颜色
var colors = ["#8B1A1A", "#6C7B8B", "#8DB6CD", "#E9967A"];

//依据答题率绘制概率图
var renderAnswerMap = function(result) {
	var length = result.length;
	for(var i = 0; i < length; i++) {
		if(result[i].type == "radio") {
			var rate_1 = result[i][1] * 100 + "%";
			var rate_2 = result[i][2] * 100 + "%";
			$("div.view > div:eq(" + i + ") div.bar:eq(0) > div").animate({"width": rate_1}, "slow");
			$("div.view > div:eq(" + i + ") div.bar:eq(1) > div").animate({"width": rate_2}, "slow");
		}
		if(result[i].type == "textarea") {
			var rate_useful = result[i][1] * 100 + "%";
			$("div.view > div:eq(" + i + ") div.bar:eq(0) > div").animate({"width": rate_useful}, "slow");
		}
		if(result[i].type == "checkbox") {
			var canvas = $("div.view > div:eq(" + i + ") canvas")[0];
			canvas.width = 200;
			canvas.height = 200;
			var ctx = canvas.getContext("2d");
			var startDeg = 0;
			for(var j = 1; j <= 4; j++) {
				var text = "选项" + j;
				var endDeg = startDeg + result[i][j] * 360 * Math.PI/180;
				ctx.sector(100, 100, 70, startDeg, endDeg, text);
				ctx.fillStyle = colors[j - 1];
				ctx.fill();
				startDeg = endDeg;
			}			
		}
	}
};

$(function() {

	$(".back").click(function () {
		window.history.back();
	});

	//生成10套问卷答题
	var answers = [];
	for(var i = 0; i < 10; i++) {
		answers.push(createRandomQuestionaires());
	}
	//console.log(answers);
	//默认取问卷一答案
	var answersForRender = [];
	for(var j = 0; j < 10; j++) {
		answersForRender.push(answers[j][0]);
	}

	var result = countProb(answersForRender);
	//console.log(result);

	renderAnswerContainer(result);

	renderAnswerMap(result);
	$("select").change(function(e) {
		if($(this).val() == "问卷一") {
			$("div.view").html("");
			answersForRender = [];
			for(var j = 0; j < 10; j++) {
				answersForRender.push(answers[j][0]);
			}
			result = countProb(answersForRender);
			renderAnswerContainer(result);
			renderAnswerMap(result);
		}
		if($(this).val() == "问卷二") {
			$("div.view").html("");
			answersForRender = [];
			for(var j = 0; j < 10; j++) {
				answersForRender.push(answers[j][1]);
			}
			//console.log(answersForRender);
			result = countProb(answersForRender);
			//console.log(result);
			renderAnswerContainer(result);
			renderAnswerMap(result);
		}
		if($(this).val() == "问卷三") {
			$("div.view").html("");
			answersForRender = [];
			for(var j = 0; j < 10; j++) {
				answersForRender.push(answers[j][2]);
			}
			result = countProb(answersForRender);
			renderAnswerContainer(result);
			renderAnswerMap(result);
		}
	});

	// addBarView(1, "radio");
	// addBarView(2, "radio");
	// console.log($("div.view  div div.bar"));
});