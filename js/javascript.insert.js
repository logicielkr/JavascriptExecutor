var timeoutId;
function Processing() {
	
}
Processing.status = false;
Processing.setted = null;
Processing.is = function() {
	if(Processing.status) {
		if((Date.now() - Processing.setted) > (3 * 1000)) {
			return false;
		} else {
			return Processing.status;
		}
	} else {
		return Processing.status;
	}
};
Processing.set = function() {
	Processing.setted = Date.now();
	Processing.status = true;
};
Processing.clear = function() {
	Processing.setted = null;
	Processing.status = false;
};

function full_screen() {
	$("table#javascript td.contents textarea").height($(window).height() - (2 * $('body').offset().top));
	$(document).scrollTop(Math.ceil($("table#javascript td.contents textarea").offset().top) - ($('body').offset().top / 2));
}

$(document).ready(function() {
	readyStart();
	if(javascriptHistoryId != null) {
		loadMemoHistory();
	} else if(javascriptId != null) {
		if($("form#insert input.javascript_history_id").val() == "") {
			loadMemoHistoryById();
		}
	} else if(isEncrypted) {
		PwdArea.show(initDecrypt);
	}
	$("div.nav.top div.center").append("<input type='button' value='전체화면' onclick='full_screen(this)' />");
});
function loadMemoHistoryById() {
	var ext = location.pathname.substring(location.pathname.lastIndexOf(".") + 1);
	var url = "autosaved.xml";
	if(javascriptId != null) {
		url += "?javascript_id=" + javascriptId;
	}
	$.ajax({
		url: url,
		processData: false,
		contentType: false,
		type: 'GET',
		success: function(result){
			var obj = parse_graha_xml_document(result);
			if(obj && obj.rows && obj.rows["javascript_history"] && obj.rows["javascript_history"].length > 0 && obj.rows["javascript_history"][0].javascript_history_id) {
				PwdArea.hide();
				MessageArea.confirm(
					"자동저장된 게시물을 확인하시겠습니까?", 
					function() {
						javascriptHistoryId = obj.rows["javascript_history"][0].javascript_history_id;
						loadMemoHistory();
						return;
					},
					function() {
						if(isEncrypted) {
							PwdArea.show(initDecrypt);
						}
					}
				);
			}
		},
		error: function(result) {
			if(isEncrypted) {
				PwdArea.show(initDecrypt);
			}
		}
	});
}
function loadMemoHistory() {
	var url = "autosaved.xml";
	if(javascriptHistoryId != null) {
		url += "?javascript_history_id=" + javascriptHistoryId;
	}
	if(javascriptId != null) {
		url += "&javascript_id=" + javascriptId;
	}
	$.ajax({
		url: url,
		processData: false,
		contentType: false,
		type: 'GET',
		success: function(result) {
			var obj = parse_graha_xml_document(result);
			if(obj && obj.rows && obj.rows["javascript_history"] && obj.rows["javascript_history"].length > 0) {
				if(obj.rows["javascript_history"][0].javascript_history_id) {
					$("form#insert input.javascript_history_id").val(obj.rows["javascript_history"][0].javascript_history_id);
					$("form.delete input.javascript_history_id").val(obj.rows["javascript_history"][0].javascript_history_id);
					$("form.delete button[type='submit']").show();
				}
				if(obj.rows["javascript_history"][0].javascript_id) {
					$("form#insert input.javascript_id").val(obj.rows["javascript_history"][0].javascript_id);
				}
				if(obj.rows["javascript_history"][0].parent_id) {
					$("form#insert input.parent_id").val(obj.rows["javascript_history"][0].parent_id);
				}
				if(obj.rows["javascript_history"][0].title) {
					$("form#insert input.title").val(obj.rows["javascript_history"][0].title);
				}
				if(obj.rows["javascript_history"][0].source) {
					$("form#insert textarea.source").val(obj.rows["javascript_history"][0].source);
				}
				if(obj.rows["javascript_history"][0].contents) {
					$("form#insert textarea.contents").val(obj.rows["javascript_history"][0].contents);
				}
				if(obj.rows["javascript_history"][0].results) {
					$("form#insert textarea.results").val(obj.rows["javascript_history"][0].results);
				}
				if(obj.rows["javascript_history"][0].marked) {
					if(obj.rows["javascript_history"][0].marked == "t") {
						$("form#insert input.marked").prop("checked", true);
					} else {
						$("form#insert input.marked").prop("checked", false);
					}
				}
				if(obj.rows["javascript_history"][0].encrypted) {
					if(obj.rows["javascript_history"][0].encrypted == "t") {
						$("form#insert input.encrypted").prop("checked", true);
						isEncrypted = true;
					} else {
						$("form#insert input.encrypted").prop("checked", false);
					}
				}
			}
			if(isEncrypted) {
				PwdArea.show(initDecrypt);
			}
		},
		error: function(result) {
			if(isEncrypted) {
				PwdArea.show(initDecrypt);
			}
		}
	});
}
function initDecrypt() {
	var encrypted = $("form#insert input.title").val();
	var decrypted = PwdArea.decrypt(encrypted);
	$("form#insert input.title").val(decrypted);
	$(document).attr("title", "Javascript 실행기(수정)(" + decrypted + ")");
	$("h2.title").text("Javascript 실행기(수정)(" + decrypted + ")");
	
	encrypted = $("form#insert textarea.contents").val();
	$("form#insert textarea.contents").val(PwdArea.decrypt(encrypted));
}

