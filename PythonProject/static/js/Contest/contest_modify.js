$(function () {
    //实例化比赛介绍编辑器
    tinyMCE.init({
        selector: "#contest_contentDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Contest/update/" + $("#contest_contestId_modify").val(),
		type : "get",
		data : {
			//contestId : $("#contest_contestId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (contest, response, status) {
			$.messager.progress("close");
			if (contest) { 
				$("#contest_contestId_modify").val(contest.contestId);
				$("#contest_contestId_modify").validatebox({
					required : true,
					missingMessage : "请输入比赛id",
					editable: false
				});
				$("#contest_contestItemObj_classId_modify").combobox({
					url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"classId",
					textField:"className",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#contest_contestItemObj_classId_modify").combobox("select", contest.contestItemObjPri);
						//var data = $("#contest_contestItemObj_classId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#contest_contestItemObj_classId_edit").combobox("select", data[0].classId);
						//}
					}
				});
				$("#contest_contestName_modify").val(contest.contestName);
				$("#contest_contestName_modify").validatebox({
					required : true,
					missingMessage : "请输入比赛名称",
				});
				$("#contest_contestPhotoImgMod").attr("src", contest.contestPhoto);
				$("#contest_contestPlace_modify").val(contest.contestPlace);
				$("#contest_contestPlace_modify").validatebox({
					required : true,
					missingMessage : "请输入比赛地点",
				});
				tinyMCE.editors['contest_contentDesc_modify'].setContent(contest.contentDesc);
				$("#contest_jubanfang_modify").val(contest.jubanfang);
				$("#contest_jubanfang_modify").validatebox({
					required : true,
					missingMessage : "请输入举办方",
				});
				$("#contest_personNum_modify").val(contest.personNum);
				$("#contest_personNum_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入人数限制",
					invalidMessage : "人数限制输入不对",
				});
				$("#contest_startTime_modify").datetimebox({
					value: contest.startTime,
					required: true,
					showSeconds: true,
				});
				$("#contest_endTime_modify").datetimebox({
					value: contest.endTime,
					required: true,
					showSeconds: true,
				});
				$("#contest_signUpNum_modify").val(contest.signUpNum);
				$("#contest_signUpNum_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入已报名人数",
					invalidMessage : "已报名人数输入不对",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#contestModifyButton").click(function(){ 
		if ($("#contestModifyForm").form("validate")) {
			$("#contestModifyForm").form({
			    url:"Contest/update/" + $("#contest_contestId_modify").val(),
			    onSubmit: function(){
					if($("#contestEditForm").form("validate"))  {
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
			$("#contestModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
