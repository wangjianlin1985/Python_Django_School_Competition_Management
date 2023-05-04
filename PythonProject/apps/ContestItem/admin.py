from django.contrib import admin
from apps.ContestItem.models import ContestItem

# Register your models here.

admin.site.register(ContestItem,admin.ModelAdmin)