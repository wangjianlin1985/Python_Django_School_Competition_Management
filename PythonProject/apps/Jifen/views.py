from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Jifen.models import Jifen
from apps.Contest.models import Contest
from apps.Court.models import Court
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台比赛积分添加
    def get(self,request):
        contests = Contest.objects.all()  # 获取所有比赛
        courts = Court.objects.all()  # 获取所有赛场安排
        userInfos = UserInfo.objects.all()  # 获取所有用户
        context = {
            'contests': contests,
            'courts': courts,
            'userInfos': userInfos,
        }

        # 使用模板
        return render(request, 'Jifen/jifen_frontAdd.html', context)

    def post(self, request):
        jifen = Jifen() # 新建一个比赛积分对象然后获取参数
        jifen.courtObj = Court.objects.get(courtId=request.POST.get('jifen.courtObj.courtId'))
        #jifen.contentObj = Contest.objects.get(contestId=request.POST.get('jifen.contentObj.contestId'))
        jifen.contentObj = jifen.courtObj.contestObj
        jifen.userObj = UserInfo.objects.get(user_name=request.POST.get('jifen.userObj.user_name'))
        jifen.score = float(request.POST.get('jifen.score'))
        jifen.jifenMemo = request.POST.get('jifen.jifenMemo')
        jifen.addTime = request.POST.get('jifen.addTime')
        jifen.save() # 保存比赛积分信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改比赛积分
    def get(self, request, jifenId):
        context = {'jifenId': jifenId}
        return render(request, 'Jifen/jifen_frontModify.html', context)


