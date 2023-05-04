var contestPlace_manage_tool = null; 
$(function () { 
	initContestPlaceManageTool(); //建立ContestPlace管理对象
	contestPlace_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#contestPlace_manage").datagrid({
		url : '/ContestPlace/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "placeNo",
		sortOrder : "desc",
		toolbar : "#contestPlace_manage_tool",
		columns : [[
			{
				field : "placeNo",
				title : "场地编号",
				width : 140,
			},
			{
				field : "contestItemObj",
				title : "运动项目",
				width : 140,
			},
			{
				field : "placeName",
				title : "场地名称",
				width : 140,
			},
			{
				field : "placeArea",
				title : "场地面积",
				width : 70,
			},
			{
				field : "placePhoto",
				title : "场地照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "useDate",
				title : "投入使用时间",
				width : 140,
			},
		]],
	});

	$("#contestPlaceEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#contestPlaceEditForm").form("validate")) {
					//验证表单 
					if(!$("#contestPlaceEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#contestPlaceEditForm").form({
						    url:"/ContestPlace/update/" + $("#contestPlace_placeNo_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#contestPlaceEditDiv").dialog("close");
			                        contestPlace_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#contestPlaceEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#contestPlaceEditDiv").dialog("close");
				$("#contestPlaceEditForm").form("reset"); 
			},
		}],
	});
});

function initContestPlaceManageTool() {
	contestPlace_manage_tool = {
		init: function() {
			$.ajax({
				url : "/ContestItem/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#contestItemObj_classId_query").combobox({ 
					    valueField:"classId",
					    textField:"className",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{classId:0,className:"不限制"});
					$("#contestItemObj_classId_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#contestPlace_manage").datagrid("reload");
		},
		redo : function () {
			$("#contestPlace_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#contestPlace_manage").datagrid("options").queryParams;
			queryParams["placeNo"] = $("#placeNo").val();
			queryParams["contestItemObj.classId"] = $("#contestItemObj_classId_query").combobox("getValue");
			queryParams["placeName"] = $("#placeName").val();
			queryParams["useDate"] = $("#useDate").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#contestPlace_manage").datagrid("options").queryParams=queryParams; 
			$("#contestPlace_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#contestPlaceQueryForm").form({
			    url:"/ContestPlace/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#contestPlaceQueryForm").submit();
		},
		remove : function () {
			var rows = $("#contestPlace_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var placeNos = [];
						for (var i = 0; i < rows.length; i ++) {
							placeNos.push(rows[i].placeNo);
						}
						$.ajax({
							type : "POST",
							url : "/ContestPlace/deletes",
							data : {
								placeNos : placeNos.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#contestPlace_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#contestPlace_manage").datagrid("loaded");
									$("#contestPlace_manage").datagrid("load");
									$("#contestPlace_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#contestPlace_manage").datagrid("loaded");
									$("#contestPlace_manage").datagrid("load");
									$("#contestPlace_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#contestPlace_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/ContestPlace/update/" + rows[0].placeNo,
					type : "get",
					data : {
						//placeNo : rows[0].placeNo,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (contestPlace, response, status) {
						$.messager.progress("close");
						if (contestPlace) { 
							$("#contestPlaceEditDiv").dialog("open");
							$("#contestPlace_placeNo_edit").val(contestPlace.placeNo);
							$("#contestPlace_placeNo_edit").validatebox({
								required : true,
								missingMessage : "请输入场地编号",
								editable: false
							});
							$("#contestPlace_contestItemObj_classId_edit").combobox({
								url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"classId",
							    textField:"className",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#contestPlace_contestItemObj_classId_edit").combobox("select", contestPlace.contestItemObjPri);
									//var data = $("#contestPlace_contestItemObj_classId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#contestPlace_contestItemObj_classId_edit").combobox("select", data[0].classId);
						            //}
								}
							});
							$("#contestPlace_placeName_edit").val(contestPlace.placeName);
							$("#contestPlace_placeName_edit").validatebox({
								required : true,
								missingMessage : "请输入场地名称",
							});
							$("#contestPlace_placeArea_edit").val(contestPlace.placeArea);
							$("#contestPlace_placeArea_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入场地面积",
								invalidMessage : "场地面积输入不对",
							});
							$("#contestPlace_placePhotoImg").attr("src", contestPlace.placePhoto);
							$("#contestPlace_useDate_edit").datebox({
								value: contestPlace.useDate,
							    required: true,
							    showSeconds: true,
							});
							$("#contestPlace_placeDesc_edit").val(contestPlace.placeDesc);
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
