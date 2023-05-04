$(function () {
	//实例化比赛介绍编辑器
    tinyMCE.init({
        selector: "#contest_contentDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#contest_contestName").validatebox({
		required : true, 
		missingMessage : '请输入比赛名称',
	});

	$("#contest_contestPlace").validatebox({
		required : true, 
		missingMessage : '请输入比赛地点',
	});

	$("#contest_jubanfang").validatebox({
		required : true, 
		missingMessage : '请输入举办方',
	});

	$("#contest_personNum").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入人数限制',
		invalidMessage : '人数限制输入不对',
	});

	$("#contest_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#contest_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#contest_signUpNum").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入已报名人数',
		invalidMessage : '已报名人数输入不对',
	});

	//单击添加按钮
	$("#contestAddButton").click(function () {
		if(tinyMCE.editors['contest_contentDesc'].getContent() == "") {
			alert("请输入比赛介绍");
			return;
		}
		//验证表单 
		if(!$("#contestAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#contestAddForm").form({
			    url:"/Contest/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#contestAddForm").form("validate"))  { 
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
                        $("#contestAddForm").form("clear");
                        tinyMCE.editors['contest_contentDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#contestAddForm").submit();
		}
	});

	//单击清空按钮
	$("#contestClearButton").click(function () { 
		//$("#contestAddForm").form("clear"); 
		location.reload()
	});
});
