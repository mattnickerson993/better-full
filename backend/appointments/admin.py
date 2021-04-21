from django.contrib import admin
from .models import Appointment, Question

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    
class AppointmentAdmin(admin.ModelAdmin):
    inlines = [
        QuestionInline,
    ]
    list_display=('patient', 'date_time')
    

admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(Question)