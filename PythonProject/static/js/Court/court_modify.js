$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Court/update/" + $("#court_courtId_modify").val(),
		type : "get",
		data : {
			//courtId : $("#court_courtId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (court, response, status) {
			$.messager.progress("close");
			if (court) { 
				$("#court_courtId_modify").val(court.courtId);
				$("#court_courtId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录id",
					editable: false
				});
				$("#court_contestItemObj_classId_modify").combobox({
					url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"classId",
					textField:"className",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#court_contestItemObj_classId_modify").combobox("select", court.contestItemObjPri);
						//var data = $("#court_contestItemObj_classId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#court_contestItemObj_classId_edit").combobox("select", data[0].classId);
						//}
					}
				});
				$("#court_contestObj_contestId_modify").combobox({
					url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"contestId",
					textField:"contestName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#court_contestObj_contestId_modify").combobox("select", court.contestObjPri);
						//var data = $("#court_contestObj_contestId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#court_contestObj_contestId_edit").combobox("select", data[0].contestId);
						//}
					}
				});
				$("#court_courtName_modify").val(court.courtName);
				$("#court_courtName_modify").validatebox({
					required : true,
					missingMessage : "请输入场次名称",
				});
				$("#court_contestPlaceObj_placeNo_modify").combobox({
					url:"/ContestPlace/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"placeNo",
					textField:"placeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#court_contestPlaceObj_placeNo_modify").combobox("select", court.contestPlaceObjPri);
						//var data = $("#court_contestPlaceObj_placeNo_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#court_contestPlaceObj_placeNo_edit").combobox("select", data[0].placeNo);
						//}
					}
				});
				$("#court_userObj1_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#court_userObj1_user_name_modify").combobox("select", court.userObj1Pri);
						//var data = $("#court_userObj1_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#court_userObj1_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#court_userObj2_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#court_userObj2_user_name_modify").combobox("select", court.userObj2Pri);
						//var data = $("#court_userObj2_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#court_userObj2_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#court_startTime_modify").datetimebox({
					value: court.startTime,
					required: true,
					showSeconds: true,
				});
				$("#court_endTime_modify").datetimebox({
					value: court.endTime,
					required: true,
					showSeconds: true,
				});
				$("#court_contestResult_modify").val(court.contestResult);
				$("#court_contestResult_modify").validatebox({
					required : true,
					missingMessage : "请输入比赛结果",
				});
				$("#court_courtMemo_modify").val(court.courtMemo);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#courtModifyButton").click(function(){ 
		if ($("#courtModifyForm").form("validate")) {
			$("#courtModifyForm").form({
			    url:"Court/update/" + $("#court_courtId_modify").val(),
			    onSubmit: function(){
					if($("#courtEditForm").form("validate"))  {
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
			$("#courtModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
