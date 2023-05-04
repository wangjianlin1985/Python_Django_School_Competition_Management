from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.ContestItem.models import ContestItem
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台比赛项目添加
    def get(self,request):

        # 使用模板
        return render(request, 'ContestItem/contestItem_frontAdd.html')

    def post(self, request):
        contestItem = ContestItem() # 新建一个比赛项目对象然后获取参数
        contestItem.className = request.POST.get('contestItem.className')
        contestItem.classDesc = request.POST.get('contestItem.classDesc')
        contestItem.save() # 保存比赛项目信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改比赛项目
    def get(self, request, classId):
        context = {'classId': classId}
        return render(request, 'ContestItem/contestItem_frontModify.html', context)


class FrontListView(BaseView):  # 前台比赛项目查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        contestItems = ContestItem.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(contestItems, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contestItems_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'contestItems_page': contestItems_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'ContestItem/contestItem_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示比赛项目详情页
    def get(self, request, classId):
        # 查询需要显示的比赛项目对象
        contestItem = ContestItem.objects.get(classId=classId)
        context = {
            'contestItem': contestItem
        }
        # 渲染模板显示
        return render(request, 'ContestItem/contestItem_frontshow.html', context)


class ListAllView(View): # 前台查询所有比赛项目
    def get(self,request):
        contestItems = ContestItem.objects.all()
        contestItemList = []
        for contestItem in contestItems:
            contestItemObj = {
                'classId': contestItem.classId,
                'className': contestItem.className,
            }
            contestItemList.append(contestItemObj)
        return JsonResponse(contestItemList, safe=False)


class UpdateView(BaseView):  # Ajax方式比赛项目更新
    def get(self, request, classId):
        # GET方式请求查询比赛项目对象并返回比赛项目json格式
        contestItem = ContestItem.objects.get(classId=classId)
        return JsonResponse(contestItem.getJsonObj())

    def post(self, request, classId):
        # POST方式提交比赛项目修改信息更新到数据库
        contestItem = ContestItem.objects.get(classId=classId)
        contestItem.className = request.POST.get('contestItem.className')
        contestItem.classDesc = request.POST.get('contestItem.classDesc')
        contestItem.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台比赛项目添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'ContestItem/contestItem_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        contestItem = ContestItem() # 新建一个比赛项目对象然后获取参数
        contestItem.className = request.POST.get('contestItem.className')
        contestItem.classDesc = request.POST.get('contestItem.classDesc')
        contestItem.save() # 保存比赛项目信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新比赛项目
    def get(self, request, classId):
        context = {'classId': classId}
        return render(request, 'ContestItem/contestItem_modify.html', context)


class ListView(BaseView):  # 后台比赛项目列表
    def get(self, request):
        # 使用模板
        return render(request, 'ContestItem/contestItem_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        contestItems = ContestItem.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(contestItems, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contestItems_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        contestItemList = []
        for contestItem in contestItems_page:
            contestItem = contestItem.getJsonObj()
            contestItemList.append(contestItem)
        # 构造模板页面需要的参数
        contestItem_res = {
            'rows': contestItemList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(contestItem_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除比赛项目信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        classIds = self.getStrParam(request, 'classIds')
        classIds = classIds.split(',')
        count = 0
        try:
            for classId in classIds:
                ContestItem.objects.get(classId=classId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出比赛项目信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        contestItems = ContestItem.objects.all()
        #将查询结果集转换成列表
        contestItemList = []
        for contestItem in contestItems:
            contestItem = contestItem.getJsonObj()
            contestItemList.append(contestItem)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(contestItemList)
        # 设置要导入到excel的列
        columns_map = {
            'classId': '类别编号',
            'className': '类别名称',
            'classDesc': '类别描述',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'contestItems.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="contestItems.xlsx"'
        return response

