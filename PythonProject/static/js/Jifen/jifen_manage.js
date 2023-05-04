var jifen_manage_tool = null; 
$(function () { 
	initJifenManageTool(); //建立Jifen管理对象
	jifen_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#jifen_manage").datagrid({
		url : '/Jifen/list',
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
		sortName : "jifenId",
		sortOrder : "desc",
		toolbar : "#jifen_manage_tool",
		columns : [[
			{
				field : "jifenId",
				title : "积分id",
				width : 70,
			},
			{
				field : "courtObj",
				title : "比赛场次",
				width : 140,
			},
			{
				field : "contentObj",
				title : "比赛名称",
				width : 140,
			},
			{
				field : "userObj",
				title : "比赛用户",
				width : 140,
			},
			{
				field : "score",
				title : "用户积分",
				width : 70,
			},
			{
				field : "addTime",
				title : "添加时间",
				width : 140,
			},
		]],
	});

	$("#jifenEditDiv").dialog({
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
				if ($("#jifenEditForm").form("validate")) {
					//验证表单 
					if(!$("#jifenEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#jifenEditForm").form({
						    url:"/Jifen/update/" + $("#jifen_jifenId_edit").val(),
						    onSubmit: function(){
								if($("#jifenEditForm").form("validate"))  {
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
			                        $("#jifenEditDiv").dialog("close");
			                        jifen_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#jifenEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#jifenEditDiv").dialog("close");
				$("#jifenEditForm").form("reset"); 
			},
		}],
	});
});

function initJifenManageTool() {
	jifen_manage_tool = {
		init: function() {
			$.ajax({
				url : "/Court/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#courtObj_courtId_query").combobox({ 
					    valueField:"courtId",
					    textField:"courtName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{courtId:0,courtName:"不限制"});
					$("#courtObj_courtId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/Contest/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#contentObj_contestId_query").combobox({ 
					    valueField:"contestId",
					    textField:"contestName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{contestId:0,contestName:"不限制"});
					$("#contentObj_contestId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#jifen_manage").datagrid("reload");
		},
		redo : function () {
			$("#jifen_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#jifen_manage").datagrid("options").queryParams;
			queryParams["courtObj.courtId"] = $("#courtObj_courtId_query").combobox("getValue");
			queryParams["contentObj.contestId"] = $("#contentObj_contestId_query").combobox("getValue");
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["addTime"] = $("#addTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#jifen_manage").datagrid("options").queryParams=queryParams; 
			$("#jifen_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#jifenQueryForm").form({
			    url:"/Jifen/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#jifenQueryForm").submit();
		},
		remove : function () {
			var rows = $("#jifen_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var jifenIds = [];
						for (var i = 0; i < rows.length; i ++) {
							jifenIds.push(rows[i].jifenId);
						}
						$.ajax({
							type : "POST",
							url : "/Jifen/deletes",
							data : {
								jifenIds : jifenIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#jifen_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#jifen_manage").datagrid("loaded");
									$("#jifen_manage").datagrid("load");
									$("#jifen_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#jifen_manage").datagrid("loaded");
									$("#jifen_manage").datagrid("load");
									$("#jifen_manage").datagrid("unselectAll");
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
			var rows = $("#jifen_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Jifen/update/" + rows[0].jifenId,
					type : "get",
					data : {
						//jifenId : rows[0].jifenId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (jifen, response, status) {
						$.messager.progress("close");
						if (jifen) { 
							$("#jifenEditDiv").dialog("open");
							$("#jifen_jifenId_edit").val(jifen.jifenId);
							$("#jifen_jifenId_edit").validatebox({
								required : true,
								missingMessage : "请输入积分id",
								editable: false
							});
							$("#jifen_courtObj_courtId_edit").combobox({
								url:"/Court/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"courtId",
							    textField:"courtName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#jifen_courtObj_courtId_edit").combobox("select", jifen.courtObjPri);
									//var data = $("#jifen_courtObj_courtId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#jifen_courtObj_courtId_edit").combobox("select", data[0].courtId);
						            //}
								}
							});
							$("#jifen_contentObj_contestId_edit").combobox({
								url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"contestId",
							    textField:"contestName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#jifen_contentObj_contestId_edit").combobox("select", jifen.contentObjPri);
									//var data = $("#jifen_contentObj_contestId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#jifen_contentObj_contestId_edit").combobox("select", data[0].contestId);
						            //}
								}
							});
							$("#jifen_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#jifen_userObj_user_name_edit").combobox("select", jifen.userObjPri);
									//var data = $("#jifen_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#jifen_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#jifen_score_edit").val(jifen.score);
							$("#jifen_score_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入用户积分",
								invalidMessage : "用户积分输入不对",
							});
							$("#jifen_jifenMemo_edit").val(jifen.jifenMemo);
							$("#jifen_addTime_edit").datetimebox({
								value: jifen.addTime,
							    required: true,
							    showSeconds: true,
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
