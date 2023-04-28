function loadScript(src) {
	var script = null;
	for(let i = 0; i < document.getElementsByTagName('script').length; i++) {
		let element= document.getElementsByTagName('script').item(i);
		if(element && element.src != null && element.src == src) {
			script = element;
//			log("Already Loaded", src);
		}
	}
	if(script == null) {
		return new Promise(function(resolve, reject) {
			script = document.createElement('script');
			script.src = src;
			
			script.onload = function() {
				resolve(script);
			}
			script.onerror = function() {
				reject(new Error('loading fail'));
			}
			
			document.getElementsByTagName('HEAD').item(0).appendChild(script);
		});
	} else {
		return new Promise(function(resolve, reject)	 {
			resolve(script);
		});
	}
}
function loadScripts(scripts, callback) {
	while(scripts.length > 0) {
		if(scripts[0] == null || scripts[0].trim() == "") {
			scripts.shift();
		} else {
			break;
		}
	}
	if(scripts.length > 0) {
		loadScript(scripts[0].trim()).then(
			function(result) {
				scripts.shift();
				if(scripts.length > 0) {
					loadScripts(scripts, callback);
				} else {
					callback();
				}
			},
			function(error) {
				log("error", error);
				scripts.shift();
				if(scripts.length > 0) {
					loadScripts(scripts, callback);
				} else {
					callback();
				}
			}
		);
	}
}


function evalcode() {
	var source = $("textarea\.source").val();
	if(source != null && source.trim() != "") {
		var scripts = source.split("\n");
		loadScripts(scripts, evalcode2);
	} else {
		evalcode2();
	}
}
function evalcode2() {
	$("textarea\.results").val("");
	var code = $("textarea\.contents").val();
	if(code != null && code.trim() != "") {
		try {
			$("textarea\.results").val("");
/*
//////////이런 방식이 성능이나 보안이 우수하다고 알려져 있지만(MDN), 실행결과가 Browser Console 혹은 Web Console 과 미세한 차이가 나는데, result를 돌려 받을 수 없다.
			var f = Function('"use strict"; ' + code + '');
			f.call();
*/

			let result = eval('"use strict";' + code);
			if(typeof(result) != "undefined") {
				$("textarea\.results").val($("textarea\.results").val() + result);
			}

		} catch (e){
			let error = e.toString();
			$("textarea\.results").val($("textarea\.results").val() + error);
		}
	} else {
		alert("code is null");
	}
}
function log() {
	for(let i = 0; i < arguments.length; i++) {
		let arg = arguments[i];
		if(i > 0) {
			$("textarea\.results").val($("textarea\.results").val() + " ");
		}
		$("textarea\.results").val($("textarea\.results").val() + arg);
	}
	$("textarea\.results").val($("textarea\.results").val() + "\n");
}
function ctrlenter(e) {
	if((e.keyCode == 13 || e.keyCode == 10) && e.ctrlKey) {
		evalcode();
	}
}
function number(value) {
	if(typeof(value) == "number") {
		return value;
/*
//////////이게 되면 편리한게 많은데, 좋다 말았다. 0으로 시작하는 숫자가 오면 8진수로 인식해서 엉망이 된다.
		if(arguments.length > 1) {
			var result = 0;
			var digit = 0;
			for(var i = arguments.length - 1; i >= 0; i--) {
				result += arguments[i] * Math.pow(10, digit);
				if(arguments[i] == 0) {
					digit += 3;
				} else {
					digit += Math.floor(Math.log10(arguments[i])) + 1;
				}
			}
			return result;
		} else {
			return value;
		}
*/
	} else if(typeof(value) == "string") {
		return parseInt(value.trim().replace(/ /g, "").replace(/,/g, ""));
	} else {
		return value;
	}
}
function n(value) {
	return number(value);
}
function string(value) {
	return value.toLocaleString();
}
function s(value) {
	return string(value);
}

function saveAsNew() {
	check_submit(
		document.getElementById("insert"), 
		'변경사항을 저장하시겠습니까?',
		function() {
			if($("form#insert input[name='parent_id']").val() == "") {
				$("form#insert input[name='parent_id']").val($("form#insert input[name='javascript_id']").val());
			}
			$("form#insert input[name='javascript_id']").val("");
		}
	);
}
$(document).ready(function() {
	if($("form#insert input[name='javascript_id']").val() != "") {
//		$("<button type='button' onclick='saveAsNew()'>새이름으로</button>").insertAfter($("button#insert_submit"));
		$("div.nav.top div.box.center").append($("<button type='button' onclick='saveAsNew()'>새이름으로</button>"));
	}
	$("textarea\.contents").keypress(function(e) {
			ctrlenter(e);
	});
	$("input\.execute").click(function() {
		evalcode();
	});
});
