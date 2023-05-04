from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.ContestPlace.models import ContestPlace
from apps.ContestItem.models import ContestItem
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台比赛场地添加
    def primaryKeyExist(self, placeNo):  # 判断主键是否存在
        try:
            ContestPlace.objects.get(placeNo=placeNo)
            return True
        except ContestPlace.DoesNotExist:
            return False

    def get(self,request):
        contestItems = ContestItem.objects.all()  # 获取所有比赛项目
        context = {
            'contestItems': contestItems,
        }

        # 使用模板
        return render(request, 'ContestPlace/contestPlace_frontAdd.html', context)

    def post(self, request):
        placeNo = request.POST.get('contestPlace.placeNo') # 判断场地编号是否存在
        if self.primaryKeyExist(placeNo):
            return JsonResponse({'success': False, 'message': '场地编号已经存在'})

        contestPlace = ContestPlace() # 新建一个比赛场地对象然后获取参数
        contestPlace.placeNo = placeNo
        contestPlace.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contestPlace.contestItemObj.classId'))
        contestPlace.placeName = request.POST.get('contestPlace.placeName')
        contestPlace.placeArea = float(request.POST.get('contestPlace.placeArea'))
        try:
            contestPlace.placePhoto = self.uploadImageFile(request,'contestPlace.placePhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        contestPlace.useDate = request.POST.get('contestPlace.useDate')
        contestPlace.placeDesc = request.POST.get('contestPlace.placeDesc')
        contestPlace.save() # 保存比赛场地信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改比赛场地
    def get(self, request, placeNo):
        context = {'placeNo': placeNo}
        return render(request, 'ContestPlace/contestPlace_frontModify.html', context)


class FrontListView(BaseView):  # 前台比赛场地查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        placeNo = self.getStrParam(request, 'placeNo')
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        placeName = self.getStrParam(request, 'placeName')
        useDate = self.getStrParam(request, 'useDate')
        # 然后条件组合查询过滤
        contestPlaces = ContestPlace.objects.all()
        if placeNo != '':
            contestPlaces = contestPlaces.filter(placeNo__contains=placeNo)
        if contestItemObj_classId != '0':
            contestPlaces = contestPlaces.filter(contestItemObj=contestItemObj_classId)
        if placeName != '':
            contestPlaces = contestPlaces.filter(placeName__contains=placeName)
        if useDate != '':
            contestPlaces = contestPlaces.filter(useDate__contains=useDate)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(contestPlaces, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contestPlaces_page = self.paginator.page(self.currentPage)

        # 获取所有比赛项目
        contestItems = ContestItem.objects.all()
        # 构造模板需要的参数
        context = {
            'contestItems': contestItems,
            'contestPlaces_page': contestPlaces_page,
            'placeNo': placeNo,
            'contestItemObj_classId': int(contestItemObj_classId),
            'placeName': placeName,
            'useDate': useDate,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'ContestPlace/contestPlace_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示比赛场地详情页
    def get(self, request, placeNo):
        # 查询需要显示的比赛场地对象
        contestPlace = ContestPlace.objects.get(placeNo=placeNo)
        context = {
            'contestPlace': contestPlace
        }
        # 渲染模板显示
        return render(request, 'ContestPlace/contestPlace_frontshow.html', context)


class ListAllView(View): # 前台查询所有比赛场地
    def get(self,request):
        contestPlaces = ContestPlace.objects.all()
        contestPlaceList = []
        for contestPlace in contestPlaces:
            contestPlaceObj = {
                'placeNo': contestPlace.placeNo,
                'placeName': contestPlace.placeName,
            }
            contestPlaceList.append(contestPlaceObj)
        return JsonResponse(contestPlaceList, safe=False)


class UpdateView(BaseView):  # Ajax方式比赛场地更新
    def get(self, request, placeNo):
        # GET方式请求查询比赛场地对象并返回比赛场地json格式
        contestPlace = ContestPlace.objects.get(placeNo=placeNo)
        return JsonResponse(contestPlace.getJsonObj())

    def post(self, request, placeNo):
        # POST方式提交比赛场地修改信息更新到数据库
        contestPlace = ContestPlace.objects.get(placeNo=placeNo)
        contestPlace.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contestPlace.contestItemObj.classId'))
        contestPlace.placeName = request.POST.get('contestPlace.placeName')
        contestPlace.placeArea = float(request.POST.get('contestPlace.placeArea'))
        try:
            placePhotoName = self.uploadImageFile(request, 'contestPlace.placePhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if placePhotoName != 'img/NoImage.jpg':
            contestPlace.placePhoto = placePhotoName
        contestPlace.useDate = request.POST.get('contestPlace.useDate')
        contestPlace.placeDesc = request.POST.get('contestPlace.placeDesc')
        contestPlace.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台比赛场地添加
    def primaryKeyExist(self, placeNo):  # 判断主键是否存在
        try:
            ContestPlace.objects.get(placeNo=placeNo)
            return True
        except ContestPlace.DoesNotExist:
            return False

    def get(self,request):
        contestItems = ContestItem.objects.all()  # 获取所有比赛项目
        context = {
            'contestItems': contestItems,
        }

        # 渲染显示模板界面
        return render(request, 'ContestPlace/contestPlace_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        placeNo = request.POST.get('contestPlace.placeNo') # 判断场地编号是否存在
        if self.primaryKeyExist(placeNo):
            return JsonResponse({'success': False, 'message': '场地编号已经存在'})

        contestPlace = ContestPlace() # 新建一个比赛场地对象然后获取参数
        contestPlace.placeNo = placeNo
        contestPlace.contestItemObj = ContestItem.objects.get(classId=request.POST.get('contestPlace.contestItemObj.classId'))
        contestPlace.placeName = request.POST.get('contestPlace.placeName')
        contestPlace.placeArea = float(request.POST.get('contestPlace.placeArea'))
        try:
            contestPlace.placePhoto = self.uploadImageFile(request,'contestPlace.placePhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        contestPlace.useDate = request.POST.get('contestPlace.useDate')
        contestPlace.placeDesc = request.POST.get('contestPlace.placeDesc')
        contestPlace.save() # 保存比赛场地信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新比赛场地
    def get(self, request, placeNo):
        context = {'placeNo': placeNo}
        return render(request, 'ContestPlace/contestPlace_modify.html', context)


class ListView(BaseView):  # 后台比赛场地列表
    def get(self, request):
        # 使用模板
        return render(request, 'ContestPlace/contestPlace_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        placeNo = self.getStrParam(request, 'placeNo')
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        placeName = self.getStrParam(request, 'placeName')
        useDate = self.getStrParam(request, 'useDate')
        # 然后条件组合查询过滤
        contestPlaces = ContestPlace.objects.all()
        if placeNo != '':
            contestPlaces = contestPlaces.filter(placeNo__contains=placeNo)
        if contestItemObj_classId != '0':
            contestPlaces = contestPlaces.filter(contestItemObj=contestItemObj_classId)
        if placeName != '':
            contestPlaces = contestPlaces.filter(placeName__contains=placeName)
        if useDate != '':
            contestPlaces = contestPlaces.filter(useDate__contains=useDate)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(contestPlaces, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        contestPlaces_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        contestPlaceList = []
        for contestPlace in contestPlaces_page:
            contestPlace = contestPlace.getJsonObj()
            contestPlaceList.append(contestPlace)
        # 构造模板页面需要的参数
        contestPlace_res = {
            'rows': contestPlaceList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(contestPlace_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除比赛场地信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        placeNos = self.getStrParam(request, 'placeNos')
        placeNos = placeNos.split(',')
        count = 0
        try:
            for placeNo in placeNos:
                ContestPlace.objects.get(placeNo=placeNo).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出比赛场地信息到excel并下载
    def get(self, request):
        # 收集查询参数
        placeNo = self.getStrParam(request, 'placeNo')
        contestItemObj_classId = self.getIntParam(request, 'contestItemObj.classId')
        placeName = self.getStrParam(request, 'placeName')
        useDate = self.getStrParam(request, 'useDate')
        # 然后条件组合查询过滤
        contestPlaces = ContestPlace.objects.all()
        if placeNo != '':
            contestPlaces = contestPlaces.filter(placeNo__contains=placeNo)
        if contestItemObj_classId != '0':
            contestPlaces = contestPlaces.filter(contestItemObj=contestItemObj_classId)
        if placeName != '':
            contestPlaces = contestPlaces.filter(placeName__contains=placeName)
        if useDate != '':
            contestPlaces = contestPlaces.filter(useDate__contains=useDate)
        #将查询结果集转换成列表
        contestPlaceList = []
        for contestPlace in contestPlaces:
            contestPlace = contestPlace.getJsonObj()
            contestPlaceList.append(contestPlace)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(contestPlaceList)
        # 设置要导入到excel的列
        columns_map = {
            'placeNo': '场地编号',
            'contestItemObj': '运动项目',
            'placeName': '场地名称',
            'placeArea': '场地面积',
            'useDate': '投入使用时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'contestPlaces.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="contestPlaces.xlsx"'
        return response

