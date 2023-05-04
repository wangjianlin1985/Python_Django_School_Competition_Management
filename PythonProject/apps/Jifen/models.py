from django.db import models
from apps.Contest.models import Contest
from apps.Court.models import Court
from apps.UserInfo.models import UserInfo


class Jifen(models.Model):
    jifenId = models.AutoField(primary_key=True, verbose_name='积分id')
    courtObj = models.ForeignKey(Court,  db_column='courtObj', on_delete=models.PROTECT, verbose_name='比赛场次')
    contentObj = models.ForeignKey(Contest,  db_column='contentObj', on_delete=models.PROTECT, verbose_name='比赛名称')
    userObj = models.ForeignKey(UserInfo,  db_column='userObj', on_delete=models.PROTECT, verbose_name='比赛用户')
    score = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='用户积分')
    jifenMemo = models.CharField(max_length=500, default='', verbose_name='附加信息')
    addTime = models.CharField(max_length=20, default='', verbose_name='添加时间')

    class Meta:
        db_table = 't_Jifen'
        verbose_name = '比赛积分信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        jifen = {
            'jifenId': self.jifenId,
            'courtObj': self.courtObj.courtName,
            'courtObjPri': self.courtObj.courtId,
            'contentObj': self.contentObj.contestName,
            'contentObjPri': self.contentObj.contestId,
            'userObj': self.userObj.name,
            'userObjPri': self.userObj.user_name,
            'score': self.score,
            'jifenMemo': self.jifenMemo,
            'addTime': self.addTime,
        }
        return jifen

