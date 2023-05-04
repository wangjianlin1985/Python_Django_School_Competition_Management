from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.DoctorTeam.models import DoctorTeam
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台医护团队添加
    def get(self,request):

        # 使用模板
        return render(request, 'DoctorTeam/doctorTeam_frontAdd.html')

    def post(self, request):
        doctorTeam = DoctorTeam() # 新建一个医护团队对象然后获取参数
        doctorTeam.teamName = request.POST.get('doctorTeam.teamName')
        try:
            doctorTeam.teamPhoto = self.uploadImageFile(request,'doctorTeam.teamPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        doctorTeam.useState = request.POST.get('doctorTeam.useState')
        doctorTeam.bornDate = request.POST.get('doctorTeam.bornDate')
        doctorTeam.chargeMan = request.POST.get('doctorTeam.chargeMan')
        doctorTeam.connectPhone = request.POST.get('doctorTeam.connectPhone')
        doctorTeam.teamDesc = request.POST.get('doctorTeam.teamDesc')
        doctorTeam.save() # 保存医护团队信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改医护团队
    def get(self, request, teamId):
        context = {'teamId': teamId}
        return render(request, 'DoctorTeam/doctorTeam_frontModify.html', context)


class FrontListView(BaseView):  # 前台医护团队查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        teamName = self.getStrParam(request, 'teamName')
        useState = self.getStrParam(request, 'useState')
        bornDate = self.getStrParam(request, 'bornDate')
        # 然后条件组合查询过滤
        doctorTeams = DoctorTeam.objects.all()
        if teamName != '':
            doctorTeams = doctorTeams.filter(teamName__contains=teamName)
        if useState != '':
            doctorTeams = doctorTeams.filter(useState__contains=useState)
        if bornDate != '':
            doctorTeams = doctorTeams.filter(bornDate__contains=bornDate)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(doctorTeams, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        doctorTeams_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'doctorTeams_page': doctorTeams_page,
            'teamName': teamName,
            'useState': useState,
            'bornDate': bornDate,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'DoctorTeam/doctorTeam_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示医护团队详情页
    def get(self, request, teamId):
        # 查询需要显示的医护团队对象
        doctorTeam = DoctorTeam.objects.get(teamId=teamId)
        context = {
            'doctorTeam': doctorTeam
        }
        # 渲染模板显示
        return render(request, 'DoctorTeam/doctorTeam_frontshow.html', context)


class ListAllView(View): # 前台查询所有医护团队
    def get(self,request):
        doctorTeams = DoctorTeam.objects.all()
        doctorTeamList = []
        for doctorTeam in doctorTeams:
            doctorTeamObj = {
                'teamId': doctorTeam.teamId,
                'teamName': doctorTeam.teamName,
            }
            doctorTeamList.append(doctorTeamObj)
        return JsonResponse(doctorTeamList, safe=False)


class UpdateView(BaseView):  # Ajax方式医护团队更新
    def get(self, request, teamId):
        # GET方式请求查询医护团队对象并返回医护团队json格式
        doctorTeam = DoctorTeam.objects.get(teamId=teamId)
        return JsonResponse(doctorTeam.getJsonObj())

    def post(self, request, teamId):
        # POST方式提交医护团队修改信息更新到数据库
        doctorTeam = DoctorTeam.objects.get(teamId=teamId)
        doctorTeam.teamName = request.POST.get('doctorTeam.teamName')
        try:
            teamPhotoName = self.uploadImageFile(request, 'doctorTeam.teamPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if teamPhotoName != 'img/NoImage.jpg':
            doctorTeam.teamPhoto = teamPhotoName
        doctorTeam.useState = request.POST.get('doctorTeam.useState')
        doctorTeam.bornDate = request.POST.get('doctorTeam.bornDate')
        doctorTeam.chargeMan = request.POST.get('doctorTeam.chargeMan')
        doctorTeam.connectPhone = request.POST.get('doctorTeam.connectPhone')
        doctorTeam.teamDesc = request.POST.get('doctorTeam.teamDesc')
        doctorTeam.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台医护团队添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'DoctorTeam/doctorTeam_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        doctorTeam = DoctorTeam() # 新建一个医护团队对象然后获取参数
        doctorTeam.teamName = request.POST.get('doctorTeam.teamName')
        try:
            doctorTeam.teamPhoto = self.uploadImageFile(request,'doctorTeam.teamPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        doctorTeam.useState = request.POST.get('doctorTeam.useState')
        doctorTeam.bornDate = request.POST.get('doctorTeam.bornDate')
        doctorTeam.chargeMan = request.POST.get('doctorTeam.chargeMan')
        doctorTeam.connectPhone = request.POST.get('doctorTeam.connectPhone')
        doctorTeam.teamDesc = request.POST.get('doctorTeam.teamDesc')
        doctorTeam.save() # 保存医护团队信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新医护团队
    def get(self, request, teamId):
        context = {'teamId': teamId}
        return render(request, 'DoctorTeam/doctorTeam_modify.html', context)


class ListView(BaseView):  # 后台医护团队列表
    def get(self, request):
        # 使用模板
        return render(request, 'DoctorTeam/doctorTeam_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        teamName = self.getStrParam(request, 'teamName')
        useState = self.getStrParam(request, 'useState')
        bornDate = self.getStrParam(request, 'bornDate')
        # 然后条件组合查询过滤
        doctorTeams = DoctorTeam.objects.all()
        if teamName != '':
            doctorTeams = doctorTeams.filter(teamName__contains=teamName)
        if useState != '':
            doctorTeams = doctorTeams.filter(useState__contains=useState)
        if bornDate != '':
            doctorTeams = doctorTeams.filter(bornDate__contains=bornDate)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(doctorTeams, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        doctorTeams_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        doctorTeamList = []
        for doctorTeam in doctorTeams_page:
            doctorTeam = doctorTeam.getJsonObj()
            doctorTeamList.append(doctorTeam)
        # 构造模板页面需要的参数
        doctorTeam_res = {
            'rows': doctorTeamList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(doctorTeam_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除医护团队信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        teamIds = self.getStrParam(request, 'teamIds')
        teamIds = teamIds.split(',')
        count = 0
        try:
            for teamId in teamIds:
                DoctorTeam.objects.get(teamId=teamId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出医护团队信息到excel并下载
    def get(self, request):
        # 收集查询参数
        teamName = self.getStrParam(request, 'teamName')
        useState = self.getStrParam(request, 'useState')
        bornDate = self.getStrParam(request, 'bornDate')
        # 然后条件组合查询过滤
        doctorTeams = DoctorTeam.objects.all()
        if teamName != '':
            doctorTeams = doctorTeams.filter(teamName__contains=teamName)
        if useState != '':
            doctorTeams = doctorTeams.filter(useState__contains=useState)
        if bornDate != '':
            doctorTeams = doctorTeams.filter(bornDate__contains=bornDate)
        #将查询结果集转换成列表
        doctorTeamList = []
        for doctorTeam in doctorTeams:
            doctorTeam = doctorTeam.getJsonObj()
            doctorTeamList.append(doctorTeam)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(doctorTeamList)
        # 设置要导入到excel的列
        columns_map = {
            'teamId': '团队id',
            'teamName': '团队名称',
            'useState': '使用状态',
            'bornDate': '成立日期',
            'chargeMan': '负责人',
            'connectPhone': '联系电话',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'doctorTeams.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="doctorTeams.xlsx"'
        return response

