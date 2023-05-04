var court_manage_tool = null; 
$(function () { 
	initCourtManageTool(); //建立Court管理对象
	court_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#court_manage").datagrid({
		url : '/Court/list',
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
		sortName : "courtId",
		sortOrder : "desc",
		toolbar : "#court_manage_tool",
		columns : [[
			{
				field : "courtId",
				title : "记录id",
				width : 70,
			},
			{
				field : "contestItemObj",
				title : "比赛项目",
				width : 140,
			},
			{
				field : "contestObj",
				title : "所属比赛",
				width : 200,
			},
			{
				field : "courtName",
				title : "场次名称",
				width : 200,
			},
			{
				field : "contestPlaceObj",
				title : "比赛场地",
				width : 140,
			},
			{
				field : "userObj1",
				title : "参赛选手",
				width : 140,
			},
			{
				field : "userObj2",
				title : "对阵选手",
				width : 140,
			},
			{
				field : "startTime",
				title : "比赛开始时间",
				width : 140,
			},
			{
				field : "endTime",
				title : "比赛结束时间",
				width : 140,
			},
			{
				field : "contestResult",
				title : "比赛结果",
				width : 140,
			},
		]],
	});

	$("#courtEditDiv").dialog({
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
				if ($("#courtEditForm").form("validate")) {
					//验证表单 
					if(!$("#courtEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#courtEditForm").form({
						    url:"/Court/update/" + $("#court_courtId_edit").val(),
						    onSubmit: function(){
								if($("#courtEditForm").form("validate"))  {
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
			                        $("#courtEditDiv").dialog("close");
			                        court_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#courtEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#courtEditDiv").dialog("close");
				$("#courtEditForm").form("reset"); 
			},
		}],
	});
});

function initCourtManageTool() {
	court_manage_tool = {
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
				url : "/ContestPlace/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#contestPlaceObj_placeNo_query").combobox({ 
					    valueField:"placeNo",
					    textField:"placeName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{placeNo:"",placeName:"不限制"});
					$("#contestPlaceObj_placeNo_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj1_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj1_user_name_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj2_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj2_user_name_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#court_manage").datagrid("reload");
		},
		redo : function () {
			$("#court_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#court_manage").datagrid("options").queryParams;
			queryParams["contestItemObj.classId"] = $("#contestItemObj_classId_query").combobox("getValue");
			queryParams["contestObj.contestId"] = $("#contestObj_contestId_query").combobox("getValue");
			queryParams["courtName"] = $("#courtName").val();
			queryParams["contestPlaceObj.placeNo"] = $("#contestPlaceObj_placeNo_query").combobox("getValue");
			queryParams["userObj1.user_name"] = $("#userObj1_user_name_query").combobox("getValue");
			queryParams["userObj2.user_name"] = $("#userObj2_user_name_query").combobox("getValue");
			queryParams["startTime"] = $("#startTime").datebox("getValue"); 
			queryParams["endTime"] = $("#endTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#court_manage").datagrid("options").queryParams=queryParams; 
			$("#court_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#courtQueryForm").form({
			    url:"/Court/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#courtQueryForm").submit();
		},
		remove : function () {
			var rows = $("#court_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var courtIds = [];
						for (var i = 0; i < rows.length; i ++) {
							courtIds.push(rows[i].courtId);
						}
						$.ajax({
							type : "POST",
							url : "/Court/deletes",
							data : {
								courtIds : courtIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#court_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#court_manage").datagrid("loaded");
									$("#court_manage").datagrid("load");
									$("#court_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#court_manage").datagrid("loaded");
									$("#court_manage").datagrid("load");
									$("#court_manage").datagrid("unselectAll");
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
			var rows = $("#court_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Court/update/" + rows[0].courtId,
					type : "get",
					data : {
						//courtId : rows[0].courtId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (court, response, status) {
						$.messager.progress("close");
						if (court) { 
							$("#courtEditDiv").dialog("open");
							$("#court_courtId_edit").val(court.courtId);
							$("#court_courtId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录id",
								editable: false
							});
							$("#court_contestItemObj_classId_edit").combobox({
								url:"/ContestItem/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"classId",
							    textField:"className",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#court_contestItemObj_classId_edit").combobox("select", court.contestItemObjPri);
									//var data = $("#court_contestItemObj_classId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#court_contestItemObj_classId_edit").combobox("select", data[0].classId);
						            //}
								}
							});
							$("#court_contestObj_contestId_edit").combobox({
								url:"/Contest/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"contestId",
							    textField:"contestName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#court_contestObj_contestId_edit").combobox("select", court.contestObjPri);
									//var data = $("#court_contestObj_contestId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#court_contestObj_contestId_edit").combobox("select", data[0].contestId);
						            //}
								}
							});
							$("#court_courtName_edit").val(court.courtName);
							$("#court_courtName_edit").validatebox({
								required : true,
								missingMessage : "请输入场次名称",
							});
							$("#court_contestPlaceObj_placeNo_edit").combobox({
								url:"/ContestPlace/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"placeNo",
							    textField:"placeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#court_contestPlaceObj_placeNo_edit").combobox("select", court.contestPlaceObjPri);
									//var data = $("#court_contestPlaceObj_placeNo_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#court_contestPlaceObj_placeNo_edit").combobox("select", data[0].placeNo);
						            //}
								}
							});
							$("#court_userObj1_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#court_userObj1_user_name_edit").combobox("select", court.userObj1Pri);
									//var data = $("#court_userObj1_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#court_userObj1_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#court_userObj2_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#court_userObj2_user_name_edit").combobox("select", court.userObj2Pri);
									//var data = $("#court_userObj2_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#court_userObj2_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#court_startTime_edit").datetimebox({
								value: court.startTime,
							    required: true,
							    showSeconds: true,
							});
							$("#court_endTime_edit").datetimebox({
								value: court.endTime,
							    required: true,
							    showSeconds: true,
							});
							$("#court_contestResult_edit").val(court.contestResult);
							$("#court_contestResult_edit").validatebox({
								required : true,
								missingMessage : "请输入比赛结果",
							});
							$("#court_courtMemo_edit").val(court.courtMemo);
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
