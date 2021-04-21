import uuid
from datetime import date
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator
from patients.models import Patient



User = get_user_model()

# Create your models here.
class Appointment(models.Model):

    STATUS = [
        ('Pending', 'Pending'),
        ('Sent', 'Sent'),
        ('Confirmed', 'Confirmed'),
        ('Complete', 'Complete'),
        ('Feedback', 'Feedback'),

    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments")
    token = models.CharField(max_length=100, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    status = models.CharField( max_length=100, choices=STATUS, default="Pending")
    date_time = models.DateTimeField(default=timezone.now, validators=[MinValueValidator(limit_value=timezone.now, message="appointment must be in the future")])
    archived = models.BooleanField(default=False)

    
    def __str__(self):
        return f"Dr {self.clinician.last_name} with {self.patient.last_name} DOB: {self.patient.date_of_birth}"


class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(blank=True)
    answered = models.BooleanField(default=False)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name="questions")

    def __str__(self):
        return f"{self.content}"
