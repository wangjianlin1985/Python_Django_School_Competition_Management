var signUp_manage_tool = null; 
$(function () { 
	initSignUpManageTool(); //建立SignUp管理对象
	signUp_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#signUp_manage").datagrid({
		url : '/SignUp/list',
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
		sortName : "signUpId",
		sortOrder : "desc",
		toolbar : "#signUp_manage_tool",
		columns : [[
			{
				field : "userObj",
				title : "报名用户",
				width : 140,
			},
			{
				field : "contestObj",
				title : "报名比赛",
				width : 140,
			},
			{
				field : "contestItemObj",
				title : "比赛项目",
				width : 140,
			},
			{
				field : "signUpTime",
				title : "报名时间",
				width : 140,
			},
			{
				field : "shenHeState",
				title : "审核状态",
				width : 140,
			},
			{
				field : "shenHeReply",
				title : "审核回复",
				width : 140,
			},
		]],
	});

	$("#signUpEditDiv").dialog({
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
				if ($("#signUpEditForm").form("validate")) {
					//验证表单 
					if(!$("#signUpEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#signUpEditForm").form({
						    url:"/SignUp/update/" + $("#signUp_signUpId_edit").val(),
						    onSubmit: function(){
								if($("#signUpEditForm").form("validate"))  {
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
			                        $("#signUpEditDiv").dialog("close");
			                        signUp_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#signUpEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#signUpEditDiv").dialog("close");
				$("#signUpEditForm").form("reset"); 
			},
		}],
	});
});

function initSignUpManageTool() {
	signUp_manage_tool = {
		init: function() {
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
			$.ajax({
				url : "/Contest/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#contestObj_contestId_query").combobox({ 
					    valueField:"contestId",
					    textField:"contestName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{contestId:0,contestName:"不限制"});
					$("#contestObj_contestId_query").combobox("loadData",data); 
				}
			});
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
			$("#signUp_manage").datagrid("reload");
		},
		redo : function () {
			$("#signUp_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#signUp_manage").datagrid("options").queryParams;
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["contestObj.contestId"] = $("#contestObj_contestId_query").combobox("getValue");
			queryParams["contestItemObj.classId"] = $("#contestItemObj_classId_query").combobox("getValue");
			queryParams["signUpTime"] = $("#signUpTime").datebox("getValue"); 
			queryParams["shenHeState"] = $("#shenHeState").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#signUp_manage").datagrid("options").queryParams=queryParams; 
			$("#signUp_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#signUpQueryForm").form({
			    url:"/SignUp/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#signUpQueryForm").submit();
		},
		remove : function () {
			var rows = $("#signUp_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var signUpIds = [];
						for (var i = 0; i < rows.length; i ++) {
							signUpIds.push(rows[i].signUpId);
						}
						$.ajax({
							type : "POST",
							url : "/SignUp/deletes",
							data : {
								signUpIds : signUpIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#signUp_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#signUp_manage").datagrid("loaded");
									$("#signUp_manage").datagrid("load");
									$("#signUp_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#signUp_manage").datagrid("loaded");
									$("#signUp_manage").datagrid("load");
									$("#signUp_manage").datagrid("unselectAll");
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
			var rows = $("#signUp_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/SignUp/update/" + rows[0].signUpId,
					type : "get",
					data : {
						//signUpId : rows[0].signUpId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (signUp, response, status) {
						$.messager.progress("close");
						if (signUp) { 
							$("#signUpEditDiv").dialog("open");
							$("#signUp_signUpId_edit").val(signUp.signUpId);
							$("#signUp_signUpId_edit").validatebox({
								required : true,
								missingMessage : "请输入报名id",
								editable: false
							});
							$("#signUp_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#signUp_userObj_user_name_edit").combobox("select", signUp.userObjPri);
									//var data = $("#signUp_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#signUp_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#signUp_contestObj_contestId_edit").combobox({
								url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"contestId",
							    textField:"contestName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#signUp_contestObj_contestId_edit").combobox("select", signUp.contestObjPri);
									//var data = $("#signUp_contestObj_contestId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#signUp_contestObj_contestId_edit").combobox("select", data[0].contestId);
						            //}
								}
							});
							$("#signUp_contestItemObj_classId_edit").combobox({
								url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"classId",
							    textField:"className",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#signUp_contestItemObj_classId_edit").combobox("select", signUp.contestItemObjPri);
									//var data = $("#signUp_contestItemObj_classId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#signUp_contestItemObj_classId_edit").combobox("select", data[0].classId);
						            //}
								}
							});
							$("#signUp_signUpTime_edit").datetimebox({
								value: signUp.signUpTime,
							    required: true,
							    showSeconds: true,
							});
							$("#signUp_shenHeState_edit").val(signUp.shenHeState);
							$("#signUp_shenHeState_edit").validatebox({
								required : true,
								missingMessage : "请输入审核状态",
							});
							$("#signUp_shenHeReply_edit").val(signUp.shenHeReply);
							$("#signUp_shenHeReply_edit").validatebox({
								required : true,
								missingMessage : "请输入审核回复",
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
