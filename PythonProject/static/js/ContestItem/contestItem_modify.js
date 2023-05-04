$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/ContestItem/update/" + $("#contestItem_classId_modify").val(),
		type : "get",
		data : {
			//classId : $("#contestItem_classId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (contestItem, response, status) {
			$.messager.progress("close");
			if (contestItem) { 
				$("#contestItem_classId_modify").val(contestItem.classId);
				$("#contestItem_classId_modify").validatebox({
					required : true,
					missingMessage : "请输入类别编号",
					editable: false
				});
				$("#contestItem_className_modify").val(contestItem.className);
				$("#contestItem_className_modify").validatebox({
					required : true,
					missingMessage : "请输入类别名称",
				});
				$("#contestItem_classDesc_modify").val(contestItem.classDesc);
				$("#contestItem_classDesc_modify").validatebox({
					required : true,
					missingMessage : "请输入类别描述",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#contestItemModifyButton").click(function(){ 
		if ($("#contestItemModifyForm").form("validate")) {
			$("#contestItemModifyForm").form({
			    url:"ContestItem/update/" + $("#contestItem_classId_modify").val(),
			    onSubmit: function(){
					if($("#contestItemEditForm").form("validate"))  {
	                	$.messager.progress({
							text : "正在提交数据中...",
						});
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#contestItemModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
