$(function () {
	$("#contestItem_className").validatebox({
		required : true, 
		missingMessage : '请输入类别名称',
	});

	$("#contestItem_classDesc").validatebox({
		required : true, 
		missingMessage : '请输入类别描述',
	});

	//单击添加按钮
	$("#contestItemAddButton").click(function () {
		//验证表单 
		if(!$("#contestItemAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#contestItemAddForm").form({
			    url:"/ContestItem/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#contestItemAddForm").form("validate"))  { 
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
                        $("#contestItemAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#contestItemAddForm").submit();
		}
	});

	//单击清空按钮
	$("#contestItemClearButton").click(function () { 
		//$("#contestItemAddForm").form("clear"); 
		location.reload()
	});
});
