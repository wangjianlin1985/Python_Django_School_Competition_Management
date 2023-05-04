from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Contest.models import Contest
from apps.ContestItem.models import ContestItem
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台比赛添加
    def get(self,request):
        contestItems = ContestItem.objects.all()  # 获取所有比赛项目
        context = {
            'contestItems': contestItems,
        }

        # 使用模板
        return render(request, 'Contest/contest_frontAdd.html', context)

    def post(self, request):
        contest = Contest() # 新建一个比赛对象然后获取参数
        contest.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contest.contestItemObj.classId'))
        contest.contestName = request.POST.get('contest.contestName')
        try:
            contest.contestPhoto = self.uploadImageFile(request,'contest.contestPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        contest.contestPlace = request.POST.get('contest.contestPlace')
        contest.contentDesc = request.POST.get('contest.contentDesc')
        contest.jubanfang = request.POST.get('contest.jubanfang')
        contest.personNum = int(request.POST.get('contest.personNum'))
        contest.startTime = request.POST.get('contest.startTime')
        contest.endTime = request.POST.get('contest.endTime')
        contest.signUpNum = int(request.POST.get('contest.signUpNum'))
        contest.save() # 保存比赛信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改比赛
    def get(self, request, contestId):
        context = {'contestId': contestId}
        return render(request, 'Contest/contest_frontModify.html', context)


class FrontListView(BaseView):  # 前台比赛查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        contestName = self.getStrParam(request, 'contestName')
        jubanfang = self.getStrParam(request, 'jubanfang')
        startTime = self.getStrParam(request, 'startTime')
        # 然后条件组合查询过滤
        contests = Contest.objects.all()
        if contestItemObj_classId != '0':
            contests = contests.filter(contestItemObj=contestItemObj_classId)
        if contestName != '':
            contests = contests.filter(contestName__contains=contestName)
        if jubanfang != '':
            contests = contests.filter(jubanfang__contains=jubanfang)
        if startTime != '':
            contests = contests.filter(startTime__contains=startTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(contests, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contests_page = self.paginator.page(self.currentPage)

        # 获取所有比赛项目
        contestItems = ContestItem.objects.all()
        # 构造模板需要的参数
        context = {
            'contestItems': contestItems,
            'contests_page': contests_page,
            'contestItemObj_classId': int(contestItemObj_classId),
            'contestName': contestName,
            'jubanfang': jubanfang,
            'startTime': startTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Contest/contest_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示比赛详情页
    def get(self, request, contestId):
        # 查询需要显示的比赛对象
        contest = Contest.objects.get(contestId=contestId)
        context = {
            'contest': contest
        }
        # 渲染模板显示
        return render(request, 'Contest/contest_frontshow.html', context)


class ListAllView(View): # 前台查询所有比赛
    def get(self,request):
        contests = Contest.objects.all()
        contestList = []
        for contest in contests:
            contestObj = {
                'contestId': contest.contestId,
                'contestName': contest.contestName,
            }
            contestList.append(contestObj)
        return JsonResponse(contestList, safe=False)


class UpdateView(BaseView):  # Ajax方式比赛更新
    def get(self, request, contestId):
        # GET方式请求查询比赛对象并返回比赛json格式
        contest = Contest.objects.get(contestId=contestId)
        return JsonResponse(contest.getJsonObj())

    def post(self, request, contestId):
        # POST方式提交比赛修改信息更新到数据库
        contest = Contest.objects.get(contestId=contestId)
        contest.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contest.contestItemObj.classId'))
        contest.contestName = request.POST.get('contest.contestName')
        try:
            contestPhotoName = self.uploadImageFile(request, 'contest.contestPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if contestPhotoName != 'img/NoImage.jpg':
            contest.contestPhoto = contestPhotoName
        contest.contestPlace = request.POST.get('contest.contestPlace')
        contest.contentDesc = request.POST.get('contest.contentDesc')
        contest.jubanfang = request.POST.get('contest.jubanfang')
        contest.personNum = int(request.POST.get('contest.personNum'))
        contest.startTime = request.POST.get('contest.startTime')
        contest.endTime = request.POST.get('contest.endTime')
        contest.signUpNum = int(request.POST.get('contest.signUpNum'))
        contest.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台比赛添加
    def get(self,request):
        contestItems = ContestItem.objects.all()  # 获取所有比赛项目
        context = {
            'contestItems': contestItems,
        }

        # 渲染显示模板界面
        return render(request, 'Contest/contest_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        contest = Contest() # 新建一个比赛对象然后获取参数
        contest.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contest.contestItemObj.classId'))
        contest.contestName = request.POST.get('contest.contestName')
        try:
            contest.contestPhoto = self.uploadImageFile(request,'contest.contestPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        contest.contestPlace = request.POST.get('contest.contestPlace')
        contest.contentDesc = request.POST.get('contest.contentDesc')
        contest.jubanfang = request.POST.get('contest.jubanfang')
        contest.personNum = int(request.POST.get('contest.personNum'))
        contest.startTime = request.POST.get('contest.startTime')
        contest.endTime = request.POST.get('contest.endTime')
        contest.signUpNum = int(request.POST.get('contest.signUpNum'))
        contest.save() # 保存比赛信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新比赛
    def get(self, request, contestId):
        context = {'contestId': contestId}
        return render(request, 'Contest/contest_modify.html', context)


class ListView(BaseView):  # 后台比赛列表
    def get(self, request):
        # 使用模板
        return render(request, 'Contest/contest_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        contestName = self.getStrParam(request, 'contestName')
        jubanfang = self.getStrParam(request, 'jubanfang')
        startTime = self.getStrParam(request, 'startTime')
        # 然后条件组合查询过滤
        contests = Contest.objects.all()
        if contestItemObj_classId != '0':
            contests = contests.filter(contestItemObj=contestItemObj_classId)
        if contestName != '':
            contests = contests.filter(contestName__contains=contestName)
        if jubanfang != '':
            contests = contests.filter(jubanfang__contains=jubanfang)
        if startTime != '':
            contests = contests.filter(startTime__contains=startTime)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(contests, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contests_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        contestList = []
        for contest in contests_page:
            contest = contest.getJsonObj()
            contestList.append(contest)
        # 构造模板页面需要的参数
        contest_res = {
            'rows': contestList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(contest_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除比赛信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        contestIds = self.getStrParam(request, 'contestIds')
        contestIds = contestIds.split(',')
        count = 0
        try:
            for contestId in contestIds:
                Contest.objects.get(contestId=contestId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出比赛信息到excel并下载
    def get(self, request):
        # 收集查询参数
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        contestName = self.getStrParam(request, 'contestName')
        jubanfang = self.getStrParam(request, 'jubanfang')
        startTime = self.getStrParam(request, 'startTime')
        # 然后条件组合查询过滤
        contests = Contest.objects.all()
        if contestItemObj_classId != '0':
            contests = contests.filter(contestItemObj=contestItemObj_classId)
        if contestName != '':
            contests = contests.filter(contestName__contains=contestName)
        if jubanfang != '':
            contests = contests.filter(jubanfang__contains=jubanfang)
        if startTime != '':
            contests = contests.filter(startTime__contains=startTime)
        #将查询结果集转换成列表
        contestList = []
        for contest in contests:
            contest = contest.getJsonObj()
            contestList.append(contest)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(contestList)
        # 设置要导入到excel的列
        columns_map = {
            'contestItemObj': '比赛项目',
            'contestName': '比赛名称',
            'contestPlace': '比赛地点',
            'startTime': '报名开始时间',
            'endTime': '截止报名时间',
            'signUpNum': '已报名人数',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'contests.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="contests.xlsx"'
        return response

