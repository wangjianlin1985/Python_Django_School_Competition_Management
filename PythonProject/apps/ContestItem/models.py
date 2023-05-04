from django.db import models


class ContestItem(models.Model):
    classId = models.AutoField(primary_key=True, verbose_name='类别编号')
    className = models.CharField(max_length=20, default='', verbose_name='类别名称')
    classDesc = models.CharField(max_length=800, default='', verbose_name='类别描述')

    class Meta:
        db_table = 't_ContestItem'
        verbose_name = '比赛项目信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        contestItem = {
            'classId': self.classId,
            'className': self.className,
            'classDesc': self.classDesc,
        }
        return contestItem

