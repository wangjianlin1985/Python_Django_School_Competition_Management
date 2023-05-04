from django.db import models
from tinymce.models import HTMLField


class DoctorTeam(models.Model):
    teamId = models.AutoField(primary_key=True, verbose_name='团队id')
    teamName = models.CharField(max_length=20, default='', verbose_name='团队名称')
    teamPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='团队照片')
    useState = models.CharField(max_length=20, default='', verbose_name='使用状态')
    bornDate = models.CharField(max_length=20, default='', verbose_name='成立日期')
    chargeMan = models.CharField(max_length=20, default='', verbose_name='负责人')
    connectPhone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    teamDesc = HTMLField(max_length=5000, verbose_name='团队介绍')

    class Meta:
        db_table = 't_DoctorTeam'
        verbose_name = '医护团队信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        doctorTeam = {
            'teamId': self.teamId,
            'teamName': self.teamName,
            'teamPhoto': self.teamPhoto.url,
            'useState': self.useState,
            'bornDate': self.bornDate,
            'chargeMan': self.chargeMan,
            'connectPhone': self.connectPhone,
            'teamDesc': self.teamDesc,
        }
        return doctorTeam

