$(function () {
	//实例化团队介绍编辑器
    tinyMCE.init({
        selector: "#doctorTeam_teamDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#doctorTeam_teamName").validatebox({
		required : true, 
		missingMessage : '请输入团队名称',
	});

	$("#doctorTeam_useState").validatebox({
		required : true, 
		missingMessage : '请输入使用状态',
	});

	$("#doctorTeam_bornDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#doctorTeam_chargeMan").validatebox({
		required : true, 
		missingMessage : '请输入负责人',
	});

	$("#doctorTeam_connectPhone").validatebox({
		required : true, 
		missingMessage : '请输入联系电话',
	});

	//单击添加按钮
	$("#doctorTeamAddButton").click(function () {
		if(tinyMCE.editors['doctorTeam_teamDesc'].getContent() == "") {
			alert("请输入团队介绍");
			return;
		}
		//验证表单 
		if(!$("#doctorTeamAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#doctorTeamAddForm").form({
			    url:"/DoctorTeam/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#doctorTeamAddForm").form("validate"))  { 
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
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#doctorTeamAddForm").form("clear");
                        tinyMCE.editors['doctorTeam_teamDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#doctorTeamAddForm").submit();
		}
	});

	//单击清空按钮
	$("#doctorTeamClearButton").click(function () { 
		//$("#doctorTeamAddForm").form("clear"); 
		location.reload()
	});
});
