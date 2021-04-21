from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager


# Create your models here.

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, max_length=255)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email