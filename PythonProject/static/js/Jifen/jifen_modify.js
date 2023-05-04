$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Jifen/update/" + $("#jifen_jifenId_modify").val(),
		type : "get",
		data : {
			//jifenId : $("#jifen_jifenId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (jifen, response, status) {
			$.messager.progress("close");
			if (jifen) { 
				$("#jifen_jifenId_modify").val(jifen.jifenId);
				$("#jifen_jifenId_modify").validatebox({
					required : true,
					missingMessage : "请输入积分id",
					editable: false
				});
				$("#jifen_courtObj_courtId_modify").combobox({
					url:"/Court/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"courtId",
					textField:"courtName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#jifen_courtObj_courtId_modify").combobox("select", jifen.courtObjPri);
						//var data = $("#jifen_courtObj_courtId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#jifen_courtObj_courtId_edit").combobox("select", data[0].courtId);
						//}
					}
				});
				$("#jifen_contentObj_contestId_modify").combobox({
					url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"contestId",
					textField:"contestName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#jifen_contentObj_contestId_modify").combobox("select", jifen.contentObjPri);
						//var data = $("#jifen_contentObj_contestId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#jifen_contentObj_contestId_edit").combobox("select", data[0].contestId);
						//}
					}
				});
				$("#jifen_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#jifen_userObj_user_name_modify").combobox("select", jifen.userObjPri);
						//var data = $("#jifen_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#jifen_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#jifen_score_modify").val(jifen.score);
				$("#jifen_score_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入用户积分",
					invalidMessage : "用户积分输入不对",
				});
				$("#jifen_jifenMemo_modify").val(jifen.jifenMemo);
				$("#jifen_addTime_modify").datetimebox({
					value: jifen.addTime,
					required: true,
					showSeconds: true,
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#jifenModifyButton").click(function(){ 
		if ($("#jifenModifyForm").form("validate")) {
			$("#jifenModifyForm").form({
			    url:"Jifen/update/" + $("#jifen_jifenId_modify").val(),
			    onSubmit: function(){
					if($("#jifenEditForm").form("validate"))  {
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
			$("#jifenModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