function readyStart() {
	$("table#javascript td.encrypted input.encrypted").prop("disabled", false);
	$("table#javascript td.autosave input.autosave").prop("disabled", false);
	$("form#insert input[name='autosave']").prop("checked", true);
	readyAutoSave(false);
	$("form#insert input[name='autosave']").click(function() {
		readyAutoSave(true);
	});
	$("form#insert input[name='encrypted']").click(function() {
		readyEncrypted();
	});
	$("form.list").add("form.detail").submit(function(event) {
		toList(event);
		event.preventDefault();
	});
	$("table#javascript th.encrypted").addClass("show");
	$("table#javascript td.encrypted").addClass("show");
	$("table#javascript th.autosave").addClass("show");
	$("table#javascript td.autosave").addClass("show");
}
function toList(event) {
	if(Processing.is()) {
		setTimeout(function(){ toList(event); }, 50);
		return false;
	}
	if($("form#insert input.javascript_history_id").val() != "") {
		MessageArea.confirm(
			"변경사항을 버리시겠습니까?", 
			function() {
				Processing.set();
				var formData = null;
				formData = new FormData();
				formData.append("javascript_history_id", $("form#insert input.javascript_history_id").val());
				var url = "deleteAutoSave.xml";
				$.ajax({
					url: url,
					processData: false,
					contentType: false,
					type: 'POST',
					enctype: 'multipart/form-data',
					data: formData,
					success: function(result) {
						$(event.target).off("submit");
						$(event.target).submit();
					}
				}).always(function() {
					Processing.clear();
				});
			},
			function() {
				
			}
		);
	} else {
		$(event.target).off("submit");
		$(event.target).submit();
	}
}
function readyEncrypted() {
	if($("form#insert input[name='encrypted']").prop("checked")) {
		if(!isEncrypted) {
			PwdArea.showCancle();
			PwdArea.show(function(){
				isEncrypted = true;
				if(
					$("form#insert input[name='autosave']").prop("checked")
					&& $("form#insert input.javascript_history_id").val() != ""
				) {
					autoSave(true);
				}
				
			}, function() {
				$("form#insert input.encrypted").prop("checked", false);
			});
		}
	} else {
		isEncrypted = false;
		if(
			$("form#insert input[name='autosave']").prop("checked")
			&& $("form#insert input.javascript_history_id").val() != ""
		) {
			autoSave(true);
		}
	}
}
function readyAutoSave(gbn) {
	if($("form#insert input[name='autosave']").prop("checked")) {
		if(gbn) {
			autoSave(true);
		}
		$("table#javascript td.source textarea.source").keypress(function () {
			callAutoSave();
		});
		$("table#javascript td.contents textarea.contents").keypress(function (e) {
//			ctrlenter(e);
			callAutoSave();
		});
		$("table#javascript td.title input.title").keypress(function () {
			callAutoSave();
		});
	} else {
		autoSave(false);
		$("table#javascript td.title input.title").off("keypress");
		$("table#javascript td.contents textarea.contents").off("keypress");
		$("table#javascript td.source textarea.source").off("keypress");
		$("textarea\.contents").keypress(function(e) {
			ctrlenter(e);
		});
	}
}
function callAutoSave() {
	if(timeoutId) {
		clearTimeout(timeoutId);
	}
	var timeout = 1000 * 10 * 1;
	timeoutId = setTimeout(function () {
		if(Processing.is()) {
			callAutoSave(true);
		} else {
			autoSave(true);
		}
	}, timeout);
}
function autoSave(gbn) {
	Processing.set();
	try {
		var formData = null;
		var url = null;
		if(gbn) {
			if(
				$("form#insert input.title").val().trim() == "" &&
				$("form#insert textarea.source").val().trim() == "" &&
				$("form#insert textarea.contents").val().trim() == ""
			) {
				return;
			}
			formData = new FormData();
			formData.append("javascript_history_id", $("form#insert input.javascript_history_id").val());
			formData.append("javascript_id", $("form#insert input.javascript_id").val());
			formData.append("parent_id", $("form#insert input.parent_id").val());
			if(isEncrypted) {
				var plain = $("form#insert input.title").val();
				formData.append("title", PwdArea.encrypt(plain));
				plain = $("form#insert textarea.contents").val();
				formData.append("contents", PwdArea.encrypt(plain));
			} else {
				formData.append("title", $("form#insert input.title").val());
				formData.append("contents", $("form#insert textarea.contents").val());
			}
			formData.append("source", $("form#insert textarea.source").val());
			formData.append("results", $("form#insert textarea.results").val());
			if($("form#insert input.marked").prop("checked")) {
				formData.append("marked", $("form#insert input.marked").val());
			}
			if($("form#insert input.encrypted").prop("checked")) {
				formData.append("encrypted", $("form#insert input.encrypted").val());
			}
			formData.append("autosave", $("form#insert input.autosave").val());
			url = "autosave.xml";
		} else {
			if($("form#insert input.javascript_history_id").val() == "") {
				return;
			}
			formData = new FormData();
			formData.append("javascript_history_id", $("form#insert input.javascript_history_id").val());
			url = "deleteAutoSave.xml";
		}
		$.ajax({
			url: url,
			processData: false,
			contentType: false,
			type: 'POST',
			enctype: 'multipart/form-data',
			data: formData,
			success: function(result) {
				var obj = parse_graha_xml_document(result);
				if(gbn) {
					if(obj && obj.rows && obj.rows["javascript_history"] && obj.rows["javascript_history"].length > 0 && obj.rows["javascript_history"][0].javascript_history_id) {
						$("form#insert input.javascript_history_id").val(obj.rows["javascript_history"][0].javascript_history_id);
					}
				} else if(
					obj && 
					obj.params && 
					obj.params.javascript_history_id == $("form#insert input.javascript_history_id").val()
				) {
					$("form#insert input.javascript_history_id").val("");
				}
				Processing.clear();
			}
		}).always(function() {
			Processing.clear();
		});
	} catch(error) {
		Processing.clear();
	}
}
function submitForm(callback) {
	if($("form#insert input[name='encrypted']").prop("checked") && isEncrypted) {
		var plain = $("form#insert input.title").val();
		$("form#insert input.title").val(PwdArea.encrypt(plain));
		plain = $("form#insert textarea.contents").val();
		$("form#insert textarea.contents").val(PwdArea.encrypt(plain));
	}
	if(callback) {
		callback();
	}
	$("form#insert").removeAttr("onsubmit");
	$("form#insert").submit();
}
function focusFor(out) {
	if(out.length > 0) {
		$("form#insert ." + out[0].param).focus();
	}
}
function check_submit(form, msg, callback) {
	if(Processing.is()) {
		setTimeout(function(){ check_submit(form, msg); }, 50);
		return false;
	}
	if($(form).attr("name") == "insert") {
		var out = new Array();
		if(typeof(_check) == "function" && !_check(form, out)) {
			MessageArea.alert(out, focusFor);
			return false;
		}
		if($("form#insert input[name='encrypted']").prop("checked")) {
			if(isEncrypted) {
				Processing.set();
				MessageArea.confirm(
					msg, 
					function() {
						if(callback) {
							submitForm(callback);
						} else {
							submitForm();
						}
					},
					function() {
						Processing.clear();
					}
				);
			}
		} else {
			Processing.set();
			MessageArea.confirm(
				msg, 
				function() {
					if(callback) {
						submitForm(callback);
					} else {
						submitForm();
					}
				},
				function() {
					Processing.clear();
				}
			);
		}
	} else {
		MessageArea.confirm(
			msg,
			function() {
				$(form).removeAttr("onsubmit");
				$(form).submit();
			}
		);
	}
	return false;
}

