var contestItem_manage_tool = null; 
$(function () { 
	initContestItemManageTool(); //建立ContestItem管理对象
	contestItem_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#contestItem_manage").datagrid({
		url : '/ContestItem/list',
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
		sortName : "classId",
		sortOrder : "desc",
		toolbar : "#contestItem_manage_tool",
		columns : [[
			{
				field : "classId",
				title : "类别编号",
				width : 70,
			},
			{
				field : "className",
				title : "类别名称",
				width : 140,
			},
			{
				field : "classDesc",
				title : "类别描述",
				width : 140,
			},
		]],
	});

	$("#contestItemEditDiv").dialog({
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
				if ($("#contestItemEditForm").form("validate")) {
					//验证表单 
					if(!$("#contestItemEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#contestItemEditForm").form({
						    url:"/ContestItem/update/" + $("#contestItem_classId_edit").val(),
						    onSubmit: function(){
								if($("#contestItemEditForm").form("validate"))  {
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
			                        $("#contestItemEditDiv").dialog("close");
			                        contestItem_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#contestItemEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#contestItemEditDiv").dialog("close");
				$("#contestItemEditForm").form("reset"); 
			},
		}],
	});
});

function initContestItemManageTool() {
	contestItem_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#contestItem_manage").datagrid("reload");
		},
		redo : function () {
			$("#contestItem_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#contestItem_manage").datagrid("options").queryParams=queryParams; 
			$("#contestItem_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#contestItemQueryForm").form({
			    url:"/ContestItem/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#contestItemQueryForm").submit();
		},
		remove : function () {
			var rows = $("#contestItem_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var classIds = [];
						for (var i = 0; i < rows.length; i ++) {
							classIds.push(rows[i].classId);
						}
						$.ajax({
							type : "POST",
							url : "/ContestItem/deletes",
							data : {
								classIds : classIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#contestItem_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#contestItem_manage").datagrid("loaded");
									$("#contestItem_manage").datagrid("load");
									$("#contestItem_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#contestItem_manage").datagrid("loaded");
									$("#contestItem_manage").datagrid("load");
									$("#contestItem_manage").datagrid("unselectAll");
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
			var rows = $("#contestItem_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/ContestItem/update/" + rows[0].classId,
					type : "get",
					data : {
						//classId : rows[0].classId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (contestItem, response, status) {
						$.messager.progress("close");
						if (contestItem) { 
							$("#contestItemEditDiv").dialog("open");
							$("#contestItem_classId_edit").val(contestItem.classId);
							$("#contestItem_classId_edit").validatebox({
								required : true,
								missingMessage : "请输入类别编号",
								editable: false
							});
							$("#contestItem_className_edit").val(contestItem.className);
							$("#contestItem_className_edit").validatebox({
								required : true,
								missingMessage : "请输入类别名称",
							});
							$("#contestItem_classDesc_edit").val(contestItem.classDesc);
							$("#contestItem_classDesc_edit").validatebox({
								required : true,
								missingMessage : "请输入类别描述",
							});
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
