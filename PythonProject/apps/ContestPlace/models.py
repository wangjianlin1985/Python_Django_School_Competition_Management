from django.db import models
from apps.ContestItem.models import ContestItem


class ContestPlace(models.Model):
    placeNo = models.CharField(max_length=20, default='', primary_key=True, verbose_name='场地编号')
    contestItemObj = models.ForeignKey(ContestItem,  db_column='contestItemObj', on_delete=models.PROTECT, verbose_name='运动项目')
    placeName = models.CharField(max_length=20, default='', verbose_name='场地名称')
    placeArea = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='场地面积')
    placePhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='场地照片')
    useDate = models.CharField(max_length=20, default='', verbose_name='投入使用时间')
    placeDesc = models.CharField(max_length=800, default='', verbose_name='场地描述')

    class Meta:
        db_table = 't_ContestPlace'
        verbose_name = '比赛场地信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        contestPlace = {
            'placeNo': self.placeNo,
            'contestItemObj': self.contestItemObj.className,
            'contestItemObjPri': self.contestItemObj.classId,
            'placeName': self.placeName,
            'placeArea': self.placeArea,
            'placePhoto': self.placePhoto.url,
            'useDate': self.useDate,
            'placeDesc': self.placeDesc,
        }
        return contestPlace

