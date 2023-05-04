from django.shortcuts import render
from django.views.generic import View
from apps.Index.models import Admin
from apps.UserInfo.models import UserInfo
from apps.ContestItem.models import ContestItem
from apps.SignUp.models import SignUp
from apps.Court.models import Court
from apps.Jifen.models import Jifen
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from json import dumps


class IndexView(View):
    def get(self, request):
        # 显示首页,使用模板
        return render(request, 'index.html')


class FrontLoginView(View):
    # 前台登录
    def post(self,request):
        # 登录校验接收数据
        username = request.POST.get('userName')
        password = request.POST.get('password')
        try:
            userObj = UserInfo.objects.get(user_name=username, password=password)
            request.session['user_name'] = username
            data = {'msg': '登录成功', 'success': True}
        except UserInfo.DoesNotExist:
            # 用户名密码错误
            data = {'msg': '登录失败', 'success': False}
        # ensure_ascii=False用于处理中文
        return HttpResponse(dumps(data, ensure_ascii=False))


class FrontLoginOutView(View):
    def get(self,request):
        del request.session['user_name']  # 删除指定数据
        request.session.clear()  # 清空的是值
        request.session.flush()  # 键和值一起清空
        return HttpResponseRedirect(reverse("Index:index"))


class PersonStatisticView(View):
    #报名人数统计
    def get(self,request):
        return render(request,"statistic/personStatistic.html")
    def post(self,request):
        xData = []
        yData = []
        contestItems = ContestItem.objects.all()
        for contestItem in contestItems:
            xData.append(contestItem.className)
            signUps = SignUp.objects.all()
            signUps = signUps.filter(contestItemObj=contestItem.classId)
            yData.append(len(signUps))

        result = {
            'xData': xData,
            'yData': yData,
        }
        return JsonResponse(result, safe=False)

class CourtStatisticView(View):
    #比赛场次数量统计
    def get(self,request):
        return render(request,"statistic/courtStatistic.html")
    def post(self,request):
        xData = []
        yData = []
        contestItems = ContestItem.objects.all()
        for contestItem in contestItems:
            xData.append(contestItem.className)
            courts = Court.objects.all()
            courts = courts.filter(contestItemObj=contestItem.classId)
            yData.append(len(courts))

        result = {
            'xData': xData,
            'yData': yData,
        }
        return JsonResponse(result, safe=False)

class JifenStatisticView(View):
    #报名人数统计
    def get(self,request):
        return render(request,"statistic/jifenStatistic.html")
    def post(self,request):
        xData = []
        yData = []
        contestItems = ContestItem.objects.all()
        for contestItem in contestItems:
            xData.append(contestItem.className)

            sql = "select *  from t_Jifen,t_Contest where t_Jifen.contentObj=t_Contest.contestId and t_Contest.contestItemObj=" + str(contestItem.classId)
            # print(sql)
            jifens = Jifen.objects.raw(sql)
            totalScore = 0.0
            for jifen in jifens:
                totalScore = totalScore + jifen.score
            yData.append(totalScore)

        result = {
            'xData': xData,
            'yData': yData,
        }
        return JsonResponse(result, safe=False)


class LoginView(View):
    # 后台登录页面
    def get(self,request):
        return render(request, 'login.html')

    def post(self,request):
        # 登录校验接收数据
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            admin = Admin.objects.get(username=username, password=password)
            request.session['username'] = username
            data = {'msg': '登录成功', 'success': True}
        except Admin.DoesNotExist:
            # 用户名密码错误
            data = {'msg': '登录失败', 'success': False}
        # ensure_ascii=False用于处理中文
        return HttpResponse(dumps(data, ensure_ascii=False))


class LoginOutView(View):
    def get(self, request):
        # del request.session['username']  # 删除指定数据
        request.session.clear()  # 清空的是值
        request.session.flush()  # 键和值一起清空
        return redirect(reverse("Index:login"))


class MainView(View):
    # 后台主界面
    def get(self,request):
        return render(request, 'main.html')


class ChangePasswordView(View):
    def get(self, request):
        return render(request, 'password_modify.html')

    def post(self, request):
        oldPassword = request.POST.get('oldPassword')
        newPassword = request.POST.get('newPassword')
        newPassword2 = request.POST.get('newPassword2')


        if oldPassword == '':
            return render(request, 'message.html', {'message': '旧密码不正确！'})
        if newPassword == '':
            return render(request, 'message.html', {'message': '请输入新密码!'})
        if newPassword != newPassword2:
            return render(request, 'message.html', {'message': '两次新密码不一样！'})

        username = request.session['username']
        admin = Admin.objects.get(username=username)
        if oldPassword != admin.password:
            return render(request, 'message.html', {'message': '旧密码不正确！'})
        admin.password = newPassword
        admin.save()
        return render(request, 'message.html', {'message': '密码修改成功！'})









