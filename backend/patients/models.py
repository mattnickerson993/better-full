import uuid
from datetime import date
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MaxValueValidator
User = get_user_model()

# Create your models here.
class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clinician  = models.ForeignKey(User, on_delete=models.CASCADE, related_name="patients")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth= models.DateField(validators=[MaxValueValidator(limit_value=date.today(), message="Birthday cannot be in the future")])
    email = models.EmailField(max_length=100)
    token = models.CharField(max_length=100, blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"