class FrontListView(BaseView):  # 前台比赛积分查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        courtObj_courtId = self.getIntParam(request, 'courtObj.courtId')
        contentObj_contestId = self.getIntParam(request, 'contentObj.contestId')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        jifens = Jifen.objects.all()
        if courtObj_courtId != '0':
            jifens = jifens.filter(courtObj=courtObj_courtId)
        if contentObj_contestId != '0':
            jifens = jifens.filter(contentObj=contentObj_contestId)
        if userObj_user_name != '':
            jifens = jifens.filter(userObj=userObj_user_name)
        if addTime != '':
            jifens = jifens.filter(addTime__contains=addTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(jifens, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        jifens_page = self.paginator.page(self.currentPage)

        # 获取所有比赛
        contests = Contest.objects.all()
        # 获取所有赛场安排
        courts = Court.objects.all()
        # 获取所有用户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'contests': contests,
            'courts': courts,
            'userInfos': userInfos,
            'jifens_page': jifens_page,
            'courtObj_courtId': int(courtObj_courtId),
            'contentObj_contestId': int(contentObj_contestId),
            'userObj_user_name': userObj_user_name,
            'addTime': addTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Jifen/jifen_frontquery_result.html', context)



class FrontUserListView(BaseView):  # 前台比赛积分查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        courtObj_courtId = self.getIntParam(request, 'courtObj.courtId')
        contentObj_contestId = self.getIntParam(request, 'contentObj.contestId')
        userObj_user_name = request.session.get('user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        jifens = Jifen.objects.all()
        if courtObj_courtId != '0':
            jifens = jifens.filter(courtObj=courtObj_courtId)
        if contentObj_contestId != '0':
            jifens = jifens.filter(contentObj=contentObj_contestId)
        if userObj_user_name != '':
            jifens = jifens.filter(userObj=userObj_user_name)
        if addTime != '':
            jifens = jifens.filter(addTime__contains=addTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(jifens, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        jifens_page = self.paginator.page(self.currentPage)

        # 获取所有比赛
        contests = Contest.objects.all()
        # 获取所有赛场安排
        courts = Court.objects.all()
        # 获取所有用户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'contests': contests,
            'courts': courts,
            'userInfos': userInfos,
            'jifens_page': jifens_page,
            'courtObj_courtId': int(courtObj_courtId),
            'contentObj_contestId': int(contentObj_contestId),
            'userObj_user_name': userObj_user_name,
            'addTime': addTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Jifen/jifen_userFrontquery_result.html', context)


class FrontShowView(View):  # 前台显示比赛积分详情页
    def get(self, request, jifenId):
        # 查询需要显示的比赛积分对象
        jifen = Jifen.objects.get(jifenId=jifenId)
        context = {
            'jifen': jifen
        }
        # 渲染模板显示
        return render(request, 'Jifen/jifen_frontshow.html', context)


class ListAllView(View): # 前台查询所有比赛积分
    def get(self,request):
        jifens = Jifen.objects.all()
        jifenList = []
        for jifen in jifens:
            jifenObj = {
                'jifenId': jifen.jifenId,
            }
            jifenList.append(jifenObj)
        return JsonResponse(jifenList, safe=False)


class UpdateView(BaseView):  # Ajax方式比赛积分更新
    def get(self, request, jifenId):
        # GET方式请求查询比赛积分对象并返回比赛积分json格式
        jifen = Jifen.objects.get(jifenId=jifenId)
        return JsonResponse(jifen.getJsonObj())

    def post(self, request, jifenId):
        # POST方式提交比赛积分修改信息更新到数据库
        jifen = Jifen.objects.get(jifenId=jifenId)
        jifen.courtObj = Court.objects.get(courtId=request.POST.get('jifen.courtObj.courtId'))
        jifen.contentObj = Contest.objects.get(contestId=request.POST.get('jifen.contentObj.contestId'))
        jifen.userObj = UserInfo.objects.get(user_name=request.POST.get('jifen.userObj.user_name'))
        jifen.score = float(request.POST.get('jifen.score'))
        jifen.jifenMemo = request.POST.get('jifen.jifenMemo')
        jifen.addTime = request.POST.get('jifen.addTime')
        jifen.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台比赛积分添加
    def get(self,request):
        contests = Contest.objects.all()  # 获取所有比赛
        courts = Court.objects.all()  # 获取所有赛场安排
        userInfos = UserInfo.objects.all()  # 获取所有用户
        context = {
            'contests': contests,
            'courts': courts,
            'userInfos': userInfos,
        }

        # 渲染显示模板界面
        return render(request, 'Jifen/jifen_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        jifen = Jifen() # 新建一个比赛积分对象然后获取参数
        jifen.courtObj = Court.objects.get(courtId=request.POST.get('jifen.courtObj.courtId'))
        #jifen.contentObj = Contest.objects.get(contestId=request.POST.get('jifen.contentObj.contestId'))
        jifen.contentObj = jifen.courtObj.contestObj
        jifen.userObj = UserInfo.objects.get(user_name=request.POST.get('jifen.userObj.user_name'))
        jifen.score = float(request.POST.get('jifen.score'))
        jifen.jifenMemo = request.POST.get('jifen.jifenMemo')
        jifen.addTime = request.POST.get('jifen.addTime')
        jifen.save() # 保存比赛积分信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新比赛积分
    def get(self, request, jifenId):
        context = {'jifenId': jifenId}
        return render(request, 'Jifen/jifen_modify.html', context)


class ListView(BaseView):  # 后台比赛积分列表
    def get(self, request):
        # 使用模板
        return render(request, 'Jifen/jifen_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        courtObj_courtId = self.getIntParam(request, 'courtObj.courtId')
        contentObj_contestId = self.getIntParam(request, 'contentObj.contestId')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        jifens = Jifen.objects.all()
        if courtObj_courtId != '0':
            jifens = jifens.filter(courtObj=courtObj_courtId)
        if contentObj_contestId != '0':
            jifens = jifens.filter(contentObj=contentObj_contestId)
        if userObj_user_name != '':
            jifens = jifens.filter(userObj=userObj_user_name)
        if addTime != '':
            jifens = jifens.filter(addTime__contains=addTime)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(jifens, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        jifens_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        jifenList = []
        for jifen in jifens_page:
            jifen = jifen.getJsonObj()
            jifenList.append(jifen)
        # 构造模板页面需要的参数
        jifen_res = {
            'rows': jifenList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(jifen_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除比赛积分信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        jifenIds = self.getStrParam(request, 'jifenIds')
        jifenIds = jifenIds.split(',')
        count = 0
        try:
            for jifenId in jifenIds:
                Jifen.objects.get(jifenId=jifenId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出比赛积分信息到excel并下载
    def get(self, request):
        # 收集查询参数
        courtObj_courtId = self.getIntParam(request, 'courtObj.courtId')
        contentObj_contestId = self.getIntParam(request, 'contentObj.contestId')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        jifens = Jifen.objects.all()
        if courtObj_courtId != '0':
            jifens = jifens.filter(courtObj=courtObj_courtId)
        if contentObj_contestId != '0':
            jifens = jifens.filter(contentObj=contentObj_contestId)
        if userObj_user_name != '':
            jifens = jifens.filter(userObj=userObj_user_name)
        if addTime != '':
            jifens = jifens.filter(addTime__contains=addTime)
        #将查询结果集转换成列表
        jifenList = []
        for jifen in jifens:
            jifen = jifen.getJsonObj()
            jifenList.append(jifen)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(jifenList)
        # 设置要导入到excel的列
        columns_map = {
            'jifenId': '积分id',
            'courtObj': '比赛场次',
            'contentObj': '比赛名称',
            'userObj': '比赛用户',
            'score': '用户积分',
            'addTime': '添加时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'jifens.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="jifens.xlsx"'
        return response

