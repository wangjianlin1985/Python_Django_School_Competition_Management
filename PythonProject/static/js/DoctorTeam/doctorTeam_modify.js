$(function () {
    //实例化团队介绍编辑器
    tinyMCE.init({
        selector: "#doctorTeam_teamDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/DoctorTeam/update/" + $("#doctorTeam_teamId_modify").val(),
		type : "get",
		data : {
			//teamId : $("#doctorTeam_teamId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (doctorTeam, response, status) {
			$.messager.progress("close");
			if (doctorTeam) { 
				$("#doctorTeam_teamId_modify").val(doctorTeam.teamId);
				$("#doctorTeam_teamId_modify").validatebox({
					required : true,
					missingMessage : "请输入团队id",
					editable: false
				});
				$("#doctorTeam_teamName_modify").val(doctorTeam.teamName);
				$("#doctorTeam_teamName_modify").validatebox({
					required : true,
					missingMessage : "请输入团队名称",
				});
				$("#doctorTeam_teamPhotoImgMod").attr("src", doctorTeam.teamPhoto);
				$("#doctorTeam_useState_modify").val(doctorTeam.useState);
				$("#doctorTeam_useState_modify").validatebox({
					required : true,
					missingMessage : "请输入使用状态",
				});
				$("#doctorTeam_bornDate_modify").datebox({
					value: doctorTeam.bornDate,
					required: true,
					showSeconds: true,
				});
				$("#doctorTeam_chargeMan_modify").val(doctorTeam.chargeMan);
				$("#doctorTeam_chargeMan_modify").validatebox({
					required : true,
					missingMessage : "请输入负责人",
				});
				$("#doctorTeam_connectPhone_modify").val(doctorTeam.connectPhone);
				$("#doctorTeam_connectPhone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				tinyMCE.editors['doctorTeam_teamDesc_modify'].setContent(doctorTeam.teamDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#doctorTeamModifyButton").click(function(){ 
		if ($("#doctorTeamModifyForm").form("validate")) {
			$("#doctorTeamModifyForm").form({
			    url:"DoctorTeam/update/" + $("#doctorTeam_teamId_modify").val(),
			    onSubmit: function(){
					if($("#doctorTeamEditForm").form("validate"))  {
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
			$("#doctorTeamModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
