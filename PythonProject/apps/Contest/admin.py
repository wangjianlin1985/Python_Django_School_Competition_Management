from django.contrib import admin
from apps.Contest.models import Contest

# Register your models here.

admin.site.register(Contest,admin.ModelAdmin)