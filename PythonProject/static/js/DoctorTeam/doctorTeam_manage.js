var doctorTeam_manage_tool = null; 
$(function () { 
	initDoctorTeamManageTool(); //建立DoctorTeam管理对象
	doctorTeam_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#doctorTeam_manage").datagrid({
		url : '/DoctorTeam/list',
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
		sortName : "teamId",
		sortOrder : "desc",
		toolbar : "#doctorTeam_manage_tool",
		columns : [[
			{
				field : "teamId",
				title : "团队id",
				width : 70,
			},
			{
				field : "teamName",
				title : "团队名称",
				width : 140,
			},
			{
				field : "teamPhoto",
				title : "团队照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "useState",
				title : "使用状态",
				width : 140,
			},
			{
				field : "bornDate",
				title : "成立日期",
				width : 140,
			},
			{
				field : "chargeMan",
				title : "负责人",
				width : 140,
			},
			{
				field : "connectPhone",
				title : "联系电话",
				width : 140,
			},
		]],
	});

	$("#doctorTeamEditDiv").dialog({
		title : "修改管理",
		top: "10px",
		width : 1000,
		height : 600,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#doctorTeamEditForm").form("validate")) {
					//验证表单 
					if(!$("#doctorTeamEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#doctorTeamEditForm").form({
						    url:"/DoctorTeam/update/" + $("#doctorTeam_teamId_edit").val(),
						    onSubmit: function(){
								if($("#doctorTeamEditForm").form("validate"))  {
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
			                        $("#doctorTeamEditDiv").dialog("close");
			                        doctorTeam_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#doctorTeamEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#doctorTeamEditDiv").dialog("close");
				$("#doctorTeamEditForm").form("reset"); 
			},
		}],
	});
});

function initDoctorTeamManageTool() {
	doctorTeam_manage_tool = {
		init: function() {
			//实例化编辑器
			tinyMCE.init({
				selector: "#doctorTeam_teamDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#doctorTeam_manage").datagrid("reload");
		},
		redo : function () {
			$("#doctorTeam_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#doctorTeam_manage").datagrid("options").queryParams;
			queryParams["teamName"] = $("#teamName").val();
			queryParams["useState"] = $("#useState").val();
			queryParams["bornDate"] = $("#bornDate").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#doctorTeam_manage").datagrid("options").queryParams=queryParams; 
			$("#doctorTeam_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#doctorTeamQueryForm").form({
			    url:"/DoctorTeam/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#doctorTeamQueryForm").submit();
		},
		remove : function () {
			var rows = $("#doctorTeam_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var teamIds = [];
						for (var i = 0; i < rows.length; i ++) {
							teamIds.push(rows[i].teamId);
						}
						$.ajax({
							type : "POST",
							url : "/DoctorTeam/deletes",
							data : {
								teamIds : teamIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#doctorTeam_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#doctorTeam_manage").datagrid("loaded");
									$("#doctorTeam_manage").datagrid("load");
									$("#doctorTeam_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#doctorTeam_manage").datagrid("loaded");
									$("#doctorTeam_manage").datagrid("load");
									$("#doctorTeam_manage").datagrid("unselectAll");
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
			var rows = $("#doctorTeam_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/DoctorTeam/update/" + rows[0].teamId,
					type : "get",
					data : {
						//teamId : rows[0].teamId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (doctorTeam, response, status) {
						$.messager.progress("close");
						if (doctorTeam) { 
							$("#doctorTeamEditDiv").dialog("open");
							$("#doctorTeam_teamId_edit").val(doctorTeam.teamId);
							$("#doctorTeam_teamId_edit").validatebox({
								required : true,
								missingMessage : "请输入团队id",
								editable: false
							});
							$("#doctorTeam_teamName_edit").val(doctorTeam.teamName);
							$("#doctorTeam_teamName_edit").validatebox({
								required : true,
								missingMessage : "请输入团队名称",
							});
							$("#doctorTeam_teamPhotoImg").attr("src", doctorTeam.teamPhoto);
							$("#doctorTeam_useState_edit").val(doctorTeam.useState);
							$("#doctorTeam_useState_edit").validatebox({
								required : true,
								missingMessage : "请输入使用状态",
							});
							$("#doctorTeam_bornDate_edit").datebox({
								value: doctorTeam.bornDate,
							    required: true,
							    showSeconds: true,
							});
							$("#doctorTeam_chargeMan_edit").val(doctorTeam.chargeMan);
							$("#doctorTeam_chargeMan_edit").validatebox({
								required : true,
								missingMessage : "请输入负责人",
							});
							$("#doctorTeam_connectPhone_edit").val(doctorTeam.connectPhone);
							$("#doctorTeam_connectPhone_edit").validatebox({
								required : true,
								missingMessage : "请输入联系电话",
							});
							tinyMCE.editors['doctorTeam_teamDesc_edit'].setContent(doctorTeam.teamDesc);
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
