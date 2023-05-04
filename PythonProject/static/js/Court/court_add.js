$(function () {
	$("#court_courtName").validatebox({
		required : true, 
		missingMessage : '请输入场次名称',
	});

	$("#court_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#court_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#court_contestResult").validatebox({
		required : true, 
		missingMessage : '请输入比赛结果',
	});

	//单击添加按钮
	$("#courtAddButton").click(function () {
		//验证表单 
		if(!$("#courtAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#courtAddForm").form({
			    url:"/Court/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#courtAddForm").form("validate"))  { 
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
                        $("#courtAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#courtAddForm").submit();
		}
	});

	//单击清空按钮
	$("#courtClearButton").click(function () { 
		//$("#courtAddForm").form("clear"); 
		location.reload()
	});
});
