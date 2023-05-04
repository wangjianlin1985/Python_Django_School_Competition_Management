from django.db import models
from apps.ContestItem.models import ContestItem
from tinymce.models import HTMLField


class Contest(models.Model):
    contestId = models.AutoField(primary_key=True, verbose_name='比赛id')
    contestItemObj = models.ForeignKey(ContestItem,  db_column='contestItemObj', on_delete=models.PROTECT, verbose_name='比赛项目')
    contestName = models.CharField(max_length=20, default='', verbose_name='比赛名称')
    contestPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='比赛照片')
    contestPlace = models.CharField(max_length=50, default='', verbose_name='比赛地点')
    contentDesc = HTMLField(max_length=5000, verbose_name='比赛介绍')
    jubanfang = models.CharField(max_length=20, default='', verbose_name='举办方')
    personNum = models.IntegerField(default=0,verbose_name='人数限制')
    startTime = models.CharField(max_length=20, default='', verbose_name='报名开始时间')
    endTime = models.CharField(max_length=20, default='', verbose_name='截止报名时间')
    signUpNum = models.IntegerField(default=0,verbose_name='已报名人数')

    class Meta:
        db_table = 't_Contest'
        verbose_name = '比赛信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        contest = {
            'contestId': self.contestId,
            'contestItemObj': self.contestItemObj.className,
            'contestItemObjPri': self.contestItemObj.classId,
            'contestName': self.contestName,
            'contestPhoto': self.contestPhoto.url,
            'contestPlace': self.contestPlace,
            'contentDesc': self.contentDesc,
            'jubanfang': self.jubanfang,
            'personNum': self.personNum,
            'startTime': self.startTime,
            'endTime': self.endTime,
            'signUpNum': self.signUpNum,
        }
        return contest

