from django.contrib import admin
from apps.ContestPlace.models import ContestPlace

# Register your models here.

admin.site.register(ContestPlace,admin.ModelAdmin)