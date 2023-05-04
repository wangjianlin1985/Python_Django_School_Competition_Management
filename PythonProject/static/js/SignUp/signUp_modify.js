$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/SignUp/update/" + $("#signUp_signUpId_modify").val(),
		type : "get",
		data : {
			//signUpId : $("#signUp_signUpId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (signUp, response, status) {
			$.messager.progress("close");
			if (signUp) { 
				$("#signUp_signUpId_modify").val(signUp.signUpId);
				$("#signUp_signUpId_modify").validatebox({
					required : true,
					missingMessage : "请输入报名id",
					editable: false
				});
				$("#signUp_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#signUp_userObj_user_name_modify").combobox("select", signUp.userObjPri);
						//var data = $("#signUp_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#signUp_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#signUp_contestObj_contestId_modify").combobox({
					url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"contestId",
					textField:"contestName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#signUp_contestObj_contestId_modify").combobox("select", signUp.contestObjPri);
						//var data = $("#signUp_contestObj_contestId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#signUp_contestObj_contestId_edit").combobox("select", data[0].contestId);
						//}
					}
				});
				$("#signUp_contestItemObj_classId_modify").combobox({
					url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"classId",
					textField:"className",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#signUp_contestItemObj_classId_modify").combobox("select", signUp.contestItemObjPri);
						//var data = $("#signUp_contestItemObj_classId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#signUp_contestItemObj_classId_edit").combobox("select", data[0].classId);
						//}
					}
				});
				$("#signUp_signUpTime_modify").datetimebox({
					value: signUp.signUpTime,
					required: true,
					showSeconds: true,
				});
				$("#signUp_shenHeState_modify").val(signUp.shenHeState);
				$("#signUp_shenHeState_modify").validatebox({
					required : true,
					missingMessage : "请输入审核状态",
				});
				$("#signUp_shenHeReply_modify").val(signUp.shenHeReply);
				$("#signUp_shenHeReply_modify").validatebox({
					required : true,
					missingMessage : "请输入审核回复",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#signUpModifyButton").click(function(){ 
		if ($("#signUpModifyForm").form("validate")) {
			$("#signUpModifyForm").form({
			    url:"SignUp/update/" + $("#signUp_signUpId_modify").val(),
			    onSubmit: function(){
					if($("#signUpEditForm").form("validate"))  {
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
			$("#signUpModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
