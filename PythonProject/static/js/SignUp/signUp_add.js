$(function () {
	$("#signUp_signUpTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#signUp_shenHeState").validatebox({
		required : true, 
		missingMessage : '请输入审核状态',
	});

	$("#signUp_shenHeReply").validatebox({
		required : true, 
		missingMessage : '请输入审核回复',
	});

	//单击添加按钮
	$("#signUpAddButton").click(function () {
		//验证表单 
		if(!$("#signUpAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#signUpAddForm").form({
			    url:"/SignUp/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#signUpAddForm").form("validate"))  { 
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
                        $("#signUpAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#signUpAddForm").submit();
		}
	});

	//单击清空按钮
	$("#signUpClearButton").click(function () { 
		//$("#signUpAddForm").form("clear"); 
		location.reload()
	});
});
