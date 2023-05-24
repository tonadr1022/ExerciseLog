from django.contrib import admin

# Register your models here.
from .models import Exercise, Shoe, WeatherInstance

admin.site.register(Exercise)
admin.site.register(Shoe)
admin.site.register(WeatherInstance)
