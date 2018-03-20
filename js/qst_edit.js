

(function() {
	//浮层
	var mask = document.getElementById("mask");

	//添加答卷问题按钮
	var addQstBtn = document.querySelector("#add-btn div");

	//问题编辑框
	var questionInitDiv = document.getElementById("question-init");
	//问题编辑框关闭按钮
	var closeBtn = document.getElementById("close-btn");
	//选择模板
	var choiceTem = "<input type='text' class='question-choice' placeholder='请输入选择'><span class='delete'>×</span><span class='add'>+</span>";
	//问题保存按钮
	var questionSaveBtn = document.getElementById("question-save");
	//问题类型
	var questionType = "";
	//问题容器
	var questionContainer = document.getElementById("question-container");

	//问题数组，存入所有问题
	var questionArr = [];

	//问卷标题输入框
	var questionaireTitleInput = document.getElementById("questionaire-title");

	//问题类型选择框
	var questionTypeDiv = document.getElementById("question-type");

	//问卷保存，发布事件代理容器
	var createQuestionaireDiv = document.getElementById("create-questionaire");

	//保存问卷按钮
	var saveQuestionaireBtn = document.getElementById("save-questionaire");

	//发布问卷按钮
	var publishQuestionaireBtn = document.getElementById("publish-questionaire");

	//保存所有问卷
	var questionaires;

	//按创建顺序保存问卷名称，保证渲染问卷顺序
	var questionairesName;

	//questionaires， questionairesName赋值
	if(getCookie("questionaires") == "") {
		questionaires = {};
		questionairesName = [];
		setCookie("questionaires", JSON.stringify(questionaires), 999);
		setCookie("questionairesName", JSON.stringify(questionairesName), 999);
	}
	else {
		questionaires = JSON.parse(getCookie("questionaires"));
		questionairesName = JSON.parse(getCookie("questionairesName"));
	}

	//日期输入框
	var dateIpt = document.getElementById("date");
	dateIpt.value = dateFormat(new Date());
	addListener(dateIpt, "focus", function() {
		//console.log(container);
		container.style.display = "block";
	});

	// addListener(dateIpt, "blur", function() {
	// 	console.log(dateIpt.value);
	// });
	


	//展示浮层和问题编辑框
	var show = function() {
		mask.style.display = "block";
		mask.style.height = (window.innerHeight||document.body.clientHeight||document.documentElement.clientHeight) + 'px';
		//console.log(mask.style.height);
		questionInitDiv.style.display = "block";
	};

	//关闭浮层和问题编辑框
	var hide = function() {
		mask.style.display = "none";
		questionInitDiv.style.display = "none";
	};

	//往后添加元素
	var insertAfter = function(newElement, targetElement){
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			parent.appendChild(newElement);
		}
		else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}

	//保存并添加问题
	var saveQuestion = function(question) {
		var div = document.createElement("div");
		var choicesStr = "";
		if(question.type.indexOf("radio") > -1 || question.type.indexOf("checkbox") > -1) {
			for(var i = 0; i < question.choices.length; i++) {
				choicesStr += "<input type='" + question.type +"' name='" + question.question +"' class='choice' value='" + question.choices[i] +  "'>" + question.choices[i] + "<br>";
			}
		}
		else if(question.type.indexOf("textarea") > -1) {
				choicesStr += "<textarea></textarea><label class='require-box'><input type='checkbox'>此题是否必填</label>";
		}
		else {
			alert("问题类型错误!");
			return false;
		}
		var questionStr = "<div><p><span class='question-id'>Q" + question.id + "</span>" + question.question +"</p></div>" + choicesStr + 
						  "<div class='operation'><span id='up'>上移</span><span id='down'>下移</span><span id='copy'>复用</span><span id='delete'>删除</span></div>";
		
		div.innerHTML = questionStr;
		div.className = "question-div";

		return div;
	};

	//更新问题序号
	var updateSeq = function(arr) {
		for(var i = 0; i < arr.length; i++) {
			arr[i].id = i+1;
		}
	};

	//克隆问题
	var cloneQuestion = function(question) {
		var newQuestion = new QstFactory(question.type);
		var length = questionArr.length;
		var count = 0;
		for(var i in question) {
			newQuestion[i] = question[i];
		}
		for (var j = length - 1; j >= 0; j--) {
			if(questionArr[j]["question"].split("-")[0] == newQuestion["question"].split("-")[0]) {
				count++;
			}
		}
		newQuestion["question"] = newQuestion["question"].split("-")[0] + "-" + count;
		return newQuestion;
	};


	//给所有问题赋值
	var questionAnswerInit = function(questionArr) {
		var questionDivs = document.getElementsByClassName("question-div");
		var length = questionDivs.length;
		for(var i = 0; i < length; i++) {
			if(questionArr[i].type == "radio" || questionArr[i].type == "checkbox") {
				var choices = questionDivs[i].querySelectorAll("input");
				//console.log(choices);
				var choicesCount = choices.length;
				for(var j = 0; j < choicesCount; j++) {
					//console.log(choices[j].checked);
					if(choices[j].checked) {
						questionArr[i].value = choices[j].value;
					}
				}
			}
			else if(questionArr[i].type == "textarea") {
				questionArr[i].value = questionDivs[i].querySelector("textarea").value;
			}
			else {
				alert("问题类型错误!");
				return false;
			}
		}
	};


	//判断截止日期是否早于当前日期
	var dateIsValid = function(deadline) {
		var yearMonthDay = deadline.split("-");
		var year = parseInt(yearMonthDay[0]);
		var month = parseInt(yearMonthDay[1]);
		var day = parseInt(yearMonthDay[2]);
		var date = new Date(year, (month - 1), day);
		var now = new Date();
		if(date < now) {
			alert("截止日期不能早于当前日期!");
			return false;
		}
		return date;
	};

	//初始化问卷页面
	var render = function(questionaires) {
		var url = window.location.href;
		if(url.indexOf("?") > -1) {
			var param = url.split("?")[1];
			var name = param.split("=")[1];
			var arr = questionaires[name].questions;
			questionArr = arr;
			var count = arr.length;
			questionaireTitleInput.value = name;
			for(var i = 0; i < count; i++) {
				questionContainer.appendChild(saveQuestion(arr[i]));
			}
		}
	};

	render(questionaires);


	addListener(document.documentElement, "click", function(e) {
		var target = e.target || e.srcElement;
		//console.log(target.parentElement);
		// if(target == dateIpt || target == container || target.parentElement == container || target.parentElement.parentElement == container || target.parentElement.parentElement.parentElement == container || target.parentElement.parentElement.parentElement.parentElement == container || target.parentElement.parentElement.parentElement.parentElement.parentElement == container) {
		// 	return false;
		// }

		if(target == dateIpt) {
			return false;
		}

		if(target == container) {
			return false;
		}

		if(target.parentElement && target.parentElement == container) {
			return false;
		}

		if(target.parentElement && target.parentElement.parentElement && target.parentElement.parentElement == container) {
			return false;
		}

		if(target.parentElement && target.parentElement.parentElement && target.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement == container) {
			return false;
		}

		if(target.parentElement && target.parentElement.parentElement && target.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement.parentElement == container) {
			return false;
		}

		if(target.parentElement && target.parentElement.parentElement && target.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement.parentElement.parentElement && target.parentElement.parentElement.parentElement.parentElement.parentElement == container) {
			return false;
		}
		container.style.display = "none";
	});

	addListener(addQstBtn, "click", function() {
		if(questionTypeDiv.style.display == "flex") {
			questionTypeDiv.style.display = "none";
		}
		else {
			questionTypeDiv.style.display = "flex";
		}
	});

	addListener(questionTypeDiv, "click", function(e) {
		var target = e.target || e.srcElement;
		if(target.className == "question") {
			show();
			var choices;
			if(target.id.indexOf("textarea") > -1) {
				choices = questionInitDiv.getElementsByClassName("question-choice");
				for(var i = 0; i < choices.length; i++) {
					choices[i].parentNode.style.display = "none";
				}
				questionType = "textarea";
			}
			else if(target.id.indexOf("radio") > -1) {
				choices = questionInitDiv.getElementsByClassName("question-choice");
				choices[0].parentNode.style.display = "block";
				choices[1].parentNode.style.display = "block";
				while(choices.length > 2) {
					questionInitDiv.removeChild(choices[choices.length - 1].parentNode);
				}
				questionType = "radio";
			}
			else if(target.id.indexOf("checkbox") > -1) {
				choices = questionInitDiv.getElementsByClassName("question-choice");
				choices[0].parentNode.style.display = "block";
				choices[1].parentNode.style.display = "block";
				while(choices.length > 2) {
					questionInitDiv.removeChild(choices[choices.length - 1].parentNode);
				}
				questionType = "checkbox";
			}
			else {
				return false;
			}
		}
	});

	addListener(mask, "click", function() {
		hide();
	});

	addListener(closeBtn, "click", function() {
		hide();
	});

	addListener(questionInitDiv, "click", function(e) {
		var target = e.target || e.srcElement;
		if(target.className == "delete") {
			var choices = questionInitDiv.getElementsByClassName("question-choice");
			if(choices.length < 3) {
				alert("您最少需要添加两个选项!");
				return false;
			}
			questionInitDiv.removeChild(target.parentNode);
		}
		else if(target.className == "add") {
			choices = questionInitDiv.getElementsByClassName("question-choice");
			if(choices.length > 3) {
				alert("您最多只能添加四个选择！");
				return false;
			}
			var choice = document.createElement("label");
			choice.innerHTML = choiceTem;
			questionInitDiv.insertBefore(choice, questionSaveBtn);
		}
	});

	addListener(questionSaveBtn, "click", function() {
		var questionName = document.getElementById("question-title").value;
		if(questionName == "" || questionName == null) {
			alert("请输入问题!");
			return false;
		}
		if(questionType == "radio" || questionType == "checkbox") {
			var choices = questionInitDiv.getElementsByClassName("question-choice");
			var choicesValue = [];
			for(var i = 0; i < choices.length; i++) {
				choicesValue.push(choices[i].value);
			}
			for(var j = 0; j < choicesValue.length; j++) {
				if(choicesValue[j] == "" || choicesValue[j] == null) {
					alert("选择不能为空!");
					return false;
				}
			}
		}
		var question = new QstFactory(questionType);
		if(question.type == "textarea") {
			question.require = false;
		}
		question.question = questionName;
		question.choices = choicesValue;
		questionArr.push(question);
		question.id = questionArr.length;
		questionContainer.appendChild(saveQuestion(question));
		hide();
	});


	addListener(questionContainer, "click", function(e) {
		var target = e.target || e.srcElement;
		var questionDiv;
		var id;
		if(target.id == "up") {
			questionDiv = target.parentElement.parentElement;
			id = questionDiv.querySelector("span.question-id").innerHTML.slice(1);
			if(questionDiv.previousSibling) {
				questionDiv.querySelector("span.question-id").innerHTML = "Q" + (id - 1);
				questionDiv.previousSibling.querySelector("span.question-id").innerHTML = "Q" + id;
				questionContainer.insertBefore(questionDiv, questionDiv.previousSibling);
				
				var targetQuestion = questionArr.splice(id-1, 1);
				questionArr.splice(id-2, 0, targetQuestion[0]); 
				updateSeq(questionArr);
			}
			else {
				return false;
			}
		}
		else if(target.id == "down") {
			questionDiv = target.parentElement.parentElement;
			id = questionDiv.querySelector("span.question-id").innerHTML.slice(1);
			if(questionDiv.nextSibling) {
				questionDiv.querySelector("span.question-id").innerHTML = "Q" + (parseInt(id) + 1);
				questionDiv.nextSibling.querySelector("span.question-id").innerHTML = "Q" + id;
				insertAfter(questionDiv, questionDiv.nextSibling);
				
				var targetQuestion = questionArr.splice(id-1, 1);
				questionArr.splice(id+1, 0, targetQuestion[0]); 
				updateSeq(questionArr);
			}
			else {
				return false;
			}
		}
		else if(target.id == "copy") {
			questionDiv = target.parentElement.parentElement;
			id = questionDiv.querySelector("span.question-id").innerHTML.slice(1);
			var newQuestion = cloneQuestion(questionArr[id - 1]);
			questionArr.splice(id, 0, newQuestion);
			var newQuestionDiv = saveQuestion(newQuestion);
			newQuestionDiv.querySelector("span.question-id").innerHTML = "Q" + (parseInt(id) + 1);
			insertAfter(newQuestionDiv, questionDiv);
			updateSeq(questionArr);
			//console.log(questionArr);

			while(newQuestionDiv.nextSibling) {
				id = parseInt(id) + 2;
				newQuestionDiv.nextSibling.querySelector("span.question-id").innerHTML = "Q" + id;
				newQuestionDiv = newQuestionDiv.nextSibling;
				id++;
			}
		}
		else if(target.id == "delete") {
			questionDiv = target.parentElement.parentElement;
			id = questionDiv.querySelector("span.question-id").innerHTML.slice(1);

			questionArr.splice(id-1, 1);
			updateSeq(questionArr);
			//console.log(questionArr);

			var questionDivIter = questionDiv;
			while(questionDivIter.nextSibling) {
				questionDivIter.nextSibling.querySelector("span.question-id").innerHTML = "Q" + id;
				questionDivIter = questionDivIter.nextSibling;
				id++;
			}
			questionDiv.parentNode.removeChild(questionDiv);
		}	
		else {
			return false;
		}
	});

	

	addListener(createQuestionaireDiv, "click", function(e) {
		var target = e.target || e.srcElement;
		if(target.id == "save-questionaire" || target.id == "publish-questionaire") {
			var questionaireTitle = questionaireTitleInput.value;
			if(questionaireTitle == "") {
				alert("请输入问卷标题!");
				return false;
			}

			if(questionArr.length < 1) {
				alert("请添加问题!");
				return false;
			}

			var textareaRequireBox = document.getElementsByClassName("require-box");
			var length = textareaRequireBox.length;
			for(var i = 0; i < length; i++) {
				if(textareaRequireBox[i].querySelector("input").checked) {
					var id = textareaRequireBox[i].parentElement.querySelector("span.question-id").innerHTML.slice(1);
					questionArr[id - 1].require = true;
				}
			}
			questionAnswerInit(questionArr);
			//console.log(questionArr);
			var questionNumber = questionArr.length;
			for(var j = 0; j < questionNumber; j++) {
				if(questionArr[j].require && questionArr[j].value == "") {
					alert("第" + (j+1) + "个问题是必答问题，您尚未填写!");
					return false;
				}
			}

			var deadline = dateIsValid(dateIpt.value);

			if(!deadline) {
				return false;
			}

			if(target.id == "save-questionaire") {
				if(questionaires[questionaireTitle]) {
					questionaires[questionaireTitle].name = questionaireTitle;
					questionaires[questionaireTitle].deadline = deadline;
					questionaires[questionaireTitle].questions = questionArr;
				}
				else{
					var questionaire = new Questionnaire({
						name: questionaireTitle,
						deadline: deadline,
						state: "未发布",
						questions: questionArr
					});
					questionaires[questionaireTitle] = questionaire;
					questionairesName.push(questionaireTitle);
					//console.log(questionairesName);
				}
			}
			if(target.id == "publish-questionaire") {
				if(questionaires[questionaireTitle]) {
					questionaires[questionaireTitle].name = questionaireTitle;
					questionaires[questionaireTitle].deadline = deadline;
					questionaires[questionaireTitle].questions = questionArr;
					questionaires[questionaireTitle].state = "已发布";
				}
				else{
					var questionaire = new Questionnaire({
						name: questionaireTitle,
						deadline: deadline,
						state: "已发布",
						questions: questionArr
					});
					questionaires[questionaireTitle] = questionaire;
					questionairesName.push(questionaireTitle);
				}
			}


			
			var questionairesStr = JSON.stringify(questionaires);

			//采用数组保存问卷名称，index页面按序遍历问卷
			var questionairesNameStr = JSON.stringify(questionairesName);

			setCookie("questionaires", questionairesStr, 999);
			setCookie("questionairesName", questionairesNameStr, 999);

			
			window.location.href = "index.html";
		}
	});
})();