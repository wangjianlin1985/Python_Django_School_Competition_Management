from django.contrib import admin
from apps.DoctorTeam.models import DoctorTeam

# Register your models here.

admin.site.register(DoctorTeam,admin.ModelAdmin)