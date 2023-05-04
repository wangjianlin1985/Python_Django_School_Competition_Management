$(function () {
	$("#jifen_score").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入用户积分',
		invalidMessage : '用户积分输入不对',
	});

	$("#jifen_addTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#jifenAddButton").click(function () {
		//验证表单 
		if(!$("#jifenAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#jifenAddForm").form({
			    url:"/Jifen/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#jifenAddForm").form("validate"))  { 
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
                        $("#jifenAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#jifenAddForm").submit();
		}
	});

	//单击清空按钮
	$("#jifenClearButton").click(function () { 
		//$("#jifenAddForm").form("clear"); 
		location.reload()
	});
});
