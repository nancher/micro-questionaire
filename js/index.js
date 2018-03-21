var renderTbody = function(questionaires, questionairesName) {
	var tableBody = document.getElementsByTagName("tbody")[0];
	var lastTr = tableBody.querySelectorAll("tr:last-of-type")[0];
	while(tableBody.querySelectorAll("tr").length > 1) {
		tableBody.removeChild(tableBody.querySelectorAll("tr")[0]);
	}
		for(var i = 0; i < questionairesName.length; i++) {
			var tr = document.createElement("tr");
			var timeStr = questionaires[questionairesName[i]].deadline.substring(0, 10);
			var time = timeStr.substring(0,8) + (parseInt(timeStr.substr(-2)) + 1);
			var str = "<td class='first-column'><input type='checkbox'></td><td class='second-column'>" + questionaires[questionairesName[i]].name + "</td><td class='third-column'>" + time + "\
</td><td class='fourth-column'>" + questionaires[questionairesName[i]].state + "</td><td class='fifth-column'>\
<button class='edit'>编辑</button><button class='delete'>删除</button><button class='view'>查看数据</button></td>";
			tr.innerHTML = str;
			tr.id = i;
			tableBody.insertBefore(tr, lastTr)[0];
		}
	};

window.onload = function() {
	var tableBody = document.getElementsByTagName("tbody")[0];
	var questionaires;
	var questionairesName
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

	if(questionairesName.length == 0) {
		window.location.href = "qst_crea.html";
	}
	else {
		renderTbody(questionaires, questionairesName);
	}

	addListener(tableBody, "click", function(e) {
		var target = e.target || e.srcElement;
		if(target.className == "delete") {
			var index = target.parentNode.parentNode.id;
			var name = questionairesName.splice(index, 1);
			delete questionaires[name];
			renderTbody(questionaires, questionairesName);
			// console.log(questionaires, questionairesName);
			setCookie("questionaires", JSON.stringify(questionaires), 999);
			setCookie("questionairesName", JSON.stringify(questionairesName), 999);
		}

		if(target.className == "edit") {
			var index = target.parentNode.parentNode.id;
			var name = questionairesName[index];
			window.location.href = "qst_edit.html?name=" + name;
		}

		if(target.className == "view") {
			window.location.href = "qst_view.html";
		}

		if(target.id == "all-check") {
			var boxs = this.querySelectorAll("input[type='checkbox']");
			var count = boxs.length;
			if(target.checked) {	
				for(var i = 0; i < count; i++) {
					boxs[i].checked = true;
				}
			}
			else {
				for(var i = 0; i < count; i++) {
					boxs[i].checked = false;
				}
			}
		}

		if(target.id == "all-delete") {
			var boxs = this.querySelectorAll("input:checked[type='checkbox']");
			var count = boxs.length;
			for(var j = 0; j < count; j++) {
				if(boxs[j].id == "all-check") {
					continue;
				}
				var index = boxs[0].parentNode.parentNode.id;
				var name = questionairesName.splice(index, 1);
				delete questionaires[name[0]];
			}
			setCookie("questionaires", JSON.stringify(questionaires), 999);
			setCookie("questionairesName", JSON.stringify(questionairesName), 999);
			renderTbody(questionaires, questionairesName);
		}
	});
};