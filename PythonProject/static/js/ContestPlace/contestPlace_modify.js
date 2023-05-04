$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/ContestPlace/update/" + $("#contestPlace_placeNo_modify").val(),
		type : "get",
		data : {
			//placeNo : $("#contestPlace_placeNo_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (contestPlace, response, status) {
			$.messager.progress("close");
			if (contestPlace) { 
				$("#contestPlace_placeNo_modify").val(contestPlace.placeNo);
				$("#contestPlace_placeNo_modify").validatebox({
					required : true,
					missingMessage : "请输入场地编号",
					editable: false
				});
				$("#contestPlace_contestItemObj_classId_modify").combobox({
					url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"classId",
					textField:"className",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#contestPlace_contestItemObj_classId_modify").combobox("select", contestPlace.contestItemObjPri);
						//var data = $("#contestPlace_contestItemObj_classId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#contestPlace_contestItemObj_classId_edit").combobox("select", data[0].classId);
						//}
					}
				});
				$("#contestPlace_placeName_modify").val(contestPlace.placeName);
				$("#contestPlace_placeName_modify").validatebox({
					required : true,
					missingMessage : "请输入场地名称",
				});
				$("#contestPlace_placeArea_modify").val(contestPlace.placeArea);
				$("#contestPlace_placeArea_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入场地面积",
					invalidMessage : "场地面积输入不对",
				});
				$("#contestPlace_placePhotoImgMod").attr("src", contestPlace.placePhoto);
				$("#contestPlace_useDate_modify").datebox({
					value: contestPlace.useDate,
					required: true,
					showSeconds: true,
				});
				$("#contestPlace_placeDesc_modify").val(contestPlace.placeDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#contestPlaceModifyButton").click(function(){ 
		if ($("#contestPlaceModifyForm").form("validate")) {
			$("#contestPlaceModifyForm").form({
			    url:"ContestPlace/update/" + $("#contestPlace_placeNo_modify").val(),
			    onSubmit: function(){
					if($("#contestPlaceEditForm").form("validate"))  {
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
			$("#contestPlaceModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
